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
	Stack,
	SelectChangeEvent,
	FormHelperText,
} from '@mui/material';
import {expenseCategories, incomeCategories} from "../../../utils/helpers";

export const AddTransaction = () => {
	const { addTransaction, accountID } = useContext(TransactionContext);
	const [formData, setFormData] = useState({
		type: 'expense',
		category: '',
		amount: '',
		date: '',
		notes: '',
	});
	const [categories, setCategories] = useState<string[]>([]);
	const [errors, setErrors] = useState({
		category: '',
		amount: '',
	});

	useEffect(() => {
		if (formData.type === 'expense') {
			setCategories(expenseCategories);
		} else {
			setCategories(incomeCategories);
		}
	}, [formData.type]);

	useEffect(() => {
		if (categories.length > 0) {
			setFormData(prevState => ({
				...prevState,
				category: categories[0],
			}));
		}
	}, [categories]);

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

		let valid = true;
		const newErrors = { category: '', amount: '' };

		if (!formData.category) {
			newErrors.category = 'Category is required';
			valid = false;
		}

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			newErrors.amount = 'Amount must be greater than zero';
			valid = false;
		}

		setErrors(newErrors);

		if (!valid) {
			return;
		}

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
		<>
			<Box component="form" onSubmit={onSubmit} sx={{ mt: 3, p: 3 }}>
				<Typography variant="h5" gutterBottom>
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
							disabled={accountID !== 'custom'}
						>
							<MenuItem value="expense">Expense</MenuItem>
							<MenuItem value="income">Income</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth error={Boolean(errors.category)}>
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							labelId="category-label"
							id="category"
							name="category"
							value={formData.category}
							label="Category"
							onChange={onChange}
							disabled={accountID !== 'custom'}
						>
							{categories.map((category, i) => (
								<MenuItem value={category} key={i}>{category}</MenuItem>
							))}
						</Select>
						{errors.category && <FormHelperText>{errors.category}</FormHelperText>}
					</FormControl>
					<TextField
						name="amount"
						label="Amount"
						type="number"
						value={formData.amount}
						onChange={onChange}
						error={Boolean(errors.amount)}
						helperText={errors.amount}
						disabled={accountID !== 'custom'}
						required
						fullWidth
					/>
					<TextField
						name="date"
						label="Date"
						type="date"
						value={formData.date}
						onChange={onChange}
						disabled={accountID !== 'custom'}
						fullWidth
					/>
					<TextField
						name="notes"
						label="Notes"
						value={formData.notes}
						onChange={onChange}
						multiline
						rows={2}
						disabled={accountID !== 'custom'}
						fullWidth
					/>
					<Button type="submit" variant="contained" color="primary" disabled={accountID !== 'custom'}>
						Add Transaction
					</Button>
				</Stack>
			</Box>
		</>
	);
};
