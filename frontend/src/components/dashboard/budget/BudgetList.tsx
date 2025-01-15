import {Dispatch, FC, SetStateAction, useContext, useState} from 'react';
import {Budget, BudgetContext} from '../../../context/BudgetContext';
import {
	Card,
	CardContent,
	Typography,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Snackbar,
	Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {formatter} from "../../../utils/helpers";
import {TransactionContext} from "../../../context/TransactionContext";

interface IProps {
	setBudgetID: Dispatch<SetStateAction<string | null>>;
	budgets: Budget[];
	accountID: string;
}

const Budgets: FC<IProps> = ({ accountID, budgets, setBudgetID }) => {
	if (accountID !== 'custom') {
		return (
			<Typography variant="body2" gutterBottom>
				No budgets available
			</Typography>
		);
	}
	if (budgets.length > 0) {
		return (
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
		);
	}
	return (
		<Typography variant="body2" gutterBottom>
			No budgets set
		</Typography>
	);
}

export const BudgetList = () => {
	const { budgets, deleteBudget } = useContext(BudgetContext);
	const { accountID } = useContext(TransactionContext);
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
					<Typography variant="h5" gutterBottom>
						Budgets
					</Typography>
					<Budgets setBudgetID={setBudgetID} accountID={accountID} budgets={budgets} />
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
