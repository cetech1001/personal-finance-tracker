import { useContext } from 'react';
import { TransactionContext } from '../../../context/TransactionContext';

export const TransactionList = () => {
	const { transactions, deleteTransaction } = useContext(TransactionContext);

	return (
		<div>
			<h3>Transactions</h3>
			<ul>
				{transactions.map(transaction => (
					<li key={transaction._id}>
						<span>{transaction.date}</span>
						<span>{transaction.type}</span>
						<span>{transaction.category}</span>
						<span>{transaction.amount}</span>
						<button onClick={() => deleteTransaction(transaction._id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};
