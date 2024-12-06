const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
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
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const budgets = await Budget.find({ userID: req.user.id });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { category, limit, period, startDate } = req.body;
    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userID: req.user.id },
            { category, limit, period, startDate },
            { new: true }
        );
        if (!budget) return res.status(404).json({ error: 'Budget not found' });
        res.json(budget);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, userID: req.user.id });
        if (!budget) return res.status(404).json({ error: 'Budget not found' });
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
