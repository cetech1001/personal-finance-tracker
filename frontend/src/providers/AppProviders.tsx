import {FC} from "react";
import {AuthProvider} from "../context/AuthContext";
import {TransactionProvider} from "../context/TransactionContext";
import {BrowserRouter} from "react-router-dom";
import {BudgetProvider} from "../context/BudgetContext";
import {ThemeProvider} from "@mui/material";
import {theme} from "../theme";

export const AppProviders: FC<{ children: JSX.Element }> = ({ children }) => (
	<BrowserRouter>
		<AuthProvider>
			<TransactionProvider>
				<BudgetProvider>
					<ThemeProvider theme={theme}>
						{ children }
					</ThemeProvider>
				</BudgetProvider>
			</TransactionProvider>
		</AuthProvider>
	</BrowserRouter>
);
