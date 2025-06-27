import React from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    InputAdornment,
    Tooltip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotifier } from '../../context/NotificationContext';

interface Props {
    searchInput: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: () => void;
    onRefresh: () => void;
    /* new */
    selectedCount: number;
    onDeleteSelected: () => void;
}

const EmailTemplatesTopBar: React.FC<Props> = ({
                                                   searchInput,
                                                   onSearchChange,
                                                   onAdd,
                                                   onRefresh,
                                                   selectedCount,
                                                   onDeleteSelected,
                                               }) => {
    const { showNotification } = useNotifier();

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

                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                    sx={{ borderRadius: 2, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
                >
                    New Template
                </Button>

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
