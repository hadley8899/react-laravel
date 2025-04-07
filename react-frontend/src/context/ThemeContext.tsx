import React, {createContext, useContext, useEffect, useState} from 'react';
import {ThemeProvider as MUIThemeProvider} from '@mui/material/styles';
import {lightTheme, darkTheme} from '../theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [mode, setMode] = useState<ThemeMode>('system');
    const [activeTheme, setActiveTheme] = useState(lightTheme);

    useEffect(() => {
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (mode === 'system') {
                setActiveTheme(e.matches ? darkTheme : lightTheme);
            }
        };

        if (mode === 'light') {
            setActiveTheme(lightTheme);
        } else if (mode === 'dark') {
            setActiveTheme(darkTheme);
        } else {
            // System mode
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            setActiveTheme(prefersDark.matches ? darkTheme : lightTheme);

            prefersDark.addEventListener('change', handleSystemThemeChange);
            return () => prefersDark.removeEventListener('change', handleSystemThemeChange);
        }
    }, [mode]);

    return (
        <ThemeContext.Provider value={{mode, setMode}}>
            <MUIThemeProvider theme={activeTheme}>
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};