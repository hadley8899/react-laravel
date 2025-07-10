import React, {useState} from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Menu,
    MenuItem,
    Typography,
    TextField,
    InputAdornment,
    Tooltip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotifier } from '../../context/NotificationContext';

interface Props {
    searchInput: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    /* callbacks renamed */
    onAddBuilder: () => void;
    onAddHtml: () => void;

    onRefresh: () => void;
    selectedCount: number;
    onDeleteSelected: () => void;
}

const EmailTemplatesTopBar: React.FC<Props> = ({
                                                   searchInput,
                                                   onSearchChange,
                                                   onAddBuilder,
                                                   onAddHtml,
                                                   onRefresh,
                                                   selectedCount,
                                                   onDeleteSelected,
                                               }) => {
    const { showNotification } = useNotifier();

    /* split-button menu */
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3,
            }}
        >
            <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                Email Templates
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1.5,
                    alignItems: { xs: 'stretch', sm: 'center' },
                    flex: 1,
                    maxWidth: { xs: '100%', sm: 'unset' },
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={onSearchChange}
                    sx={{
                        minWidth: { xs: 0, sm: 250 },
                        width: { xs: '100%', sm: 'auto' },
                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {selectedCount > 0 && (
                    <Tooltip title={`Delete ${selectedCount} selected`}>
                        <Button
                            variant="outlined"
                            color="error"
                            size="medium"
                            startIcon={<DeleteIcon />}
                            onClick={onDeleteSelected}
                            sx={{ borderRadius: 2, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
                        >
                            Delete
                        </Button>
                    </Tooltip>
                )}

                {/* --- Split “New” button --- */}
                <ButtonGroup
                    variant="contained"
                    sx={{borderRadius: 2, width: {xs: '100%', sm: 'auto'}}}
                >
                    <Button
                        startIcon={<AddIcon/>}
                        onClick={onAddBuilder}
                        sx={{whiteSpace: 'nowrap', flexGrow: 1}}
                    >
                        Visual Builder
                    </Button>
                    <Button
                        aria-label="select import type"
                        aria-controls={open ? 'split-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={e => setAnchorEl(e.currentTarget)}
                        sx={{px: 1}}
                    >
                        <KeyboardArrowDownIcon/>
                    </Button>
                </ButtonGroup>

                <Menu
                    id="split-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    slotProps={{
                        list: {dense: true}
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            onAddHtml();
                            setAnchorEl(null);
                        }}
                    >
                        Import Raw&nbsp;HTML
                    </MenuItem>
                </Menu>

                <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                        onRefresh();
                        showNotification('Template list refreshed');
                    }}
                    sx={{ borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
                >
                    Refresh
                </Button>
            </Box>
        </Box>
    );
};

export default EmailTemplatesTopBar;
