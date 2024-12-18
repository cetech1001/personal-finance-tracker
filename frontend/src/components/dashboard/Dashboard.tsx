import {useContext, useEffect, useState} from 'react';
import { Grid2 as Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { TransactionContext } from '../../context/TransactionContext';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import {LinkBankAccount} from './plaid/LinkBankAccount';
import {ConnectedAccounts} from './plaid/ConnectedAccounts';
import {formatter} from "../../utils/helpers";
import {AccountSwitcher} from "./plaid/AccountSwitcher";
import {TransactionSummary} from "./transaction/TransactionSummary";
import {PieChart} from "./spending/PieChart";

export const Dashboard = () => {
	const { fetchTransactionsSummary, accountID } = useContext(TransactionContext);
	const [summary, setSummary] = useState({
		totalBalance: 0,
		totalExpenses: 0,
		totalIncome: 0,
	});

	const [key, setKey] = useState(1);

	useEffect(() => {
		fetchTransactionsSummary()
			.then(data => {
				setSummary(data);
			});
	}, [accountID]);

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={4} sx={{ mb: 3 }}>
				<Grid size={{ xs: 12, md: 4 }}>
					<AccountSwitcher/>
				</Grid>
			</Grid>
			<Grid container spacing={4}>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Balance</Typography>
							<Typography variant="h4">{formatter.format(summary.totalBalance)}</Typography>
							<AccountBalanceIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Income</Typography>
							<Typography variant="h4">{formatter.format(summary.totalIncome)}</Typography>
							<TrendingUpIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Expenses</Typography>
							<Typography variant="h4">{formatter.format(summary.totalExpenses)}</Typography>
							<PieChartIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h5" gutterBottom>
							Recent Transactions
						</Typography>
						 <TransactionSummary />
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h5" gutterBottom>
							Spending Overview
						</Typography>
						<PieChart/>
					</Paper>
				</Grid>
				<Grid size={12}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h5" gutterBottom>
							Linked Bank Accounts
						</Typography>
						<ConnectedAccounts key={key}/>
						<LinkBankAccount setKey={setKey}/>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};
