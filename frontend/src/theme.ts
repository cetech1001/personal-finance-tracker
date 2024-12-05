import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#4CAF50',
		},
		secondary: {
			main: '#FF5722',
		},
	},
	typography: {
		h6: {
			fontWeight: 600,
		},
		body1: {
			fontSize: 16,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
		},
	},
});
