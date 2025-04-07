import {CssBaseline} from '@mui/material';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext.tsx';
import AppRoutes from './routes';
import {AuthProvider} from "./context/AuthContext.tsx";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <CssBaseline/>
                <BrowserRouter>

                    <AppRoutes/>

                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
