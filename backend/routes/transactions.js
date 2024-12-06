const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
    const { type, category, amount, date, notes } = req.body;
    try {
        const transaction = new Transaction({
            userID: req.user.id,
            accountID: null,
            currency: 'GBP',
            type,
            category,
            amount,
            date,
            notes,
        });
        await transaction.save();
        const budgets = await Budget.find({ userID: req.user.id, category: transaction.category });
        for (const budget of budgets) {
            const periodStart = new Date();
            periodStart.setDate(1);
            const expenses = await Transaction.aggregate([
                {
                    $match: {
                        userID: req.user.id,
                        category: budget.category,
                        type: 'expense',
                        date: { $gte: periodStart },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                    },
                },
            ]);
            const totalExpenses = expenses[0]?.total || 0;
            if (totalExpenses > budget.limit) {
                return res.json({ transaction, warning: `Budget exceeded for category ${budget.category}` });
            }
        }
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        let accountID = req.query.accountID
            ? (req.query.accountID === 'custom' ? null : req.query.accountID)
            : null;
        const filter = { userID: req.user.id, accountID };

        const [transactions, total] = await Promise.all([
            Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
            Transaction.countDocuments(filter)
        ]);

        res.json({
            transactions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/summary', authMiddleware, async (req, res) => {
    let accountID = req.query.accountID;
    if (!accountID || accountID === 'custom') {
        accountID = null;
    }
    const result = await Transaction.aggregate([
        { $match: { userID: req.user.id, accountID } },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: { $cond: [ { $eq: ["$type", "income"] }, "$amount", 0 ] } },
                totalExpenses: { $sum: { $cond: [ { $eq: ["$type", "expense"] }, "$amount", 0 ] } }
            }
        }
    ]);

    res.json({
        totalIncome: result[0]?.totalIncome || 0,
        totalExpenses: result[0]?.totalExpenses || 0,
        totalBalance: (result[0]?.totalIncome || 0) - (result[0]?.totalExpenses || 0)
    });
});

router.get('/spending-data', authMiddleware, async (req, res) => {
    let accountID = req.query.accountID;
    if (!accountID || accountID === 'custom') {
        accountID = null;
    }

    const data = await Transaction.aggregate([
        { $match: { userID: req.user.id, accountID, type: "expense" } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $project: { category: "$_id", total: 1, date: "$date", _id: 0 } }
    ]);

    res.json(data);
});


router.put('/:id', authMiddleware, async (req, res) => {
    const { type, category, amount, date, notes } = req.body;
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userID: req.user.id },
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
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userID: req.user.id });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
