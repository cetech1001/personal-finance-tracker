import {useState} from "react";
import {
	AppBar,
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
	useMediaQuery, Stack,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import RegisterIcon from '@mui/icons-material/Key';
import {Logo} from "../shared/Logo";

export const Navbar = () => {
	const { isAuthenticated, logout } = useAuth();
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
			<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ pr: 2 }}>
				<>
					<Logo sx={{ mr: 2, width: 50, height: 50 }} />
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						{isMobile ? 'P F T' : 'Personal Finance Tracker'}
					</Typography>
				</>
				{isAuthenticated && (
					<>
						{isMobile ? (
							<>
								<IconButton
									color="secondary"
									edge="end"
									onClick={handleDrawerToggle}
									aria-label="menu"
									sx={{ mr: 2 }}
								>
									<MenuIcon fontSize={"large"}/>
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
								textColor="secondary"
								indicatorColor="secondary"
								sx={{ flexGrow: 2 }}
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
					<Button color="inherit" variant={"outlined"} onClick={logout}>
						<LogoutIcon /> Logout
					</Button>
				) : (
					<>
						<Button color="inherit" variant={"outlined"} component={Link} to="/register" sx={{ mr: 2 }}>
							<RegisterIcon /> Register
						</Button>
						<Button color="inherit" variant={"outlined"} component={Link} to="/login">
							<LoginIcon /> Login
						</Button>
					</>
				)}
			</Stack>
		</AppBar>
	);
};
