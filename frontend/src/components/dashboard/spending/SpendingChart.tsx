import React, { useContext } from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SpendingChart: React.FC = () => {
	const { transactions } = useContext(TransactionContext);

	const data = transactions
		.filter(transaction => transaction.type === 'expense')
		.reduce((acc: any[], transaction) => {
			const date = new Date(transaction.date).toLocaleDateString();
			const existing = acc.find(item => item.date === date);
			if (existing) {
				existing.amount += transaction.amount;
			} else {
				acc.push({ date, amount: transaction.amount });
			}
			return acc;
		}, [])
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return (
		<LineChart width={600} height={300} data={data}>
			<CartesianGrid stroke="#ccc" />
			<XAxis dataKey="date" />
			<YAxis />
			<Tooltip />
			<Line type="monotone" dataKey="amount" stroke="#8884d8" />
		</LineChart>
	);
};
