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
				{budgets.map((budget, index) => (
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
						{index < budgets.length - 1 && <Divider component="li"/>}
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

	const handleDelete = async () => {
		if (budgetID) {
			await deleteBudget(budgetID);
			setBudgetID(null);
		}
	};

	return (
		<>
			<Card sx={{ mt: 3 }}>
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
				<DialogTitle color={"primary"}>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this budget?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setBudgetID(null)} variant={"outlined"} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} variant={"contained"} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
