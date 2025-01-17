import {Routes, Route, Navigate} from 'react-router-dom';
import {Navbar} from "./components/layout/Navbar";
import {Register} from "./components/auth/Register";
import {Login} from "./components/auth/Login";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import {Dashboard} from "./components/dashboard/Dashboard";
import {AddTransaction} from "./components/dashboard/transaction/AddTransaction";
import {TransactionList} from "./components/dashboard/transaction/TransactionList";
import {AddBudget} from "./components/dashboard/budget/AddBudget";
import {BudgetList} from "./components/dashboard/budget/BudgetList";
import {SpendingChart} from "./components/dashboard/spending/SpendingChart";
import {GuestRoute} from "./components/routes/GuestRoute";
import {PageWrapper} from "./components/shared/PageWrapper";
import ErrorBoundary from "./components/shared/ErrorBoundary";

export const App = () => {
	return (
		<ErrorBoundary>
			<Navbar />
			<Routes>
				<Route path="/register" element={
					<GuestRoute>
						<Register />
					</GuestRoute>
				} />
				<Route path="/login" element={
					<GuestRoute>
						<Login />
					</GuestRoute>
				} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path="/transactions"
					element={
						<PrivateRoute>
							<PageWrapper>
								<AddTransaction />
								<TransactionList />
							</PageWrapper>
						</PrivateRoute>
					}
				/>
				<Route
					path="/budgets"
					element={
						<PrivateRoute>
							<PageWrapper>
								<AddBudget />
								<BudgetList />
							</PageWrapper>
						</PrivateRoute>
					}
				/>
				<Route
					path="/spending-chart"
					element={
						<PrivateRoute>
							<PageWrapper>
								<SpendingChart />
							</PageWrapper>
						</PrivateRoute>
					}
				/>
				<Route
					path="*"
					element={
						<Navigate to={"/login"}/>
					}
				/>
			</Routes>
		</ErrorBoundary>
	);
}
