const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, maxLength: 3, minLength: 3 },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    source: { type: String },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
