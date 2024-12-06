const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res, next) => {
    const { category, limit, period, startDate } = req.body;
    try {
        const budget = new Budget({
            userID: req.user.id,
            category,
            limit,
            period,
            startDate,
        });
        await budget.save();
        res.status(201).json(budget);
    } catch (e) {
        next(e);
    }
});

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const budgets = await Budget.find({ userID: req.user.id });
        res.json(budgets);
    } catch (e) {
        next(e);
    }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
    const { category, limit, period, startDate } = req.body;
    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userID: req.user.id },
            { category, limit, period, startDate },
            { new: true }
        );
        if (!budget) {
            throw Object.assign(new Error('Budget not found'), { statusCode: 404 });
        }
        res.json(budget);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, userID: req.user.id });
        if (!budget) {
            throw Object.assign(new Error('Budget not found'), { statusCode: 404 });
        }
        res.json({ message: 'Budget deleted' });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
