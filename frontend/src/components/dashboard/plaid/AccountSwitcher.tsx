import React, {useState, useEffect, useContext, FC} from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from '../../../utils/axios-config';
import { TransactionContext } from '../../../context/TransactionContext';

interface BankAccount {
	_id: string;
	institutionName: string;
	accounts: any[];
}

interface IProps {
	isDisabled?: boolean;
}

export const AccountSwitcher: FC<IProps> = (props) => {
	const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
	const { fetchTransactions, accountID } = useContext(TransactionContext);

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
		(async () => fetchAccounts())();
	}, []);

	const handleChange = async (event: any) => {
		await fetchTransactions({ accountID: event.target.value });
	};

	return (
		<FormControl fullWidth sx={{ mt: 2 }}>
			<InputLabel id="account-switcher-label">Select Account</InputLabel>
			<Select
				labelId="account-switcher-label"
				value={accountID}
				label="Select Account"
				onChange={handleChange}
				disabled={props.isDisabled}
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
