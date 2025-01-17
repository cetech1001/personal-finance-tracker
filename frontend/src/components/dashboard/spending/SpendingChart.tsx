import {FormEvent, useEffect, useState} from 'react';
import {
	Card,
	CardContent,
	TextField,
	Button,
	Stack, Container, Grid2 as Grid,
} from '@mui/material';
import {PieChart} from "./PieChart";
import {BarChart} from "./BarChart";
import {useTransaction} from "../../../context/TransactionContext";
import {useAccount} from "../../../context/AccountContext";

export const SpendingChart = () => {
	const { fetchSpendingData } = useTransaction();
	const { currentAccount } = useAccount();
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	useEffect(() => {
		(() => fetchSpendingData())();
	}, [currentAccount]);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (startDate && endDate) {
			await fetchSpendingData(startDate, endDate);
		}
	}

	const reset = async () => {
		setStartDate('');
		setEndDate('');
		await fetchSpendingData();
	}

	return (
		<Card sx={{ mt: 4 }}>
			<CardContent>
				<Stack component={"form"} onSubmit={onSubmit} direction="row" spacing={1} sx={{ mb: 2 }}>
					<TextField
						label="Start Date"
						type="date"
						value={startDate}
						required={true}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<TextField
						label="End Date"
						type="date"
						value={endDate}
						required={true}
						onChange={(e) => setEndDate(e.target.value)}
					/>
					<Button variant="contained" color={"primary"} type="submit">
						Search
					</Button>
					<Button variant="outlined" color={"primary"} onClick={reset}>
						Reset
					</Button>
				</Stack>
				<Container>
					<Grid container gap={4}>
						<Grid size={{ xs: 12, md: 5 }}>
							<BarChart/>
						</Grid>
						<Grid size={{ xs: 12, md: 5 }}>
							<PieChart/>
						</Grid>
					</Grid>
				</Container>
			</CardContent>
		</Card>
	);
};
