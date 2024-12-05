import { useContext } from 'react';
import { BudgetContext } from '../../../context/BudgetContext';
import {
	Card,
	CardContent,
	Typography,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {formatter} from "../../../utils/helpers";

export const BudgetList = () => {
	const { budgets, deleteBudget } = useContext(BudgetContext);

	return (
		<Card sx={{ mt: 4 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Budgets
				</Typography>
				<List>
					{budgets.map((budget) => (
						<div key={budget._id}>
							<ListItem secondaryAction={
								<IconButton
									edge="end"
									aria-label="delete"
									onClick={() => deleteBudget(budget._id)}
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
			</CardContent>
		</Card>
	);
};
