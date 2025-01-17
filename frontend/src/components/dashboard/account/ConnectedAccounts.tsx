import { List, ListItem, ListItemText } from '@mui/material';
import {useAccount} from "../../../context/AccountContext";

export const ConnectedAccounts = () => {
	const { bankAccounts } = useAccount();
	return (
		<div>
			<List>
				{bankAccounts.map((bank) => (
					<ListItem key={bank._id}>
						<ListItemText
							primary={bank.institutionName}
							secondary={`Accounts: ${bank.accounts.map((a) => a.name).join(', ')}`}
						/>
						{/* Add buttons to switch accounts or unlink */}
					</ListItem>
				))}
			</List>
		</div>
	);
};
