import React from "react";
import {
    Box, TextField, FormControlLabel, Switch, FormControl,
    InputLabel, Select, MenuItem, Typography, Paper, Chip
} from "@mui/material";
import { CompanyUser, CreateUserPayload } from "../../services/UserManagementService";

interface UserFormProps {
    mode: 'add' | 'edit';
    userData: CompanyUser | CreateUserPayload;
    availableRoles: string[];
    onUserChange: (updatedUser: CompanyUser | CreateUserPayload) => void;
}

const UserForm: React.FC<UserFormProps> = ({
                                               mode,
                                               userData,
                                               availableRoles,
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
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2}}>
            <TextField
                label="Name"
                fullWidth
                value={userData.name || ""}
                onChange={(e) => handleChange('name', e.target.value)}
            />
            <TextField
                label="Email"
                type="email"
                fullWidth
                value={userData.email || ""}
                onChange={(e) => handleChange('email', e.target.value)}
            />

            {/* Password fields only shown when adding a new user */}
            {!isEditMode && (
                <>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={(userData as CreateUserPayload).password || ""}
                        onChange={(e) => handleChange('password', e.target.value)}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        value={(userData as CreateUserPayload).password_confirmation || ""}
                        onChange={(e) => handleChange('password_confirmation', e.target.value)}
                    />
                </>
            )}

            <FormControlLabel
                control={
                    <Switch
                        checked={userData.status === 'active'}
                        onChange={(e) => handleChange('status', e.target.checked ? 'active' : 'inactive')}
                    />
                }
                label="Active"
            />

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

            {/* Only show permissions display in edit mode */}
            {isEditMode && 'permissions' in userData && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Permissions
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, minHeight: '56px' }}>
                        {userData.permissions && userData.permissions.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {userData.permissions.map((permission) => (
                                    <Chip key={permission} label={permission} size="small" />
                                ))}
                            </Box>
                        ) : (
                            <Typography color="text.secondary">No permissions assigned</Typography>
                        )}
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default UserForm;