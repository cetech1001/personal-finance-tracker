import { Button } from '@mui/material';
import { usePlaidLink } from 'react-plaid-link';
import {useAccount} from "../../../context/AccountContext";

export const LinkBankAccount = () => {
	const { linkTokenConfig } = useAccount();
	const { open, ready } = usePlaidLink(linkTokenConfig);

	return (
		<Button variant="contained" color="primary" onClick={() => open()} disabled={!ready}>
			Link Bank Account
		</Button>
	);
};
