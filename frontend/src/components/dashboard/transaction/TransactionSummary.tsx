import {FC, ReactNode, useContext} from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Divider,
} from '@mui/material';
import {formatter} from "../../../utils/helpers";
import {Loader} from "../../shared/Loader";

interface IProps {
	pagination?: ReactNode;
	secondaryAction?: (transactionID: string) => ReactNode;
}

export const TransactionSummary: FC<IProps> = (props) => {
	const { transactions, loaders } = useContext(TransactionContext);

	if (loaders.isFetchingTransactions) {
		return <Loader />;
	}

	if (transactions.length === 0) {
		return (
			<Typography variant="body2" gutterBottom>
				No transactions
			</Typography>
		);
	}

	return (
		<List>
			{transactions.map((transaction, index) => (
				<div key={transaction._id}>
					<ListItem secondaryAction={props.secondaryAction
						&& props.secondaryAction(transaction._id)}>
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
					{index < transactions.length - 1 && (
						<Divider component="li" />
					)}
				</div>
			))}
			{props.pagination}
		</List>
	);
};
