import {useState, FormEvent, ChangeEvent, FC} from 'react';
import {useBudget} from '../../../context/BudgetContext';
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
import {expenseCategories} from "../../../utils/helpers";
import {useAccount} from "../../../context/AccountContext";

export const AddBudget: FC = () => {
	const { addBudget } = useBudget();
	const { currentAccount } = useAccount();
	const [formData, setFormData] = useState({
		category: expenseCategories[0],
		limit: '',
		period: 'monthly',
		startDate: '',
	});
	const [errors, setErrors] = useState({
		category: '',
		limit: '',
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

		let valid = true;
		const newErrors = { category: '', limit: '' };

		if (!formData.category) {
			newErrors.category = 'Category is required';
			valid = false;
		}

		if (!formData.limit || parseFloat(formData.limit) <= 0) {
			newErrors.limit = 'Limit must be greater than zero';
			valid = false;
		}

		setErrors(newErrors);

		if (!valid) {
			return;
		}

		const budgetData = {
			category: formData.category,
			limit: parseFloat(formData.limit),
			period: formData.period.toLowerCase() as 'daily' | 'weekly' | 'monthly',
			startDate: formData.startDate || new Date().toISOString(),
		};
		await addBudget(budgetData);
		setFormData({
			category: expenseCategories[0],
			limit: '',
			period: 'monthly',
			startDate: '',
		});
	};

	return (
		<>
			<Box component="form" onSubmit={onSubmit} sx={{ mt: 3, p: 3 }}>
				<Typography variant="h5" gutterBottom>
					Add Budget
				</Typography>
				<Stack spacing={2}>
					<FormControl fullWidth error={Boolean(errors.category)}>
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							labelId="category-label"
							id="category"
							name="category"
							value={formData.category}
							label="Category"
							onChange={onChange}
							disabled={currentAccount.id !== 'custom'}
						>
							{expenseCategories.map((category, i) => (
								<MenuItem value={category} key={i}>{category}</MenuItem>
							))}
						</Select>
						{errors.category && <FormHelperText>{errors.category}</FormHelperText>}
					</FormControl>
					<TextField
						name="limit"
						label="Limit"
						type="number"
						value={formData.limit}
						error={Boolean(errors.limit)}
						helperText={errors.limit}
						onChange={onChange}
						disabled={currentAccount.id !== 'custom'}
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
							disabled={currentAccount.id !== 'custom'}
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
						disabled={currentAccount.id !== 'custom'}
						fullWidth
					/>
					<Button type="submit" variant="contained" color="primary" disabled={currentAccount.id !== 'custom'}>
						Add Budget
					</Button>
				</Stack>
			</Box>
		</>
	);
};
