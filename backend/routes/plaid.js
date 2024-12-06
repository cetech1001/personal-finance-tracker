const express = require('express');
const router = express.Router();
const {Configuration, PlaidApi, PlaidEnvironments} = require('plaid');
const authMiddleware = require('../middleware/auth');
const BankAccount = require('../models/bank-account');
const Transaction = require('../models/transaction');
require('dotenv').config();


const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const client = new PlaidApi(configuration);

router.post('/create_link_token', authMiddleware, async (req, res) => {
    try {
        const response = await client.linkTokenCreate({
            user: { client_user_id: req.user.id },
            client_name: 'Personal Finance Tracker',
            products: ['transactions'],
            country_codes: ['GB'],
            language: 'en',
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not create link token' });
    }
});

router.post('/exchange_public_token', authMiddleware, async (req, res) => {
    const { public_token } = req.body;
    try {
        const response = await client.itemPublicTokenExchange({ public_token });
        const { access_token, item_id } = response.data;
        const identityResponse = await client.identityGet({
            access_token,
        });
        const accounts = identityResponse.data.accounts.map((account) => ({
            accountID: account.account_id,
            name: account.name,
            officialName: account.official_name,
            type: account.type,
            subtype: account.subtype,
            balances: account.balances,
        }));
        const bankAccount = new BankAccount({
            userID: req.user.id,
            accessToken: access_token,
            itemID: item_id,
            institutionName: identityResponse.data.item.institution_name,
            accounts,
        });
        await bankAccount.save();
        res.json({ bankAccountID: bankAccount._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not exchange public token' });
    }
});

router.get('/bank_accounts', authMiddleware, async (req, res) => {
    try {
        const bankAccounts = await BankAccount.find({ userID: req.user.id });
        res.json(bankAccounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch bank accounts' });
    }
});

router.get('/transactions/:bankAccountID', authMiddleware, async (req, res) => {
    try {
        const bankAccount = await BankAccount.findOne({ userID: req.user.id, _id: req.params.bankAccountID });
        let response = { data: [] };
        let cursor = null;
        const transactions = [];
        let count = 0;

        if (bankAccount) {
            do {
                response = await client.transactionsSync({
                    access_token: bankAccount.accessToken,
                    cursor,
                });
                transactions.push(...response.data.added.map(transaction => ({
                    userID: req.user.id,
                    accountID: req.params.bankAccountID,
                    type: transaction.amount < 0 ? 'income' : 'expense',
                    category: formatCategory(transaction.personal_finance_category.primary),
                    amount: transaction.amount < 0 ? transaction.amount * -1 : transaction.amount,
                    currency: transaction.iso_currency_code,
                    date: transaction.date,
                    notes: transaction.name,
                    source: 'Plaid',
                })));
                cursor = response.data.next_cursor;
                count++;
            } while (count < 5);

            if (transactions.length > 0) {
                await Transaction.insertMany(transactions, { ordered: false });
                res.json({ message: 'Transaction successfully fetched' });
            } else {
                res.json({ message: 'No transactions found' });
            }
        } else {
            res.status(404).json({ error: 'No bank account found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch transactions' });
    }
});

function formatCategory(text) {
    const words = text.split('_');
    const titleCasedWords = words.map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return titleCasedWords.join(' ');
}

module.exports = router;
