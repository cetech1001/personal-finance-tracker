import {ChangeEvent, useEffect, useState} from 'react';
import {useTransaction} from '../../../context/TransactionContext';
import {
	Typography,
	Card,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Pagination, Stack, IconButton,
} from '@mui/material';
import {TransactionSummary} from "./TransactionSummary";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAccount} from "../../../context/AccountContext";

export const TransactionList = () => {
	const { deleteTransaction, totalPages, fetchTransactions, loaders } = useTransaction();
	const { currentAccount } = useAccount();
	const [transactionID, setTransactionID] = useState<string | null>(null);

	useEffect(() => {
		(() => fetchTransactions())();
	}, [currentAccount]);

	const handleDelete = async () => {
		if (transactionID) {
			await deleteTransaction(transactionID);
			setTransactionID(null);
		}
	};

	const onPageChange = async (e: ChangeEvent<unknown>, page: number) => {
		e.preventDefault();

		await fetchTransactions({
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
					<TransactionSummary secondaryAction={
						(transactionID) => {
							if (currentAccount.id === 'custom') {
								return (
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() => setTransactionID(transactionID)}
									>
										<DeleteIcon />
									</IconButton>
								);
							}
							return <div/>;
						}
					} pagination={
						<Stack spacing={2} sx={{ mt: 2 }}>
							<Pagination count={totalPages} onChange={onPageChange} />
						</Stack>
					}/>
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
							variant={"outlined"} color="primary" disabled={loaders.isDeleting}>
						Cancel
					</Button>
					<Button onClick={handleDelete} variant={"contained"}
							disabled={loaders.isDeleting} color="error">
						{loaders.isDeleting ? 'Deleting...' : 'Delete'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
