export const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'GBP',
});

export const expenseCategories = [
	'Rent',
	'Utilities',
	'Groceries',
	'Transportation',
	'Entertainment',
	'Personal Care',
	'Health',
	'Education',
	'Financial Obligations',
	'Miscellaneous',
];

export const incomeCategories = [
	'Salary',
	'Business Income',
	'Investments',
	'Government Benefits',
	'Gifts and Others',
];

interface ErrorResponse {
	error?: string;
	message?: string;
	statusCode?: number;
	status?: number;
	data?: {
		error?: string;
		message?: string;
		statusCode?: number;
		status?: number;
	}
	response: {
		error?: string;
		message?: string;
		statusCode?: number;
		status?: number;
		data?: {
			error?: string;
			message?: string;
			statusCode?: number;
			status?: number;
		}
	}
}

export const getError = (e: unknown | ErrorResponse) => {
	const error = e as ErrorResponse;
	const message = Array.isArray(error.message) ? error.message[0] : (
		error.response?.data?.message
		|| error.response?.data?.error
		|| error.data?.message
		|| error.data?.error
		|| error.response?.message
		|| error.response?.error
		|| error.message
		|| error.error)!;
	const status = (error.response?.data?.statusCode
		|| error.response?.data?.status
		|| error.data?.statusCode
		|| error.data?.status
		|| error.response?.statusCode
		|| error.response?.status
		|| error.statusCode
		|| error.status)!;
	return { status, message };
}
