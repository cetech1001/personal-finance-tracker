import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {FC} from "react";

export const PrivateRoute: FC<{ children: JSX.Element | JSX.Element[]; }> = ({ children }) => {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
