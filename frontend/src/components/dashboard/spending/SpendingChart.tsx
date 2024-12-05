import {useContext, useMemo, useState} from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import {Card, CardContent, Typography, TextField, Button, Stack} from '@mui/material';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from 'recharts';

export const SpendingChart = () => {
	const { transactions } = useContext(TransactionContext);

	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const filteredTransactions = useMemo(() => {
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

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#9933FF', '#FF3333'];

	return (
		<Card sx={{ mt: 4 }}>
			<CardContent>
				<Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
					<Button variant="outlined" onClick={() => { setStartDate(''); setEndDate(''); }}>
						Reset
					</Button>
				</Stack>
				<Typography variant="h6" gutterBottom>
					Spending Over Time
				</Typography>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={lineChartData}>
						<CartesianGrid stroke="#ccc" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="amount" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
				<Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
					Spending by Category
				</Typography>
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={pieChartData}
							dataKey="value"
							nameKey="name"
							outerRadius={100}
							fill="#8884d8"
							label
						>
							{pieChartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Legend />
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>

		/*<Card sx={{ mt: 4 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Spending Over Time
				</Typography>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={filteredTransactions}>
						<CartesianGrid stroke="#ccc" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="amount" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>*/
	);
};
