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
	Pagination, Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {formatter} from "../../../utils/helpers";

export const TransactionList = () => {
	const { transactions, deleteTransaction, totalPages, accountID, fetchTransactions } = useContext(TransactionContext);
	const [transactionID, setTransactionID] = useState<string | null>(null);

	const handleDelete = async () => {
		if (transactionID) {
			await deleteTransaction(transactionID);
			setTransactionID(null);
		}
	};

	const onPageChange = async (e: ChangeEvent<unknown>, page: number) => {
		e.preventDefault();

		await fetchTransactions({
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
				<DialogTitle color={"primary"}>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this transaction?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setTransactionID(null)}
							variant={"outlined"} color="primary">
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
