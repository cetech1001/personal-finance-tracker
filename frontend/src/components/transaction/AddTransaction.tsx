import React, { useState, useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

export const AddTransaction: React.FC = () => {
	const { addTransaction } = useContext(TransactionContext);
	const [formData, setFormData] = useState({
		type: 'expense',
		category: '',
		amount: '',
		date: '',
		notes: '',
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const transactionData = {
			type: formData.type as 'income' | 'expense',
			category: formData.category,
			amount: parseFloat(formData.amount),
			date: formData.date || new Date().toISOString(),
			notes: formData.notes,
		};
		await addTransaction(transactionData);
		setFormData({
			type: 'expense',
			category: '',
			amount: '',
			date: '',
			notes: '',
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<select name="type" value={formData.type} onChange={onChange}>
				<option value="expense">Expense</option>
				<option value="income">Income</option>
			</select>
			<input type="text" name="category" value={formData.category} onChange={onChange} placeholder="Category" required />
			<input type="number" name="amount" value={formData.amount} onChange={onChange} placeholder="Amount" required />
			<input type="date" name="date" value={formData.date} onChange={onChange} />
			<input type="text" name="notes" value={formData.notes} onChange={onChange} placeholder="Notes" />
			<button type="submit">Add Transaction</button>
		</form>
	);
};
