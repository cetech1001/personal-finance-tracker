const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const BankAccount = require('../models/bank-account');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res, next) => {
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
    } catch (e) {
        next(e);
    }
});

router.get('/', authMiddleware, async (req, res, next) => {
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
    } catch (e) {
        next(e);
    }
});

router.get('/summary', authMiddleware, async (req, res, next) => {
    try {
        let accountID = req.query.accountID;
        if (!accountID || accountID === 'custom') {
            accountID = null;
        }

        const matchFilter = {
            userID: new mongoose.Types.ObjectId(req.user.id),
            accountID: new mongoose.Types.ObjectId(accountID),
        };

        const result = await Transaction.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $cond: [ { $eq: ["$type", "income"] }, "$amount", 0 ] } },
                    totalExpenses: { $sum: { $cond: [ { $eq: ["$type", "expense"] }, "$amount", 0 ] } }
                }
            }
        ]);

        let account = null;
        if (accountID) {
            account = await BankAccount.findOne({ _id: matchFilter.accountID });
        }

        res.json({
            totalIncome: result[0]?.totalIncome || 0,
            totalExpenses: result[0]?.totalExpenses || 0,
            totalBalance: account ? account.accounts[0].balances.available : 0,
        });
    } catch (e) {
        next(e);
    }
});

router.get('/spending-data', authMiddleware, async (req, res, next) => {
    try {
        let { startDate, endDate, accountID } = req.query;

        if (!accountID || accountID === 'custom') {
            accountID = null;
        }

        const matchFilter = {
            userID: new mongoose.Types.ObjectId(req.user.id),
            accountID: new mongoose.Types.ObjectId(accountID),
            type: 'expense',
        };

        if (startDate && endDate) {
            matchFilter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const data = await Transaction.aggregate([
            { $match: matchFilter },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $project: { _id: 0, category: "$_id", total: 1, date: '$date' } },
        ]);

        res.json(data);
    } catch (e) {
        next(e);
    }
});


router.put('/:id', authMiddleware, async (req, res, next) => {
    const { type, category, amount, date, notes } = req.body;
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userID: req.user.id },
            { type, category, amount, date, notes },
            { new: true }
        );
        if (!transaction) {
            throw Object.assign(new Error('Transaction not found.'), { statusCode: 404 });
        }
        res.json(transaction);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userID: req.user.id });
        if (!transaction) {
            throw Object.assign(new Error('Transaction not found.'), { statusCode: 404 });
        }
        res.json({ message: 'Transaction deleted' });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
