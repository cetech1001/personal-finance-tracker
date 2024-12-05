const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String, required: true },
    itemID: { type: String, required: true },
    institutionName: { type: String },
    accounts: [
        {
            accountID: { type: String },
            name: { type: String },
            officialName: { type: String },
            type: { type: String },
            subtype: { type: String },
            balances: { type: Object },
        },
    ],
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);
