import {FC} from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {useAccount} from "../../../context/AccountContext";


interface IProps {
	isDisabled?: boolean;
}

export const AccountSwitcher: FC<IProps> = (props) => {
	const { accounts, currentAccount, setCurrentAccount, isFetchingAccounts } = useAccount();

	return (
		<FormControl fullWidth sx={{ mt: 2 }}>
			<InputLabel id="account-switcher-label">Select Account</InputLabel>
			<Select
				labelId="account-switcher-label"
				value={currentAccount.id}
				label="Select Account"
				onChange={(e) => {
					setCurrentAccount(accounts.find(a => a.id === e.target.value) || accounts[0]);
				}}
				disabled={props.isDisabled || isFetchingAccounts}
			>
				{accounts.map((account) => (
					<MenuItem key={account.id} value={account.id}>
						{account.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
