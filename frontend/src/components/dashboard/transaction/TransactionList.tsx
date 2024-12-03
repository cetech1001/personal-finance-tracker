import {useContext} from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import {
	List,
	ListItem,
	ListItemText,
	IconButton,
	Typography,
	Card,
	CardContent,
	Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const TransactionList = () => {
	const { transactions, deleteTransaction } = useContext(TransactionContext);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'GBP',
	});

	return (
		<Card sx={{ mt: 4 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Transactions
				</Typography>
				<List>
					{transactions.map((transaction) => (
						<div key={transaction._id}>
							<ListItem secondaryAction={
								<IconButton
									edge="end"
									aria-label="delete"
									onClick={() => deleteTransaction(transaction._id)}
								>
									<DeleteIcon />
								</IconButton>
							}>
								<ListItemText
									primary={`${transaction.category} - ${formatter.format(+transaction.amount)}`}
									secondary={
										<>
											<Typography component="span" variant="body2" color="textPrimary">
												{`Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} | `}
											</Typography>
											{`Date: ${new Date(transaction.date).toLocaleDateString()} | Notes: ${transaction.notes}`}
										</>
									}
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
