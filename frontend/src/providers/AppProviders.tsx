import {FC} from "react";
import {AuthProvider} from "../context/AuthContext";
import {TransactionProvider} from "../context/TransactionContext";
import {BrowserRouter} from "react-router-dom";

export const AppProviders: FC<{ children: JSX.Element }> = ({ children }) => (
	<BrowserRouter>
		<AuthProvider>
			<TransactionProvider>
				{ children }
			</TransactionProvider>
		</AuthProvider>
	</BrowserRouter>
);
