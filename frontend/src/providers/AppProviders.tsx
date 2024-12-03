import {FC} from "react";
import {AuthProvider} from "../context/AuthContext";
import {TransactionProvider} from "../context/TransactionContext";
import {BrowserRouter} from "react-router-dom";
import {BudgetProvider} from "../context/BudgetContext";

export const AppProviders: FC<{ children: JSX.Element }> = ({ children }) => (
	<BrowserRouter>
		<AuthProvider>
			<TransactionProvider>
				<BudgetProvider>
					{ children }
				</BudgetProvider>
			</TransactionProvider>
		</AuthProvider>
	</BrowserRouter>
);
