import {useState} from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Tabs,
	Tab,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemText,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import {Logo} from "../shared/logo";

export const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const location = useLocation();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const navTabs = [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Transactions', path: '/transactions' },
		{ label: 'Budgets', path: '/budgets' },
		{ label: 'Spending Chart', path: '/spending-chart' },
	];

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	const drawer = (
		<div onClick={handleDrawerToggle}>
			<List>
				{navTabs.map((tab) => (
					<ListItem component={Link} to={tab.path} key={tab.path}>
						<ListItemText primary={tab.label} />
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<AppBar position="static">
			<Toolbar>
				<Logo sx={{ mr: 2, width: 50, height: 50 }} />
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Personal Finance Tracker
				</Typography>
				{isAuthenticated && (
					<>
						{isMobile ? (
							<>
								<IconButton
									color="inherit"
									edge="end"
									onClick={handleDrawerToggle}
									aria-label="menu"
								>
									<MenuIcon />
								</IconButton>
								<Drawer
									anchor="right"
									open={drawerOpen}
									onClose={handleDrawerToggle}
								>
									{drawer}
								</Drawer>
							</>
						) : (
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
					</>
				)}
				{isAuthenticated ? (
					<>
						{!isMobile && (
							<Typography variant="body1" sx={{ mx: 2 }}>
								Welcome, {user?.email}
							</Typography>
						)}
						<Button color="inherit" onClick={logout}>
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
