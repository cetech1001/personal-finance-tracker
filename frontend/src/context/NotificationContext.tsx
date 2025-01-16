import React, {createContext, useState, FC, ReactNode, useContext} from 'react';
import { Snackbar, Alert } from '@mui/material';

interface Notification {
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextProps {
    showNotification: (notification: Notification) => void;
}

interface IProps {
    children: ReactNode;
}

export const NotificationContext = createContext<NotificationContextProps>({ showNotification: () => {} });

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: FC<IProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = (n: Notification) => {
        setNotification(n);
        setOpen(true);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                {notification ? (
                    <Alert onClose={() => setOpen(false)} severity={notification.severity} variant="filled">
                        {notification.message}
                    </Alert>
                ) : <div/>}
            </Snackbar>
        </NotificationContext.Provider>
    );
};
