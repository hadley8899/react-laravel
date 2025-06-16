import React from "react";
import {
    Box, TextField, FormControl,
    InputLabel, Select, MenuItem, Typography, Paper, Chip, Grid
} from "@mui/material";
import {CompanyUser, CreateUserPayload} from "../../services/UserManagementService";

interface UserFormProps {
    mode: 'add' | 'edit';
    userData: CompanyUser | CreateUserPayload;
    availableRoles: string[];
    availableStatuses?: { label: string; value: string }[];
    onUserChange: (updatedUser: CompanyUser | CreateUserPayload) => void;
}

const UserForm: React.FC<UserFormProps> = ({
    mode,
    userData,
    availableRoles,
    availableStatuses,
    onUserChange
}) => {
    const isEditMode = mode === 'edit';

    // Helper to safely update user data
    const handleChange = (field: string, value: any) => {
        onUserChange({
            ...userData,
            [field]: value
        });
    };

    return (
        <form>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        label="Name"
                        fullWidth
                        value={userData.name || ""}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={userData.email || ""}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                </Grid>

                {/* Status and Role side by side on desktop, stacked on mobile */}
                <Grid container spacing={2} sx={{width: '100%', margin: 0}}>
                    {isEditMode && (
                        <Grid size={{xs: 12, md: 6}}>
                            {availableStatuses ? (
                                <TextField
                                    select
                                    label="Status"
                                    name="status"
                                    value={userData.status}
                                    onChange={e => handleChange('status', e.target.value)}
                                    fullWidth
                                    required
                                >
                                    {availableStatuses.map(status => (
                                        <MenuItem key={status.value} value={status.value}>
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : null}
                        </Grid>
                    )}
                    <Grid size={{xs: 12, md: isEditMode ? 6 : 12}}>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={userData.role || ""}
                                label="Role"
                                onChange={(e) => handleChange('role', e.target.value)}
                            >
                                {availableRoles.map(role => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Only show permissions display in edit mode */}
                {isEditMode && 'permissions' in userData && (
                    <Grid size={12}>
                        <Box sx={{mt: 2}}>
                            <Typography variant="subtitle1" gutterBottom>
                                Permissions
                            </Typography>
                            <Paper variant="outlined" sx={{p: 1.5, minHeight: '56px'}}>
                                {userData.permissions && userData.permissions.length > 0 ? (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {userData.permissions.map((permission) => (
                                            <Chip key={permission} label={permission} size="small"/>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary">No permissions assigned</Typography>
                                )}
                            </Paper>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </form>
    );
};

export default UserForm;
