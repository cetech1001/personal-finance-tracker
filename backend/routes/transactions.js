const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
    const { type, category, amount, date, notes } = req.body;
    try {
        const transaction = new Transaction({
            userId: req.user.id,
            type,
            category,
            amount,
            date,
            notes,
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { type, category, amount, date, notes } = req.body;
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { type, category, amount, date, notes },
            { new: true }
        );
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
