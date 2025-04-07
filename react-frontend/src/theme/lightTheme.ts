import {createTheme} from "@mui/material/styles";


export const lightTheme = createTheme({
    typography: {
        fontFamily: 'Montserrat, sans-serif',
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#333333',
                },
            },
        },
    },
});