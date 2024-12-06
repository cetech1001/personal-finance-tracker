const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

router.post('/register', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            throw Object.assign(new Error('User already exists'), { statusCode: 400 });
        }

        user = new User({ email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user._id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (e, token) => {
                if (e) {
                    throw e;
                }
                res.json({ token, user: { id: user._id, email: user.email } });
            }
        );
    } catch (e) {
        next(e);
    }
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            throw Object.assign(new Error('Invalid credentials'), { statusCode: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw Object.assign(new Error('Invalid credentials'), { statusCode: 400 });
        }

        const payload = { user: { id: user._id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (e, token) => {
                if (e) throw e;
                res.json({ token, user: { id: user._id, email: user.email } });
            }
        );
    } catch (e) {
        next(e);
    }
});

router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
