import React from 'react';
import {
    Box, Button, Checkbox, FormControlLabel,
    InputAdornment, TextField, Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';

import { Tag } from '../../interfaces/Tag';
import TagFilterSelect from '../filters/TagFilterSelect';

interface Props {
    showInactive: boolean;
    searchTermInput: string;
    handleShowInactiveChange: (checked: boolean) => void;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpenAddModal: () => void;
    handleOpenImportModal: () => void;
    handleOpenImportJobs: () => void;
    selectedTags: Tag[];
    onTagFilterChange: (tags: Tag[]) => void;
}

const CustomerPageFilterBar: React.FC<Props> = ({
                                                    showInactive, searchTermInput,
                                                    handleShowInactiveChange, handleSearchChange,
                                                    handleOpenAddModal, handleOpenImportModal, handleOpenImportJobs,
                                                    selectedTags, onTagFilterChange,
                                                }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 3,
            width: '100%',
        }}
    >
        <Typography
            variant="h5"
            component="h1"
            fontWeight={600}
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: {xs: 1, sm: 0},
            }}
        >
            <PeopleIcon sx={{mr: 1.5, color: 'primary.main'}}/>
            Customers
        </Typography>

        <Box
            sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                flexWrap: {xs: 'nowrap', sm: 'wrap'},
                gap: {xs: 1.5, sm: 2},
                alignItems: {xs: 'stretch', sm: 'center'},
                width: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    flexWrap: {xs: 'nowrap', sm: 'wrap'},
                    gap: {xs: 1, sm: 1.5},
                    flex: 1,
                    alignItems: {xs: 'stretch', sm: 'center'},
                    minWidth: 0,
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showInactive}
                            onChange={e => handleShowInactiveChange(e.target.checked)}
                            sx={{p: {xs: 0.5, sm: 1}, mr: {xs: 1, sm: 0.5}}}
                        />
                    }
                    label="Show inactive"
                    sx={{
                        m: 0,
                        minWidth: 120,
                        flexShrink: 0,
                        alignSelf: {xs: 'flex-start', sm: 'center'},
                    }}
                />

                <TagFilterSelect
                    value={selectedTags}
                    onChange={onTagFilterChange}
                    sx={{
                        minWidth: {xs: 0, sm: 180},
                        width: {xs: '100%', sm: 'auto'},
                        flex: {xs: 'unset', sm: 1, md: 'unset'},
                    }}
                />

                <TextField
                    size="small"
                    placeholder="Search name or email…"
                    value={searchTermInput}
                    onChange={handleSearchChange}
                    sx={{
                        minWidth: {xs: 0, sm: 180, md: 230},
                        width: {xs: '100%', sm: 'auto'},
                        flex: 1,
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    flexWrap: {xs: 'nowrap', sm: 'wrap'},
                    gap: {xs: 1, sm: 1.5},
                    width: {xs: '100%', sm: 'auto'},
                    mt: {xs: 1, sm: 0},
                    justifyContent: {xs: 'stretch', sm: 'flex-end'},
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon/>}
                    onClick={handleOpenImportModal}
                    sx={{
                        whiteSpace: 'nowrap',
                        borderRadius: 2,
                        width: {xs: '100%', sm: 'auto'},
                        minWidth: {xs: 'unset', sm: 120},
                        flex: '1 1 auto',
                    }}
                >
                    Import
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<HistoryIcon/>}
                    onClick={handleOpenImportJobs}
                    sx={{
                        whiteSpace: 'nowrap',
                        borderRadius: 2,
                        width: {xs: '100%', sm: 'auto'},
                        minWidth: {xs: 'unset', sm: 140},
                        flex: '1 1 auto',
                    }}
                >
                    Import History
                </Button>

                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleOpenAddModal}
                    sx={{
                        whiteSpace: 'nowrap',
                        borderRadius: 2,
                        width: {xs: '100%', sm: 'auto'},
                        minWidth: {xs: 'unset', sm: 150},
                        flex: '1 1 auto',
                    }}
                >
                    Add Customer
                </Button>
            </Box>
        </Box>
    </Box>
);

export default CustomerPageFilterBar;
