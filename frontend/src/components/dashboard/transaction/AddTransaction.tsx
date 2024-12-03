import {useState, useContext, ChangeEvent, FormEvent, useEffect} from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import {
	Box,
	Button,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Typography,
	Stack, SelectChangeEvent, Alert, Snackbar,
} from '@mui/material';

export const expenseCategories = [
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

export const incomeCategories = [
	'Salary',
	'Business Income',
	'Investments',
	'Government Benefits',
	'Gifts and Others',
];


export const AddTransaction = () => {
	const { addTransaction } = useContext(TransactionContext);
	const [formData, setFormData] = useState({
		type: 'expense',
		category: '',
		amount: '0',
		date: '',
		notes: '',
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [categories, setCategories] = useState<string[]>([]);

	useEffect(() => {
		if (formData.type === 'expense') {
			setCategories(expenseCategories);
		} else {
			setCategories(incomeCategories);
		}
	}, [formData.type]);

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
		const transactionData = {
			type: formData.type as 'income' | 'expense',
			category: formData.category,
			amount: parseFloat(formData.amount),
			date: formData.date || new Date().toISOString(),
			notes: formData.notes,
		};
		await addTransaction(transactionData);
		setSnackbarOpen(true);
		setFormData({
			type: 'expense',
			category: '',
			amount: '0',
			date: '',
			notes: '',
		});
	};

	return (
		<Box component="form" onSubmit={onSubmit} sx={{ mt: 3, p: 3 }}>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
			>
				<Alert onClose={() => setSnackbarOpen(false)} severity="success">
					Transaction added successfully!
				</Alert>
			</Snackbar>
			<Typography variant="h6" gutterBottom>
				Add Transaction
			</Typography>
			<Stack spacing={2}>
				<FormControl fullWidth>
					<InputLabel id="type-label">Type</InputLabel>
					<Select
						labelId="type-label"
						id="type"
						name="type"
						value={formData.type}
						label="Type"
						onChange={onChange}
					>
						<MenuItem value="expense">Expense</MenuItem>
						<MenuItem value="income">Income</MenuItem>
					</Select>
				</FormControl>
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
					name="amount"
					label="Amount"
					type="number"
					value={formData.amount}
					onChange={onChange}
					error={formData.amount === ''}
					helperText={formData.amount === '' ? 'Amount is required' : ''}
					required
					fullWidth
				/>
				<TextField
					name="date"
					label="Date"
					type="date"
					value={formData.date}
					onChange={onChange}
					fullWidth
				/>
				<TextField
					name="notes"
					label="Notes"
					value={formData.notes}
					onChange={onChange}
					multiline
					rows={2}
					fullWidth
				/>
				<Button type="submit" variant="contained" color="primary">
					Add Transaction
				</Button>
			</Stack>
		</Box>
	);
};
