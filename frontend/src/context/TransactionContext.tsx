import React, { createContext, useState, useEffect, FC } from 'react';
import axios from '../utils/axios-config';

interface Transaction {
	_id: string;
	type: 'income' | 'expense';
	category: string;
	amount: number;
	date: string;
	notes?: string;
}

interface TransactionContextProps {
	transactions: Transaction[];
	addTransaction: (transactionData: Omit<Transaction, '_id'>) => Promise<void>;
	deleteTransaction: (id: string) => Promise<void>;
	updateTransaction: (id: string, transactionData: Partial<Transaction>) => Promise<void>;
	fetchTransactions: () => Promise<void>;
}

export const TransactionContext = createContext<TransactionContextProps>({} as TransactionContextProps);

export const TransactionProvider: FC<{ children: JSX.Element }> = ({ children }) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const fetchTransactions = async () => {
		try {
			const res = await axios.get('/api/transactions');
			setTransactions(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	const addTransaction = async (transactionData: Omit<Transaction, '_id'>) => {
		try {
			const res = await axios.post('/api/transactions', transactionData);
			setTransactions([res.data, ...transactions]);
		} catch (err) {
			console.error(err);
		}
	};

	const deleteTransaction = async (id: string) => {
		try {
			await axios.delete(`/api/transactions/${id}`);
			setTransactions(transactions.filter(transaction => transaction._id !== id));
		} catch (err) {
			console.error(err);
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
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	return (
		<TransactionContext.Provider
			value={{ transactions, addTransaction, deleteTransaction, updateTransaction, fetchTransactions }}
		>
			{children}
		</TransactionContext.Provider>
	);
};
