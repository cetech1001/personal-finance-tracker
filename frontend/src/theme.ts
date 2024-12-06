import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#4CAF50',
		},
		secondary: {
			main: '#FFFFFF',
		},
	},
	typography: {
		h6: {
			fontWeight: 600,
			color: '#FFFFFF',
		},
		h5: {
			fontWeight: 600,
			fontSize: 20,
			color: '#4CAF50',
		},
		body1: {
			fontSize: 16,
			color: '#4CAF50'
		},
		body2: {
			fontSize: 16,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					color: '#FFFFFF'
				},
			},
		},
	},
});
