import {useState, useContext, FormEvent, ChangeEvent, FC} from 'react';
import { BudgetContext } from '../../../context/BudgetContext';
import {
	Box,
	Button,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Typography,
	Stack, SelectChangeEvent,
} from '@mui/material';

export const categories = [
	'Rent',
	'Utilities',
	'Groceries',
	'Transportation',
	'Entertainment',
	'Personal Care',
	'Health',
	'Education',
	'Financial Obligations',
	'Miscellaneous',
];

export const AddBudget: FC = () => {
	const { addBudget } = useContext(BudgetContext);
	const [formData, setFormData] = useState({
		category: categories[0],
		limit: '',
		period: 'monthly',
		startDate: '',
	});

	const periods = ['Daily', 'Weekly', 'Monthly'];

	const onChange = (
		e: SelectChangeEvent | ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | ChangeEvent<{ name?: string; value: unknown }>
	) => {
		const { name, value } = e.target as HTMLInputElement;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const budgetData = {
			category: formData.category,
			limit: parseFloat(formData.limit),
			period: formData.period.toLowerCase() as 'daily' | 'weekly' | 'monthly',
			startDate: formData.startDate || new Date().toISOString(),
		};
		await addBudget(budgetData);
		setFormData({
			category: categories[0],
			limit: '',
			period: 'monthly',
			startDate: '',
		});
	};

	return (
		<Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
			<Typography variant="h6" gutterBottom>
				Add Budget
			</Typography>
			<Stack spacing={2}>
				<FormControl fullWidth>
					<InputLabel id="category-label">Category</InputLabel>
					<Select
						labelId="category-label"
						id="category"
						name="category"
						value={formData.category}
						label="Category"
						onChange={onChange}
					>
						{categories.map((category, i) => (
							<MenuItem value={category} key={i}>{category}</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					name="limit"
					label="Limit"
					type="number"
					value={formData.limit}
					onChange={onChange}
					required
					fullWidth
				/>
				<FormControl fullWidth>
					<InputLabel id="period-label">Period</InputLabel>
					<Select
						labelId="period-label"
						id="period"
						name="period"
						value={formData.period}
						label="Period"
						onChange={onChange}
					>
						{periods.map((period) => (
							<MenuItem key={period.toLowerCase()} value={period.toLowerCase()}>
								{period}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					name="startDate"
					label="Start Date"
					type="date"
					value={formData.startDate}
					onChange={onChange}
					fullWidth
				/>
				<Button type="submit" variant="contained" color="primary">
					Add Budget
				</Button>
			</Stack>
		</Box>
	);
};
