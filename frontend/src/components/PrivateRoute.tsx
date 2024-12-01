import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute: React.FC<{ children: JSX.Element; }> = ({ children }) => {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? children : <Navigate to="/login" />;
};
