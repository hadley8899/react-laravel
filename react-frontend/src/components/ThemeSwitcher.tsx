import React from 'react';
import {
    ToggleButtonGroup,
    ToggleButton,
    useTheme as useMuiTheme
} from '@mui/material';
import {
    LightMode,
    DarkMode,
    SettingsBrightness
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext.tsx';

const ThemeSwitcher: React.FC = () => {
    const { mode, setMode } = useTheme();
    const muiTheme = useMuiTheme();

    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newMode: 'light' | 'dark' | 'system' | null,
    ) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    };

    return (
        <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleChange}
            aria-label="theme mode"
            size="small"
            sx={{
                bgcolor: muiTheme.palette.background.paper,
                '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    '&.Mui-selected': {
                        bgcolor: muiTheme.palette.action.selected,
                    },
                },
            }}
        >
            <ToggleButton value="light" aria-label="light mode">
                <LightMode fontSize="small" />
            </ToggleButton>
            <ToggleButton value="dark" aria-label="dark mode">
                <DarkMode fontSize="small" />
            </ToggleButton>
            <ToggleButton value="system" aria-label="system preference">
                <SettingsBrightness fontSize="small" />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ThemeSwitcher;