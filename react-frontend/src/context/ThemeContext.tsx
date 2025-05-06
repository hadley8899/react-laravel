import React, {
    createContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import {ThemeProvider as MUIThemeProvider} from '@mui/material/styles';
import {lightTheme, darkTheme} from '../theme';

/* ------------------------------------------------------------------ */
/* types & helpers                                                    */
/* ------------------------------------------------------------------ */
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeCtx {
    mode: ThemeMode;
    setMode: (m: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeCtx | null>(null);

const getPreferredFromLocal = (): ThemeMode => {
    try {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        return u?.preferred_theme ?? 'system';
    } catch {
        return 'system';
    }
};

/* ------------------------------------------------------------------ */
/* provider                                                           */
/* ------------------------------------------------------------------ */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [mode, setModeState] = useState<ThemeMode>(getPreferredFromLocal());
    const [muiTheme, setMuiTheme] = useState(mode === 'dark' ? darkTheme : lightTheme);

    /* whenever mode changes, switch palette */
    useEffect(() => {
        const apply = (m: ThemeMode) => {
            if (m === 'light') setMuiTheme(lightTheme);
            else if (m === 'dark') setMuiTheme(darkTheme);
            else {
                const darkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setMuiTheme(darkPref ? darkTheme : lightTheme);
            }
        };
        apply(mode);

        /* react to system change only in “system” mode */
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const sys = (e: MediaQueryListEvent) => mode === 'system' && apply(e.matches ? 'dark' : 'light');
        mq.addEventListener('change', sys);
        return () => mq.removeEventListener('change', sys);
    }, [mode]);

    /* listen for updates from login or user‐pref save */
    useEffect(() => {
        const sync = () => {
            const local = getPreferredFromLocal();
            if (local !== mode) setModeState(local);
        };
        window.addEventListener('user-updated', sync);
        window.addEventListener('storage', sync); // other tabs
        return () => {
            window.removeEventListener('user-updated', sync);
            window.removeEventListener('storage', sync);
        };
    }, [mode]);

    /* public setter */
    const setMode = (m: ThemeMode) => {
        setModeState(m);
        /* leave persisting to caller (ThemeSwitcher already does it) */
    };

    return (
        <ThemeContext.Provider value={{mode, setMode}}>
            <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>
        </ThemeContext.Provider>
    );
};
