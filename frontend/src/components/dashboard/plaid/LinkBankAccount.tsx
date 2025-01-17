import {useState, useEffect, FC, Dispatch, SetStateAction} from 'react';
import { Button } from '@mui/material';
import { usePlaidLink } from 'react-plaid-link';
import axios from '../../../utils/axios-config';

interface IProps {
	setReloadKey: Dispatch<SetStateAction<number>>;
}

export const LinkBankAccount: FC<IProps> = ({ setReloadKey }) => {
	const [linkToken, setLinkToken] = useState('');

	const fetchLinkToken = async () => {
		const response = await axios.post('/api/plaid/create_link_token');
		setLinkToken(response.data.link_token);
	};

	useEffect(() => {
		(() => fetchLinkToken())();
	}, []);

	const onSuccess = async (public_token: string) => {
		const { data } = await axios.post('/api/plaid/exchange_public_token', { public_token });
		await axios.get('/api/plaid/transactions/' + data.bankAccountID);
		setReloadKey(prevState => prevState + 1);
	};

	const config = {
		token: linkToken,
		onSuccess,
	};

	const { open, ready } = usePlaidLink(config);

	return (
		<Button variant="contained" color="primary" onClick={() => open()} disabled={!ready}>
			Link Bank Account
		</Button>
	);
};
