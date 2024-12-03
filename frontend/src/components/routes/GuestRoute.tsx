import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {FC} from "react";

export const GuestRoute: FC<{ children: JSX.Element; }> = ({ children }) => {
	const { isAuthenticated } = useAuth();

	return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};
