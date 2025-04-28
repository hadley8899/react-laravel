import {createContext, useContext} from 'react';
import {AlertColor} from '@mui/material/Alert';

// Define the shape of the context value
interface NotificationContextType {
    showNotification: (message: string, severity?: AlertColor) => void;
}

// Create the context with a default value (a function that does nothing initially)
// This default is mainly for type safety and shouldn't be called directly
// if the component isn't wrapped in the provider.
const NotificationContext = createContext<NotificationContextType>({
    showNotification: () => {
        console.warn('NotificationContext Provider is not available. Cannot show notification.');
    },
});

// Custom hook to easily consume the context
export const useNotifier = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        // This error means you tried to use the hook outside of the provider
        throw new Error('useNotifier must be used within a NotificationProvider');
    }
    return context;
};

export default NotificationContext;
