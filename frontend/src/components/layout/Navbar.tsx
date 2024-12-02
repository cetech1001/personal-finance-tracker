import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();

	return (
		<nav>
			<h1>Personal Finance Tracker</h1>
			<ul>
				{isAuthenticated ? (
					<>
						<li>Welcome, {user?.username}</li>
						<li>
							<button onClick={logout}>Logout</button>
						</li>
					</>
				) : (
					<>
						<li>
							<Link to="/register">Register</Link>
						</li>
						<li>
							<Link to="/login">Login</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
};
