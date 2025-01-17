import {FC} from "react";
import {AuthProvider} from "../context/AuthContext";
import {TransactionProvider} from "../context/TransactionContext";
import {BrowserRouter} from "react-router-dom";
import {BudgetProvider} from "../context/BudgetContext";
import {ThemeProvider} from "@mui/material";
import {theme} from "../theme";
import {NotificationProvider} from "../context/NotificationContext";
import {AccountProvider} from "../context/AccountContext";

export const AppProviders: FC<{ children: JSX.Element }> = ({ children }) => (
	<BrowserRouter>
		<NotificationProvider>
			<AuthProvider>
				<AccountProvider>
					<TransactionProvider>
						<BudgetProvider>
							<ThemeProvider theme={theme}>
								{ children }
							</ThemeProvider>
						</BudgetProvider>
					</TransactionProvider>
				</AccountProvider>
			</AuthProvider>
		</NotificationProvider>
	</BrowserRouter>
);
