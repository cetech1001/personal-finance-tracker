import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Register} from './components/auth/Register';
import {Login} from './components/auth/Login';
import {Dashboard} from "./components/dashboard/Dashboard";
import {PrivateRoute} from "./components/PrivateRoute";

export const App = () => {
	return (
		<Router>
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
			</Routes>
		</Router>
	);
}
