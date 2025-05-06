import React from 'react';
import {
    ToggleButtonGroup,
    ToggleButton,
    useTheme as useMuiTheme,
} from '@mui/material';
import {
    LightMode,
    DarkMode,
    SettingsBrightness,
} from '@mui/icons-material';

import {getCurrentUserLocal, updateUserPreferences} from '../services/UserService';
import {useTheme} from '../hooks/useTheme.ts'
const ThemeSwitcher: React.FC = () => {
    const {mode, setMode} = useTheme();
    const muiTheme = useMuiTheme();

    const handleChange = async (
        _e: React.MouseEvent<HTMLElement>,
        newMode: 'light' | 'dark' | 'system' | null
    ) => {
        if (!newMode || newMode === mode) return;

        setMode(newMode);

        const currentUser = getCurrentUserLocal();

        const currentUserUuId = currentUser?.uuid;

        if (!currentUserUuId) {
            return;
        }
        updateUserPreferences(currentUserUuId, {preferred_theme: newMode}).catch((error) => {
            console.error(error);
        })
    };

    return (
        <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleChange}
            size="small"
            aria-label="theme mode"
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
                <LightMode fontSize="small"/>
            </ToggleButton>
            <ToggleButton value="dark" aria-label="dark mode">
                <DarkMode fontSize="small"/>
            </ToggleButton>
            <ToggleButton value="system" aria-label="system preference">
                <SettingsBrightness fontSize="small"/>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ThemeSwitcher;
