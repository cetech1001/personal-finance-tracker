import {useEffect, useState} from 'react';
import { Grid2 as Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import {useTransaction} from '../../context/TransactionContext';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import {LinkBankAccount} from './account/LinkBankAccount';
import {ConnectedAccounts} from './account/ConnectedAccounts';
import {formatter} from "../../utils/helpers";
import {AccountSwitcher} from "./account/AccountSwitcher";
import {TransactionSummary} from "./transaction/TransactionSummary";
import {PieChart} from "./spending/PieChart";
import {Loader} from "../shared/Loader";
import {useAccount} from "../../context/AccountContext";

export const Dashboard = () => {
	const {
		fetchTransactionsSummary,
		fetchSpendingData,
		fetchTransactions,
		loaders
	} = useTransaction();
	const { currentAccount } = useAccount();
	const [summary, setSummary] = useState({
		totalBalance: 0,
		totalExpenses: 0,
		totalIncome: 0,
	});

	useEffect(() => {
		Promise.all([fetchTransactionsSummary(), fetchSpendingData(), fetchTransactions()])
			.then(([summary, _, __]) => {
				setSummary(summary);
			});
	}, [currentAccount]);

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={4} sx={{ mb: 3 }}>
				<Grid size={{ xs: 12, md: 4 }}>
					<AccountSwitcher />
				</Grid>
			</Grid>
			<Grid container spacing={4}>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Balance</Typography>
							{loaders.isFetchingTransactionsSummary
								? <Loader color={"secondary"} mt={0}/>
								: (
									<Typography variant="h4">
										{currentAccount.id === 'custom'
											? 'N/A' : formatter.format(summary.totalBalance)}
									</Typography>
								)
							}
							<AccountBalanceIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Income</Typography>
							{loaders.isFetchingTransactionsSummary
								? <Loader color={"secondary"} mt={0}/>
								: (
									<Typography variant="h4">
										{formatter.format(summary.totalIncome)}
									</Typography>
								)
							}
							<TrendingUpIcon fontSize="large" />
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
						<CardContent>
							<Typography variant="h6">Total Expenses</Typography>
							{loaders.isFetchingTransactionsSummary
								? <Loader color={"secondary"} mt={0}/>
								: (
									<Typography variant="h4">
										{formatter.format(summary.totalExpenses)}
									</Typography>
								)
							}
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
						<ConnectedAccounts/>
						<LinkBankAccount/>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};
