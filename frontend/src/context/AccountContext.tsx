import {createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import axios from "../utils/axios-config";
import {getError} from "../utils/helpers";
import {useNotification} from "./NotificationContext";
import {useAuth} from "./AuthContext";


interface Account {
    id: string;
    name: string;
}

interface BankAccount {
    _id: string;
    institutionName: string;
    accounts: any[];
}

interface AccountContextProps {
    linkTokenConfig: {
        token: string;
        onSuccess: (public_token: string) => Promise<void>;
    };
    accounts: Account[];
    bankAccounts: BankAccount[];
    currentAccount: Account;
    isFetchingAccounts: boolean;
    setCurrentAccount: Dispatch<SetStateAction<Account>>;
    unlinkAccount: (accountID: string) => void;
}

const AccountContext = createContext<AccountContextProps>({} as AccountContextProps);
export const useAccount = () => useContext(AccountContext);

const customAccount = {
    id: 'custom',
    name: 'Custom Account',
};

export const AccountProvider: FC<{ children: ReactNode }> = (props) => {
    const { showNotification } = useNotification();
    const { isAuthenticated } = useAuth();

    const [currentAccount, setCurrentAccount] = useState<Account>(customAccount)
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([customAccount]);
    const [linkTokenConfig, setLinkTokenConfig] = useState({
        token: '',
        async onSuccess(public_token: string) {
            try {
                const { data } = await axios.post('/api/plaid/exchange_public_token', { public_token });
                await axios.get('/api/plaid/transactions/' + data.bankAccountID);
                showNotification({ message: 'Your account has been linked successfully', severity: 'success' });
                await fetchAccounts();
            } catch (e) {
                const { message } = getError(e);
                showNotification({ message, severity: 'error' });
            }
        }
    });
    const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);

    const fetchLinkToken = async () => {
        try {
            const response = await axios.post('/api/plaid/create_link_token');
            setLinkTokenConfig(prevState => ({
                ...prevState,
                token: response.data.link_token,
            }));
        } catch (e) {
            const { message } = getError(e);
            showNotification({ message, severity: 'error' });
        }
    };

    const fetchAccounts = async () => {
        try {
            setIsFetchingAccounts(true);
            const response = await axios.get('/api/plaid/bank_accounts');
            setBankAccounts(response.data);
        } catch (e) {
            const { message } = getError(e);
            showNotification({ message, severity: 'error' });
        } finally {
            setIsFetchingAccounts(false);
        }
    };

    const unlinkAccount = async (accountID: string) => {
        try {
            await axios.delete(`/api/plaid/unlink/bank_account/${accountID}`);
            setBankAccounts(bankAccounts.filter(account => account._id !== accountID));
            showNotification({ message: 'Your account has been unlinked', severity: 'success' });
        } catch (e) {
            const { message } = getError(e);
            showNotification({ message, severity: 'error' });
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            (async () => {
                await fetchAccounts();
                await fetchLinkToken();
            })();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (bankAccounts.length > 0) {
            const accountList = bankAccounts.map((bank: BankAccount) => ({
                id: bank._id,
                name: bank.institutionName,
            }));
            setAccounts([customAccount, ...accountList]);
        }
    }, [bankAccounts]);

    return (
      <AccountContext.Provider value={{
          linkTokenConfig,
          accounts,
          bankAccounts,
          currentAccount,
          isFetchingAccounts,
          setCurrentAccount,
          unlinkAccount
      }}>
          {props.children}
      </AccountContext.Provider>
    )
}