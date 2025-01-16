import {ChangeEvent, useContext, useState} from 'react';
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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Snackbar,
	Alert, Pagination, Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {formatter} from "../../../utils/helpers";

export const TransactionList = () => {
	const { transactions, deleteTransaction, totalPages, currentPage, accountID, fetchTransactions } = useContext(TransactionContext);
	const [transactionID, setTransactionID] = useState<string | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const handleDelete = async () => {
		if (transactionID) {
			await deleteTransaction(transactionID);
			setTransactionID(null);
			setSnackbarOpen(true);
		}
	};

	const onPageChange = (e: ChangeEvent<unknown>, page: number) => {
		e.preventDefault();

		fetchTransactions({
			accountID,
			page,
			limit: 5,
		});
	}

	return (
		<>
			<Card sx={{ mt: 3 }}>
				<CardContent>
					<Typography variant="h5" gutterBottom>
						Transactions
					</Typography>
					{transactions.length > 0 ? (
						<List>
							{transactions.map((transaction) => (
								<div key={transaction._id}>
									<ListItem secondaryAction={
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() => setTransactionID(transaction._id)}
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
							<Stack spacing={2} sx={{ mt: 2 }}>
								<Pagination count={totalPages} onChange={onPageChange} />
							</Stack>
						</List>
					) : (
						<Typography variant="body2" gutterBottom>
							No transactions
						</Typography>
					)}
				</CardContent>
			</Card>
			<Dialog
				open={Boolean(transactionID)}
				onClose={() => setTransactionID(null)}
			>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this transaction?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setTransactionID(null)} color="primary">
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
					Transaction deleted successfully!
				</Alert>
			</Snackbar>
		</>
	);
};
