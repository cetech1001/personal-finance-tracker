const express = require('express');
const router = express.Router();
const {Configuration, PlaidApi, PlaidEnvironments} = require('plaid');
const authMiddleware = require('../middleware/auth');
const BankAccount = require('../models/bank-account');
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
        res.json(bankAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not exchange public token' });
    }
});

router.get('/bank_accounts', authMiddleware, async (req, res) => {
    try {
        const bankAccounts = await BankAccount.find({ userId: req.user.id });
        res.json(bankAccounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch bank accounts' });
    }
});

router.get('/transactions', authMiddleware, async (req, res) => {
    try {
        const bankAccounts = await BankAccount.find({ userId: req.user.id });
        const allTransactions = [];

        for (const bank of bankAccounts) {
            const response = await client.getTransactions(
                bank.accessToken,
                '2020-01-01',
                new Date().toISOString().split('T')[0]
            );
            allTransactions.push(...response.transactions);
        }

        //ToDo: Process and save transactions to database

        res.json(allTransactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch transactions' });
    }
});

module.exports = router;
