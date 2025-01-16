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
	loaders: {
		isFetchingTransactions: boolean;
		isFetchingTransactionsSummary: boolean;
		isFetchingSpendingData: boolean;
		isCreating: boolean;
		isUpdating: boolean;
		isDeleting: boolean;
	}
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
	const [loaders, setLoaders] = useState({
		isFetchingTransactions: false,
		isFetchingTransactionsSummary: false,
		isFetchingSpendingData: false,
		isCreating: false,
		isUpdating: false,
		isDeleting: false,
	});
	const { isAuthenticated } = useAuth();

	const { showNotification } = useNotification();

	const fetchTransactions = async (query?: TransactionQuery) => {
		try {
			setLoaders(prevState => ({
				...prevState,
				isFetchingTransactions: true,
			}));
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
		} finally {
			setLoaders(prevState => ({
				...prevState,
				isFetchingTransactions: false,
			}));
		}
	};

	const fetchTransactionsSummary = async () => {
		try {
			setLoaders(prevState => ({
				...prevState,
				isFetchingTransactionsSummary: true,
			}));
			const res = await axios.get('/api/transactions/summary', {
				params: { accountID }
			});
			return res.data;
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		} finally {
			setLoaders(prevState => ({
				...prevState,
				isFetchingTransactionsSummary: false,
			}));
		}
	}

	const fetchSpendingData = async (startDate?: string, endDate?: string) => {
		try {
			setLoaders(prevState => ({
				...prevState,
				isFetchingSpendingData: true,
			}));
			const res = await axios.get('/api/transactions/spending-data', {
				params: { accountID, startDate, endDate },
			});
			setSpendingData(res.data);
			return res.data;
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		} finally {
			setLoaders(prevState => ({
				...prevState,
				isFetchingSpendingData: false,
			}));
		}
	}

	const addTransaction = async (transactionData: Omit<Transaction, '_id'>) => {
		try {
			setLoaders(prevState => ({
				...prevState,
				isCreating: true,
			}));
			const res = await axios.post('/api/transactions', transactionData);
			setTransactions([res.data, ...transactions]);
			showNotification({ message: 'Transaction added', severity: 'success' });
			return res.data;
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		} finally {
			setLoaders(prevState => ({
				...prevState,
				isCreating: false,
			}));
		}
	};

	const deleteTransaction = async (id: string) => {
		try {
			setLoaders(prevState => ({
				...prevState,
				isDeleting: true,
			}));
			await axios.delete(`/api/transactions/${id}`);
			setTransactions(transactions.filter(transaction => transaction._id !== id));
			showNotification({ message: 'Transaction deleted', severity: 'success' });
		} catch (e: any) {
			const { message } = getError(e);
			showNotification({ message, severity: 'error' });
		} finally {
			setLoaders(prevState => ({
				...prevState,
				isDeleting: false,
			}));
		}
	};

	const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
		try {
			setLoaders(prevState => ({
				...prevState,
				isUpdating: true,
			}));
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
		} finally {
			setLoaders(prevState => ({
				...prevState,
				isUpdating: false,
			}));
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			(async () => {
				await fetchTransactions();
				await fetchSpendingData();
			})();
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
				loaders,
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
