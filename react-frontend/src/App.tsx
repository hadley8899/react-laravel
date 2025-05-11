import {CssBaseline} from '@mui/material';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext.tsx';
import AppRoutes from './routes';
import {AuthProvider} from "./context/AuthContext.tsx";
import {NotificationProvider} from "./components/providers/NotificationProvider.tsx";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <NotificationProvider>
                        <CssBaseline/>
                        <BrowserRouter>

                            <AppRoutes/>

                        </BrowserRouter>
                    </NotificationProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
