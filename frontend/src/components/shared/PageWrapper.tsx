import {Container, Grid2 as Grid, Paper} from "@mui/material";
import {FC, ReactNode} from "react";
import {AccountSwitcher} from "../dashboard/plaid/AccountSwitcher";

interface IProps {
	children: ReactNode | ReactNode[];
	accountSwitcherDisabled?: boolean;
}

export const PageWrapper: FC<IProps> = ({children, accountSwitcherDisabled}) => {
	return (
		<Container maxWidth="lg" sx={{ mt: 4 }}>
			<Grid container spacing={4} sx={{ mb: 1 }}>
				<Grid size={{ xs: 12, md: 4 }}>
					<AccountSwitcher isDisabled={accountSwitcherDisabled}/>
				</Grid>
			</Grid>
			<Grid container spacing={4}>
				{Array.isArray(children) ? (
					<>
						<Grid size={{ xs: 12, sm: 5 }}>
							<Paper>
								{children[0]}
							</Paper>
						</Grid>
						<Grid size={{ xs: 12, sm: 7 }}>
							<Paper>
								{children[1]}
							</Paper>
						</Grid>
					</>
				) : (
					<Grid size={12}>
						<Paper>
							{children}
						</Paper>
					</Grid>
				)}
			</Grid>
		</Container>
	);
}
