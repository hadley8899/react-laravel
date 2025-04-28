import {CssBaseline} from '@mui/material';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext.tsx';
import AppRoutes from './routes';
import {AuthProvider} from "./context/AuthContext.tsx";
import {NotificationProvider} from "./components/providers/NotificationProvider.tsx";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <NotificationProvider>
                    <CssBaseline/>
                    <BrowserRouter>

                        <AppRoutes/>

                    </BrowserRouter>
                </NotificationProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
