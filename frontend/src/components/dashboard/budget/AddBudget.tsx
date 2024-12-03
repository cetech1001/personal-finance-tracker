import React, { useState, useContext } from 'react';
import { BudgetContext } from '../../../context/BudgetContext';

export const AddBudget: React.FC = () => {
	const { addBudget } = useContext(BudgetContext);
	const [formData, setFormData] = useState({
		category: '',
		limit: '',
		period: 'monthly',
		startDate: '',
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const budgetData = {
			category: formData.category,
			limit: parseFloat(formData.limit),
			period: formData.period as 'daily' | 'weekly' | 'monthly',
			startDate: formData.startDate || new Date().toISOString(),
		};
		await addBudget(budgetData);
		// Reset form
		setFormData({
			category: '',
			limit: '',
			period: 'monthly',
			startDate: '',
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<input type="text" name="category" value={formData.category} onChange={onChange} placeholder="Category" required />
			<input type="number" name="limit" value={formData.limit} onChange={onChange} placeholder="Limit" required />
			<select name="period" value={formData.period} onChange={onChange}>
				<option value="daily">Daily</option>
				<option value="weekly">Weekly</option>
				<option value="monthly">Monthly</option>
			</select>
			<input type="date" name="startDate" value={formData.startDate} onChange={onChange} />
			<button type="submit">Add Budget</button>
		</form>
	);
};
