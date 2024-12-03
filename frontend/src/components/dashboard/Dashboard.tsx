import {AddTransaction} from './transaction/AddTransaction';
import {TransactionList} from './transaction/TransactionList';
import {Container, Grid2 as Grid, Paper} from "@mui/material";

export const Dashboard = () => {
	return (
		<Container maxWidth="md" sx={{ mt: 4 }}>
			<Grid container spacing={4}>
				<Grid size={{ xs: 12, sm: 5 }}>
					<Paper>
						<AddTransaction />
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, sm: 7 }}>
					<Paper>
						<TransactionList />
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};
