import {useContext} from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Divider,
} from '@mui/material';
import {formatter} from "../../../utils/helpers";


export const TransactionSummary = () => {
	const { transactions } = useContext(TransactionContext);

	return (
		<List>
			{transactions.map((transaction, index) => (
				<div key={transaction._id}>
					<ListItem>
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
		</List>
	);
};
