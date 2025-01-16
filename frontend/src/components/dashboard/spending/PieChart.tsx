import {Typography} from "@mui/material";
import {Cell, Legend, Pie, PieChart as PieChartContainer, ResponsiveContainer, Tooltip} from "recharts";
import {useContext} from "react";
import {TransactionContext} from "../../../context/TransactionContext";

export const PieChart = () => {
	const { spendingData } = useContext(TransactionContext);
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#9933FF', '#FF3333'];

	if (spendingData?.length === 0) {
		return (
			<Typography variant="body2" gutterBottom sx={{ mt: 4 }}>
				No data to show
			</Typography>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={500}>
			<PieChartContainer>
				<Pie
					data={spendingData}
					dataKey="total"
					nameKey="category"
					outerRadius={100}
					fill="#8884d8"
					label
				>
					{spendingData.map((_, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Legend />
				<Tooltip />
			</PieChartContainer>
		</ResponsiveContainer>
	);
}
