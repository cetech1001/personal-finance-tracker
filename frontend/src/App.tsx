import {Navigate, Route, Routes} from 'react-router-dom';
import {Register} from './components/auth/Register';
import {Login} from './components/auth/Login';
import {Dashboard} from "./components/dashboard/Dashboard";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import {Navbar} from "./components/layout/Navbar";
import {GuestRoute} from "./components/routes/GuestRoute";

export const App = () => {
	return (
		<>
			<Navbar/>
			<Routes>
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route path={'/register'} element={
					<GuestRoute>
						<Register />
					</GuestRoute>
				}/>
				<Route path={'/login'} element={
					<GuestRoute>
						<Login />
					</GuestRoute>
				}/>
				<Route path="*" element={<Navigate to={'/login'}/>} />
			</Routes>
		</>
	);
}
