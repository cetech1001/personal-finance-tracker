import {Routes, Route} from 'react-router-dom';
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

export const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
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
							<AddTransaction />
							<TransactionList />
						</PrivateRoute>
					}
				/>
				<Route
					path="/budgets"
					element={
						<PrivateRoute>
							<AddBudget />
							<BudgetList />
						</PrivateRoute>
					}
				/>
				<Route
					path="/spending-chart"
					element={
						<PrivateRoute>
							<SpendingChart />
						</PrivateRoute>
					}
				/>
				{/* Redirect root path to dashboard */}
				<Route
					path="/"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	);
}
