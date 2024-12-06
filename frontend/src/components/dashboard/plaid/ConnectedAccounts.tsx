import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import axios from '../../../utils/axios-config';

interface BankAccount {
	_id: string;
	institutionName: string;
	accounts: any[];
}

export const ConnectedAccounts = () => {
	const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

	const fetchBankAccounts = async () => {
		const response = await axios.get('/api/plaid/bank_accounts');
		setBankAccounts(response.data);
	};

	useEffect(() => {
		fetchBankAccounts();
	}, []);

	return (
		<div>
			<List>
				{bankAccounts.map((bank) => (
					<ListItem key={bank._id}>
						<ListItemText
							primary={bank.institutionName}
							secondary={`Accounts: ${bank.accounts.map((a) => a.name).join(', ')}`}
						/>
						{/* Add buttons to switch accounts or unlink */}
					</ListItem>
				))}
			</List>
		</div>
	);
};
