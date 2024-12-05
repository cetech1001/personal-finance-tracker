const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
    startDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Budget', BudgetSchema);
