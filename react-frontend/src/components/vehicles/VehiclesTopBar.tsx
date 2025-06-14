import React from 'react';
import {Box, Button, Typography, InputAdornment, TextField} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import {hasPermission} from "../../services/authService.ts";

interface Props {
    searchInput: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedCount: number;
    onAdd: () => void;
    onDeleteSelected: () => void;
    onRefresh: () => void;
}

const VehiclesTopBar: React.FC<Props> = ({
                                             searchInput,
                                             onSearchChange,
                                             selectedCount,
                                             onAdd,
                                             onDeleteSelected,
                                             onRefresh
                                         }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3
        }}
    >
        <Typography variant="h5" fontWeight={600} sx={{display: 'flex', alignItems: 'center'}}>
            <DirectionsCarIcon sx={{mr: 1.5, color: 'primary.main'}}/>
            Vehicles
        </Typography>

        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: { xs: 'stretch', sm: 'center' },
                width: { xs: '100%', sm: 'auto' },
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
                    '& .MuiOutlinedInput-root': {borderRadius: 2}
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        )
                    }
                }}
            />

            {hasPermission('create_vehicles') &&
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AddIcon/>}
                    onClick={onAdd}
                    sx={{
                        borderRadius: 2,
                        whiteSpace: 'nowrap',
                        width: {xs: '100%', sm: 'auto'}
                    }}
                >
                    Add Vehicle
                </Button>
            }

            {hasPermission('delete_vehicles') &&
                <Button
                    variant="outlined"
                    size="medium"
                    color="error"
                    startIcon={<DeleteIcon/>}
                    disabled={selectedCount === 0 || !hasPermission('delete_vehicles')}
                    onClick={onDeleteSelected}
                    sx={{
                        borderRadius: 2,
                        whiteSpace: 'nowrap',
                        width: {xs: '100%', sm: 'auto'}
                    }}
                >
                    Delete&nbsp;({selectedCount})
                </Button>
            }

            <Button
                variant="outlined"
                size="medium"
                startIcon={<RefreshIcon/>}
                onClick={onRefresh}
                sx={{
                    borderRadius: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}
            >
                Refresh
            </Button>
        </Box>
    </Box>
);

export default VehiclesTopBar;
