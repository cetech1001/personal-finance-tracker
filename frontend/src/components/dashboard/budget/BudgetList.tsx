import React, { useContext } from 'react';
import { BudgetContext } from '../../../context/BudgetContext';

export const BudgetList: React.FC = () => {
	const { budgets, deleteBudget } = useContext(BudgetContext);

	return (
		<div>
			<h3>Budgets</h3>
			<ul>
				{budgets.map(budget => (
					<li key={budget._id}>
						<span>{budget.category}</span>
						<span>{budget.limit}</span>
						<span>{budget.period}</span>
						<button onClick={() => deleteBudget(budget._id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};
