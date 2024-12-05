import { AppBar, Toolbar, Typography, Button, Tabs, Tab } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {Logo} from "../shared/logo";

export const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const location = useLocation();

	const navTabs = [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Transactions', path: '/transactions' },
		{ label: 'Budgets', path: '/budgets' },
		{ label: 'Spending Chart', path: '/spending-chart' },
	];

	return (
		<AppBar position="static">
			<Toolbar>
				<Logo sx={{ mr: 2 }} />
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Personal Finance Tracker
				</Typography>
				{isAuthenticated && (
					<Tabs
						value={location.pathname}
						textColor="inherit"
						indicatorColor="secondary"
					>
						{navTabs.map((tab) => (
							<Tab
								key={tab.path}
								label={tab.label}
								value={tab.path}
								component={Link}
								to={tab.path}
							/>
						))}
					</Tabs>
				)}
				{isAuthenticated ? (
					<>
						<Typography variant="body1" sx={{ mx: 2 }}>
							Welcome, {user?.email}
						</Typography>
						<Button variant={"outlined"} color="error" onClick={logout}>
							Logout
						</Button>
					</>
				) : (
					<>
						<Button color="inherit" component={Link} to="/register">
							Register
						</Button>
						<Button color="inherit" component={Link} to="/login">
							Login
						</Button>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};
