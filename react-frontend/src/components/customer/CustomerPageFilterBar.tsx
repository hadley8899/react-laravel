import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Tag } from '../../interfaces/Tag';
import TagFilterSelect from '../filters/TagFilterSelect';

interface CustomerPageFilterBarProps {
    /* existing props */
    showInactive: boolean;
    searchTermInput: string;
    handleShowInactiveChange: (checked: boolean) => void;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpenAddModal: () => void;

    /* new props */
    selectedTags: Tag[];
    onTagFilterChange: (tags: Tag[]) => void;
}

const CustomerPageFilterBar: React.FC<CustomerPageFilterBarProps> = ({
                                                                         showInactive,
                                                                         searchTermInput,
                                                                         handleShowInactiveChange,
                                                                         handleSearchChange,
                                                                         handleOpenAddModal,
                                                                         selectedTags,
                                                                         onTagFilterChange,
                                                                     }) => (
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
        <Typography variant="h5" component="h1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            Customers
        </Typography>

        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: { xs: 'stretch', sm: 'center' },
                width: { xs: '100%', sm: 'auto' },
                flex: 1,
            }}
        >
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showInactive}
                        onChange={(e) => handleShowInactiveChange(e.target.checked)}
                        sx={{ p: { xs: 0.5, sm: 1 }, mr: { xs: 1, sm: 0.5 } }}
                    />
                }
                label="Show inactive"
                sx={{ m: 0 }}
            />

            {/* tag filter */}
            <TagFilterSelect value={selectedTags} onChange={onTagFilterChange} />

            <TextField
                size="small"
                placeholder="Search name or email…"
                value={searchTermInput}
                onChange={handleSearchChange}
                sx={{ minWidth: { xs: 0, sm: 230 }, flex: 1 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }
                }}
            />

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddModal}
                sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
            >
                Add Customer
            </Button>
        </Box>
    </Box>
);

export default CustomerPageFilterBar;
