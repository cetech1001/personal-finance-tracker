import {useState, useContext, ChangeEvent, FormEvent} from 'react';
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
	Stack, SelectChangeEvent,
} from '@mui/material';

export const AddTransaction = () => {
	const { addTransaction } = useContext(TransactionContext);
	const [formData, setFormData] = useState({
		type: 'expense',
		category: '',
		amount: '',
		date: '',
		notes: '',
	});

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
		setFormData({
			type: 'expense',
			category: '',
			amount: '',
			date: '',
			notes: '',
		});
	};

	return (
		<Box component="form" onSubmit={onSubmit} sx={{ mt: 3, p: 3 }}>
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
				<TextField
					name="category"
					label="Category"
					value={formData.category}
					onChange={onChange}
					required
					fullWidth
				/>
				<TextField
					name="amount"
					label="Amount"
					type="number"
					value={formData.amount}
					onChange={onChange}
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
