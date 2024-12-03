import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();

	return (
		<nav>
			{isAuthenticated && (
				<ul>
					<li>Welcome, {user?.username}</li>
					<li>
						<button onClick={logout}>Logout</button>
					</li>
				</ul>
			)}
		</nav>
	);
};
