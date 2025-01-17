import {Typography} from "@mui/material";
import {ResponsiveContainer} from "recharts";
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js';
import {Loader} from "../../shared/Loader";
import {useTransaction} from "../../../context/TransactionContext";

export const BarChart = () => {
	const { spendingData, loaders } = useTransaction();

	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		ArcElement,
		Title,
		Tooltip,
		Legend
	);

	const barData = {
		labels: spendingData.map(v => v.category),
		datasets: [
			{
				label: 'Total Spending',
				data: spendingData.map(v => v.total),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	if (loaders.isFetchingSpendingData) {
		return (
			<>
				<Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
					Total Spending by Category
				</Typography>
				<Loader/>
			</>
		);
	}

	if (spendingData?.length === 0) {
		return (
			<>
				<Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
					Total Spending by Category
				</Typography>
				<Typography variant="body2" gutterBottom sx={{ mt: 4 }}>
					No data to show
				</Typography>
			</>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={400}>
			<Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Total Spending by Category' } } }} />
		</ResponsiveContainer>
	);
}
