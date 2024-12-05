import { useContext } from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import { Card, CardContent, Typography } from '@mui/material';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
} from 'recharts';

export const SpendingChart = () => {
	const { transactions } = useContext(TransactionContext);

	const data = transactions
		.filter((transaction) => transaction.type === 'expense')
		.reduce((acc: any[], transaction) => {
			const date = new Date(transaction.date).toLocaleDateString();
			const existing = acc.find((item) => item.date === date);
			if (existing) {
				existing.amount += transaction.amount;
			} else {
				acc.push({ date, amount: transaction.amount });
			}
			return acc;
		}, [])
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return (
		<Card sx={{ mt: 4 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Spending Over Time
				</Typography>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={data}>
						<CartesianGrid stroke="#ccc" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="amount" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
