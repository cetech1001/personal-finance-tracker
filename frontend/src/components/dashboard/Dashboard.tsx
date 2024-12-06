import {useContext, useState} from 'react';
import { Grid2 as Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { TransactionContext } from '../../context/TransactionContext';
import { BudgetContext } from '../../context/BudgetContext';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import {LinkBankAccount} from './plaid/LinkBankAccount';
import {ConnectedAccounts} from './plaid/ConnectedAccounts';
import {useAuth} from "../../context/AuthContext";
import {formatter} from "../../utils/helpers";
import {AccountSwitcher} from "./plaid/AccountSwitcher";

export const Dashboard = () => {
	const { user } = useAuth()
	const { transactions } = useContext(TransactionContext);
	const { budgets } = useContext(BudgetContext);

	const [key, setKey] = useState(1);

	const totalIncome = transactions
		.filter((t) => t.type === 'income')
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpenses = transactions
		.filter((t) => t.type === 'expense')
		.reduce((sum, t) => sum + t.amount, 0);
	const totalBalance = totalIncome - totalExpenses;

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			{/*<Typography variant="h4" gutterBottom>
				Welcome back, {user?.email}!
			</Typography>*/}
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
							<Typography variant="h4">{formatter.format(totalBalance)}</Typography>
							<AccountBalanceIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Income</Typography>
							<Typography variant="h4">{formatter.format(totalIncome)}</Typography>
							<TrendingUpIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Expenses</Typography>
							<Typography variant="h4">{formatter.format(totalExpenses)}</Typography>
							<PieChartIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h5" gutterBottom>
							Recent Transactions
						</Typography>
						{/* <TransactionSummary transactions={transactions.slice(0, 5)} /> */}
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h5" gutterBottom>
							Budgets Overview
						</Typography>
						{/* <BudgetsSummary budgets={budgets} /> */}
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
