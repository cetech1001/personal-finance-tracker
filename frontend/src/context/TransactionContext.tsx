import {createContext, useState, useEffect, FC, ReactNode} from 'react';
import axios from '../utils/axios-config';
import {useAuth} from "./AuthContext";
import {useNotification} from "./NotificationContext";
import {getError} from "../utils/helpers";

interface Transaction {
	_id: string;
	type: 'income' | 'expense';
	category: string;
	amount: number;
	date: string;
	notes?: string;
}

interface TransactionQuery {
	accountID?: string;
	limit?: number;
	page?: number;
}

interface SpendingData {
	category: string;
	total: number;
	date: string;
}

interface TransactionContextProps {
	transactions: Transaction[];
	currentPage: number;
	totalPages: number;
	accountID: string;
	spendingData: SpendingData[];
	addTransaction: (transactionData: Omit<Transaction, '_id'>) => Promise<{ transaction: Transaction; warning?: string; }>;
	deleteTransaction: (id: string) => Promise<void>;
	updateTransaction: (id: string, transactionData: Partial<Transaction>) => Promise<void>;
	fetchTransactions: (query?: TransactionQuery) => Promise<void>;
	fetchTransactionsSummary: () => Promise<{
		totalIncome: number;
		totalExpenses: number;
		totalBalance: number;
	}>;
	fetchSpendingData: (startDate?: string, endDate?: string) => Promise<SpendingData[]>;
}

export const TransactionContext = createContext<TransactionContextProps>({} as TransactionContextProps);

export const TransactionProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [accountID, setAccountID] = useState('custom');
	const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
	const { isAuthenticated } = useAuth();

	const { showNotification } = useNotification();

	const fetchTransactions = async (query?: TransactionQuery) => {
		try {
			if (query?.accountID) {
				setAccountID(query.accountID);
			}
			const res = await axios.get('/api/transactions', {
				params: query
			});
			setTransactions(res.data.transactions);
			setTotalPages(res.data.totalPages);
			setCurrentPage(res.data.currentPage);
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		}
	};

	const fetchTransactionsSummary = async () => {
		try {
			const res = await axios.get('/api/transactions/summary', {
				params: { accountID }
			});
			return res.data;
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		}
	}

	const fetchSpendingData = async (startDate?: string, endDate?: string) => {
		try {
			const res = await axios.get('/api/transactions/spending-data', {
				params: { accountID, startDate, endDate },
			});
			setSpendingData(res.data);
			return res.data;
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		}
	}

	const addTransaction = async (transactionData: Omit<Transaction, '_id'>) => {
		try {
			const res = await axios.post('/api/transactions', transactionData);
			setTransactions([res.data, ...transactions]);
			showNotification({ message: 'Transaction added', severity: 'success' });
			return res.data;
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		}
	};

	const deleteTransaction = async (id: string) => {
		try {
			await axios.delete(`/api/transactions/${id}`);
			setTransactions(transactions.filter(transaction => transaction._id !== id));
			showNotification({ message: 'Transaction deleted', severity: 'success' });
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		}
	};

	const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
		try {
			const res = await axios.put(`/api/transactions/${id}`, transactionData);
			setTransactions(
				transactions.map(transaction =>
					transaction._id === id ? res.data : transaction
				)
			);
			showNotification({ message: 'Transaction updated', severity: 'success' });
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchTransactions();
			fetchSpendingData();
		}
	}, [isAuthenticated]);

	return (
		<TransactionContext.Provider
			value={{
				transactions,
				currentPage,
				totalPages,
				accountID,
				spendingData,
				addTransaction,
				deleteTransaction,
				updateTransaction,
				fetchTransactions,
				fetchTransactionsSummary,
				fetchSpendingData
		}}
		>
			{children}
		</TransactionContext.Provider>
	);
};
