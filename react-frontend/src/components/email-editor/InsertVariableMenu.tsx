import React from 'react';
import {Menu, MenuItem, IconButton, Tooltip} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import {CompanyVariable} from '../../interfaces/CompanyVariable';

interface Props {
    variables: CompanyVariable[];
    onInsert: (token: string) => void;
}

const InsertVariableMenu: React.FC<Props> = ({variables, onInsert}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <Tooltip title="Insert variable">
                <IconButton size="small" onClick={e => setAnchorEl(e.currentTarget)}>
                    <CodeIcon fontSize="inherit"/>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {variables.map(v => {

                    // In a text input, We only want text variables
                    if (v.type !== 'text') {
                        return;
                    }

                    return (
                        <MenuItem
                            key={v.key}
                            onClick={() => {
                                onInsert(`{{${v.key}}}`);
                                setAnchorEl(null);
                            }}
                        >
                            {v.friendly_name ?? v.key}
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    );
};

export default InsertVariableMenu;
