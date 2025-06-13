import React from "react";
import {Box, Button, Checkbox, FormControlLabel, InputAdornment, TextField, Typography} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

interface CustomerPageFilerBarProps {
    showInactive: boolean,
    searchTermInput: string,
    handleShowInactiveChange: (showInactive: boolean) => void,
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleOpenAddModal: () => void,
}

const CustomerPageFilterBar: React.FC<CustomerPageFilerBarProps> = ({
                                                                        showInactive,
                                                                        searchTermInput,
                                                                        handleShowInactiveChange,
                                                                        handleSearchChange,
                                                                        handleOpenAddModal,
                                                                    }) => {
    return (
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
            <Typography variant="h5" component="h1" fontWeight="600"
                        sx={{display: 'flex', alignItems: 'center'}}>
                <PeopleIcon sx={{mr: 1.5, color: 'primary.main'}}/>
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
                    maxWidth: { xs: '100%', sm: 'unset' },
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            name={'showInactive'}
                            checked={showInactive}
                            onChange={(e) => handleShowInactiveChange(e.target.checked)}
                            sx={{
                                p: { xs: 0.5, sm: 1 },
                                mr: { xs: 1, sm: 0.5 },
                            }}
                        />
                    }
                    label={'Show inactive customers'}
                    sx={{
                        m: 0,
                        width: { xs: '100%', sm: 'auto' },
                        alignItems: 'center',
                        flexDirection: { xs: 'row', sm: 'row' },
                        '.MuiFormControlLabel-label': {
                            fontSize: { xs: '1rem', sm: '1rem' },
                            lineHeight: 1.2,
                        },
                        mb: { xs: 0.5, sm: 0 },
                    }}
                />

                <TextField
                    variant="outlined"
                    placeholder="Search name or email..."
                    size="small"
                    value={searchTermInput}
                    onChange={handleSearchChange}
                    sx={{
                        minWidth: { xs: 0, sm: '250px' },
                        width: { xs: '100%', sm: 'auto' },
                        '& .MuiOutlinedInput-root': {borderRadius: 2}
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (<InputAdornment position="start"><SearchIcon/></InputAdornment>),
                        }
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    size="medium"
                    onClick={handleOpenAddModal}
                    sx={{
                        whiteSpace: 'nowrap',
                        borderRadius: 2,
                        width: { xs: '100%', sm: 'auto' }
                    }}
                >
                    Add Customer
                </Button>
            </Box>
        </Box>
    );
}

export default CustomerPageFilterBar;
