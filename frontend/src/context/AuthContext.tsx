import {createContext, useState, useEffect, FC, useContext, ReactNode} from 'react';
import axios from '../utils/axios-config';
import {useNavigate} from 'react-router-dom';
import {getError} from "../utils/helpers";
import {useNotification} from "./NotificationContext";

interface User {
	id: string;
	email: string;
}

interface AuthContextProps {
	isAuthenticated: boolean;
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: FC<{ children: ReactNode }> = ({children}) => {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			axios.defaults.headers.common['x-auth-token'] = token;
			axios.get('/api/auth/user')
				.then((res: { data: any; }) => setUser(res.data))
				.catch(() => {
					localStorage.removeItem('token');
					delete axios.defaults.headers.common['x-auth-token'];
				});
		}
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const res = await axios.post('/api/auth/login', { email, password });
			const { token, user } = res.data;
			localStorage.setItem('token', token);
			axios.defaults.headers.common['x-auth-token'] = token;
			setUser(user);
			navigate('/dashboard');
		} catch (e) {
			const {message} = getError(e);
			showNotification({ message, severity: 'error' });
			throw e;
		}
	};

	const register = async (email: string, password: string) => {
		try {
			const res = await axios.post('/api/auth/register', { email, password });
			const { token, user } = res.data;
			localStorage.setItem('token', token);
			axios.defaults.headers.common['x-auth-token'] = token;
			setUser(user);
			navigate('/dashboard');
		} catch (e) {
			const {message} = getError(e);
			showNotification({ message, severity: 'error' });
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		delete axios.defaults.headers.common['x-auth-token'];
		setUser(null);
		navigate('/login');
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
