import React, { createContext, useState, useEffect, FC } from 'react';
import axios from '../utils/axios-config';
import {useAuth} from "./AuthContext";

interface Budget {
	_id: string;
	category: string;
	limit: number;
	period: 'daily' | 'weekly' | 'monthly';
	startDate: string;
}

interface BudgetContextProps {
	budgets: Budget[];
	addBudget: (budgetData: Omit<Budget, '_id'>) => Promise<void>;
	deleteBudget: (id: string) => Promise<void>;
	updateBudget: (id: string, budgetData: Partial<Budget>) => Promise<void>;
	fetchBudgets: () => Promise<void>;
}

export const BudgetContext = createContext<BudgetContextProps>({} as BudgetContextProps);

export const BudgetProvider: FC<{ children: JSX.Element }> = ({ children }) => {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const { isAuthenticated } = useAuth();

	const fetchBudgets = async () => {
		try {
			const res = await axios.get('/api/budgets');
			setBudgets(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	const addBudget = async (budgetData: Omit<Budget, '_id'>) => {
		try {
			const res = await axios.post('/api/budgets', budgetData);
			setBudgets([res.data, ...budgets]);
		} catch (err) {
			console.error(err);
		}
	};

	const deleteBudget = async (id: string) => {
		try {
			await axios.delete(`/api/budgets/${id}`);
			setBudgets(budgets.filter(budget => budget._id !== id));
		} catch (err) {
			console.error(err);
		}
	};

	const updateBudget = async (id: string, budgetData: Partial<Budget>) => {
		try {
			const res = await axios.put(`/api/budgets/${id}`, budgetData);
			setBudgets(
				budgets.map(budget =>
					budget._id === id ? res.data : budget
				)
			);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchBudgets();
		}
	}, [isAuthenticated]);

	return (
		<BudgetContext.Provider
			value={{ budgets, addBudget, deleteBudget, updateBudget, fetchBudgets }}
		>
			{children}
		</BudgetContext.Provider>
	);
};
