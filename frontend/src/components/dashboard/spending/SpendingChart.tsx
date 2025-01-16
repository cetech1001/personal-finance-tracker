import {useContext, useMemo, useState} from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import {
	Card,
	CardContent,
	TextField,
	Button,
	Stack, Container, Grid2 as Grid, Typography,
} from '@mui/material';
import {PieChart} from "./PieChart";
import {LineChart} from "./LineChart";

export const SpendingChart = () => {
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	/*const filteredTransactions = useMemo(() => {
		return transactions.filter((transaction) => {
			if (transaction.type !== 'expense') {
				return false;
			}

			const transactionDate = new Date(transaction.date);
			const start = startDate ? new Date(startDate) : null;
			const end = endDate ? new Date(endDate) : null;
			return (
				(!start || transactionDate >= start) &&
				(!end || transactionDate <= end)
			);
		}).map(transaction => ({
			...transaction,
			date: new Date(transaction.date).toLocaleDateString(),
		}));
	}, [transactions, startDate, endDate]);

	const lineChartData = filteredTransactions;

	const pieChartData = useMemo(() => {
		return filteredTransactions.reduce((acc: any[], transaction) => {
			const existing = acc.find((item) => item.name === transaction.category);
			if (existing) {
				existing.value += transaction.amount;
			} else {
				acc.push({ name: transaction.category, value: transaction.amount });
			}
			return acc;
		}, []);
	}, [filteredTransactions]);

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#9933FF', '#FF3333'];*/

	return (
		<Card sx={{ mt: 4 }}>
			<CardContent>
				<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
					<TextField
						label="Start Date"
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<TextField
						label="End Date"
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
					<Button variant="outlined" color={"primary"} onClick={() => { setStartDate(''); setEndDate(''); }}>
						Reset
					</Button>
				</Stack>
				<Container>
					<Grid container>
						{/*<Grid size={{ xs: 12, md: 6 }}>
							<Typography variant="h5" gutterBottom>
								Spending Over Time
							</Typography>
							<LineChart/>
						</Grid>*/}
						<Grid size={12}>
							<Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
								Spending by Category
							</Typography>
							<PieChart/>
						</Grid>
					</Grid>
				</Container>
			</CardContent>
		</Card>
	);
};
