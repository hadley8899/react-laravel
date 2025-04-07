import {createTheme} from "@mui/material/styles";

export const darkTheme = createTheme({
    typography: {
        fontFamily: 'Montserrat, sans-serif',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                },
            },
        },
    },
});