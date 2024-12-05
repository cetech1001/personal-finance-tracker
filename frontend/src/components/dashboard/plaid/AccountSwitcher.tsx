import React, { useState, useEffect, useContext } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from '../../../utils/axios-config';
import { TransactionContext } from '../../../context/TransactionContext';

interface BankAccount {
	_id: string;
	institutionName: string;
	accounts: any[];
}

export const AccountSwitcher = () => {
	const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
	const [selectedAccount, setSelectedAccount] = useState('custom');
	const { fetchTransactions } = useContext(TransactionContext);

	const fetchAccounts = async () => {
		const response = await axios.get('/api/plaid/bank_accounts');
		const bankAccounts = response.data;
		const accountList = bankAccounts.map((bank: BankAccount) => ({
			id: bank._id,
			name: bank.institutionName,
		}));
		setAccounts([{ id: 'custom', name: 'Custom Account' }, ...accountList]);
	};

	useEffect(() => {
		fetchAccounts();
	}, []);

	const handleChange = (event: any) => {
		const accountId = event.target.value;
		setSelectedAccount(accountId);
		fetchTransactions(accountId !== 'custom' ? accountId : undefined);
	};

	return (
		<FormControl fullWidth sx={{ mt: 2 }}>
			<InputLabel id="account-switcher-label">Select Account</InputLabel>
			<Select
				labelId="account-switcher-label"
				value={selectedAccount}
				label="Select Account"
				onChange={handleChange}
			>
				{accounts.map((account) => (
					<MenuItem key={account.id} value={account.id}>
						{account.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
