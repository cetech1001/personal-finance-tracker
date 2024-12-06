import {Typography} from "@mui/material";
import {CartesianGrid, Line, LineChart as LineChartContainer, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useContext} from "react";
import {TransactionContext} from "../../../context/TransactionContext";

export const LineChart = () => {
	const { spendingData } = useContext(TransactionContext);

	if (spendingData?.length === 0) {
		return (
			<Typography variant="body2" gutterBottom sx={{ mt: 4 }}>
				No data to show
			</Typography>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChartContainer data={spendingData}>
				<CartesianGrid stroke="#ccc" />
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Line type="monotone" dataKey="amount" stroke="#8884d8" />
			</LineChartContainer>
		</ResponsiveContainer>
	);
}
