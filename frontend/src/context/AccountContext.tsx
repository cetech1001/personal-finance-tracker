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
    setCurrentAccount: Dispatch<SetStateAction<Account>>;
}

export const AccountContext = createContext<AccountContextProps>({} as AccountContextProps);
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
                await fetchAccounts();
            } catch (e) {
                const { message } = getError(e);
                showNotification({ message, severity: 'error' });
            }
        }
    });

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
        const response = await axios.get('/api/plaid/bank_accounts');
        setBankAccounts(response.data);
        const accountList = response.data.map((bank: BankAccount) => ({
            id: bank._id,
            name: bank.institutionName,
        }));
        setAccounts([customAccount, ...accountList]);
    };

    useEffect(() => {
        if (isAuthenticated) {
            (async () => {
                await fetchAccounts();
                await fetchLinkToken();
            })();
        }
    }, [isAuthenticated]);

    return (
      <AccountContext.Provider value={{
          linkTokenConfig,
          accounts,
          bankAccounts,
          currentAccount,
          setCurrentAccount
      }}>
          {props.children}
      </AccountContext.Provider>
    )
}