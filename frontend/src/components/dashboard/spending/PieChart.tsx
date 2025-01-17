import {Typography} from "@mui/material";
import {ResponsiveContainer} from "recharts";
import { Pie } from 'react-chartjs-2';
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
import {useTransaction} from "../../../context/TransactionContext";
import {formatter} from "../../../utils/helpers";
import {Loader} from "../../shared/Loader";

export const PieChart = () => {
	const { spendingData } = useTransaction();
	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		ArcElement,
		Title,
		Tooltip,
		Legend
	);

	const pieData = {
		labels: spendingData.map(v => v.category),
		datasets: [
			{
				label: 'Spending Proportion',
				data: spendingData.map(v => v.total),
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#4BC0C0',
					'#9966FF',
					'#FF9F40',
					'#C9CBCF',
					'#FF5A5E',
					'#5AD3D1',
					'#FFC870',
					'#C7CEEA',
					'#A29BFE',
					'#55EFC4',
				],
				hoverOffset: 4,
			},
		],
	};

	const pieOptions = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Spending Distribution by Category',
			},
			tooltip: {
				callbacks: {
					label: (context: any) => {
						const label = context.label || '';
						const value = context.raw || 0;
						return `${label}: ${formatter.format(+value)}`;
					},
				},
			},
			legend: {
				labels: {
					generateLabels: (chart: any) => {
						const datasets = chart.data.datasets[0];
						return chart.data.labels.map((label: string, index: number) => ({
							text: `${label}: ${formatter.format(+datasets.data[index])}`,
							fillStyle: datasets.backgroundColor[index],
							hidden: chart.getDatasetMeta(0).data[index].hidden,
							index,
						}));
					},
				},
			},
		},
	};

	if (spendingData?.length === 0) {
		return (
			<>
				<Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
					Spending Distribution by Category
				</Typography>
				<Loader/>
			</>
		);
	}

	if (spendingData?.length === 0) {
		return (
			<>
				<Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
					Spending Distribution by Category
				</Typography>
				<Typography variant="body2" gutterBottom sx={{ mt: 4 }}>
					No data to show
				</Typography>
			</>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={400}>
			<Pie data={pieData} options={pieOptions} />
		</ResponsiveContainer>
	);
}
