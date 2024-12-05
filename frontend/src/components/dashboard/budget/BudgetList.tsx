import {useContext, useState} from 'react';
import { BudgetContext } from '../../../context/BudgetContext';
import {
	Card,
	CardContent,
	Typography,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Snackbar, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {formatter} from "../../../utils/helpers";

export const BudgetList = () => {
	const { budgets, deleteBudget } = useContext(BudgetContext);
	const [budgetID, setBudgetID] = useState<string | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const handleDelete = async () => {
		if (budgetID) {
			await deleteBudget(budgetID);
			setBudgetID(null);
			setSnackbarOpen(true);
		}
	};

	return (
		<>
			<Card sx={{ mt: 4 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Budgets
					</Typography>
					{budgets.length > 0 ? (
						<List>
							{budgets.map((budget) => (
								<div key={budget._id}>
									<ListItem secondaryAction={
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() => setBudgetID(budget._id)}
										>
											<DeleteIcon />
										</IconButton>
									}>
										<ListItemText
											primary={`${budget.category} - ${formatter.format(+budget.limit)}`}
											secondary={`Period: ${budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}, Start Date: ${new Date(
												budget.startDate
											).toLocaleDateString()}`}
										/>
									</ListItem>
									<Divider component="li" />
								</div>
							))}
						</List>
					) : (
						<Typography variant="body1" gutterBottom>
							No budgets set
						</Typography>
					)}
				</CardContent>
			</Card>
			<Dialog
				open={Boolean(budgetID)}
				onClose={() => setBudgetID(null)}
			>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this budget?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setBudgetID(null)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
			>
				<Alert onClose={() => setSnackbarOpen(false)} severity="success">
					Budget deleted successfully!
				</Alert>
			</Snackbar>
		</>
	);
};
