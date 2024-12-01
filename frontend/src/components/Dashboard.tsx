import {AddTransaction} from './transaction/AddTransaction';
import {TransactionList} from './transaction/TransactionList';

export const Dashboard = () => {
	return (
		<div>
			<h2>Dashboard</h2>
			<AddTransaction />
			<TransactionList />
		</div>
	);
};
