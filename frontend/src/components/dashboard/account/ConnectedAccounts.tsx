import {Box, Button, Card, CardContent, Typography} from '@mui/material';
import {useAccount} from "../../../context/AccountContext";
import {Loader} from "../../shared/Loader";

export const ConnectedAccounts = () => {
	const { bankAccounts, currentAccount, setCurrentAccount, unlinkAccount, isFetchingAccounts } = useAccount();

	if (isFetchingAccounts) {
		return <Loader />;
	}

	return (
		<Box>
			{bankAccounts.map((bank) => (
				<Card variant="outlined" sx={{ mb: 2 }} key={bank._id}>
					<CardContent>
						<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
							{bank.institutionName}
						</Typography>
						{bank.accounts?.length ? (
							<Typography variant="body2" sx={{ mt: 1 }}>
								{`Accounts: ${bank.accounts.map((a) => a.name).join(', ')}`}
							</Typography>
						) : (
							<Typography variant="body2" sx={{ mt: 1 }}>
								No sub-accounts available
							</Typography>
						)}

						<Box sx={{ mt: 2 }}>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => setCurrentAccount({
									id: bank._id,
									name: bank.institutionName,
								})}
								disabled={currentAccount.id === bank._id}
							>
								{currentAccount.id === bank._id ? 'Selected' : 'Select Account'}
							</Button>

							<Button
								variant="outlined"
								color="error"
								sx={{ ml: 2 }}
								onClick={() => unlinkAccount(bank._id)}
							>
								Unlink
							</Button>
						</Box>
					</CardContent>
				</Card>
			))}

			{!bankAccounts.length && (
				<Typography variant="body1" sx={{ mt: 2 }}>
					You have not linked any bank accounts yet.
				</Typography>
			)}
		</Box>
	);
};
