import React, {useState, useCallback, ReactNode} from 'react';
import {Snackbar, Alert, AlertColor} from '@mui/material';
import NotificationContext from '../../contexts/NotificationContext'; // Adjust path if needed

interface NotificationProviderProps {
    children: ReactNode;
    autoHideDuration?: number; // Make duration configurable
}

interface NotificationState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
                                                                              children,
                                                                              autoHideDuration = 4000, // Default duration
                                                                          }) => {
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification((prev) => ({...prev, open: false}));
    }, []);

    const showNotification = useCallback((message: string, severity: AlertColor = 'success') => {
            setNotification({
                message,
                severity,
                open: true,
            });
        },
        []
    );

    // The value provided to consuming components
    const contextValue = {
        showNotification,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={autoHideDuration}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            >
                {/* Use Alert for styling, consistent with AppointmentSettings example */}
                {/* Add key to force re-render on message change if transitions are used */}
                <Alert
                    key={notification.message} // Useful if using slide transitions
                    onClose={handleClose}
                    severity={notification.severity}
                    variant={"standard"}
                    sx={{width: '100%'}}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
