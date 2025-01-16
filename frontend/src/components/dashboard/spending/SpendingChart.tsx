import {useState} from 'react';
import {
	Card,
	CardContent,
	TextField,
	Button,
	Stack, Container, Grid2 as Grid, Typography,
} from '@mui/material';
import {PieChart} from "./PieChart";
import {BarChart} from "./BarChart";

export const SpendingChart = () => {
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	return (
		<Card sx={{ mt: 4 }}>
			<CardContent>
				<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
					<TextField
						label="Start Date"
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<TextField
						label="End Date"
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
					<Button variant="contained" color={"primary"}
							onClick={() => { setStartDate(''); setEndDate(''); }}>
						Search
					</Button>
					<Button variant="outlined" color={"primary"}
							onClick={() => { setStartDate(''); setEndDate(''); }}>
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
