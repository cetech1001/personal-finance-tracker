const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
