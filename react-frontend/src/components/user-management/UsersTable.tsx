import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, IconButton, Tooltip, Box, CircularProgress, Typography,
    TextField, InputAdornment, MenuItem, FormControl, Select, InputLabel
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {CompanyUser} from "../../services/UserManagementService";
import LockResetIcon from '@mui/icons-material/LockReset';
import {getAuthUserLocal} from "../../services/AuthService.ts";

interface UsersTableProps {
    users: CompanyUser[];
    loading: boolean;
    onEdit: (user: CompanyUser) => void;
    onDelete: (user: CompanyUser) => void;
    onToggleStatus: (user: CompanyUser) => void;
    search: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleFilterChange: (value: string) => void;
    availableRoles: string[];
    onReset?: (user: CompanyUser) => void;
}

const statusChipProps = (status: string) => {
    switch (status) {
        case 'active':
            return {color: 'success' as const, variant: 'filled' as const};
        case 'inactive':
            return {color: 'default' as const, variant: 'outlined' as const};
        case 'pending':
            return {color: 'warning' as const, variant: 'filled' as const};
        case 'invited':
            return {color: 'info' as const, variant: 'outlined' as const};
        case 'rejected':
            return {color: 'error' as const, variant: 'filled' as const};
        default:
            return {color: 'default' as const, variant: 'outlined' as const};
    }
};

const UsersTable: React.FC<UsersTableProps> = ({
                                                   users,
                                                   loading,
                                                   onEdit,
                                                   onDelete,
                                                   onReset,
                                                   search,
                                                   onSearchChange,
                                                   roleFilter,
                                                   onRoleFilterChange,
                                                   availableRoles,
                                               }) => {
    const ucfirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const authUser = getAuthUserLocal();

    // Filter Bar
    const FilterBar = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                gap: 2,
                mb: 2,
                alignItems: {xs: 'stretch', sm: 'center'},
                justifyContent: 'space-between',
                background: theme => theme.palette.background.paper,
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search name or email"
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                sx={{flex: 2, minWidth: 180}}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action"/>
                            </InputAdornment>
                        ),
                    }
                }}
            />
            <FormControl size="small" sx={{minWidth: 140, flex: 1}}>
                <InputLabel id="role-filter-label">Role</InputLabel>
                <Select
                    labelId="role-filter-label"
                    value={roleFilter}
                    label="Role"
                    onChange={e => onRoleFilterChange(e.target.value)}
                >
                    <MenuItem value="">All Roles</MenuItem>
                    {availableRoles.map(role => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <>
            {FilterBar}
            {/* Desktop Table */}
                <Paper sx={{display: {xs: 'none', md: 'block'}}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.uuid}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={ucfirst(user.status)}
                                                {...statusChipProps(user.status)}
                                                size="small"
                                                onClick={() => {
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.created_at}</TableCell>
                                        <TableCell>
                                            {/* ACTIONS */}
                                            <Tooltip title="Edit user"><IconButton size="small" color="primary"
                                                                                   onClick={() => onEdit(user)}><EditIcon/></IconButton></Tooltip>
                                            <Tooltip title="Delete user"><IconButton size="small" color="error"
                                                                                     onClick={() => onDelete(user)}><DeleteIcon/></IconButton></Tooltip>
                                            {onReset &&
                                                ['Admin', 'Super Admin'].includes(authUser?.role ?? '') &&
                                                user.status === 'active' && (
                                                    <Tooltip title="Reset password">
                                                        <IconButton size="small" onClick={() => onReset(user)}>
                                                            <LockResetIcon fontSize="small"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Mobile Cards */}
                <Box sx={{display: {xs: 'block', md: 'none'}}}>
                    {users.length === 0 ? (
                        <Box sx={{py: 4, textAlign: 'center'}}>
                            <Typography color="text.secondary">
                                No users found.
                            </Typography>
                        </Box>
                    ) : (
                        users.map(user => (
                            <Paper
                                key={user.uuid}
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    boxShadow: 0,
                                    borderLeft: t => user.status === 'active' ? `4px solid ${t.palette.success.main}` : `4px solid transparent`,
                                    bgcolor: user.status === 'active' ? t => t.palette.action.selected : 'background.paper',
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" sx={{mb: 0.5}}>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                    <strong>Email:</strong> {user.email}
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                                    <Typography variant="body2" color="text.secondary" sx={{mr: 1}}>
                                        <strong>Status:</strong>
                                    </Typography>
                                    <Chip
                                        label={ucfirst(user.status)}
                                        {...statusChipProps(user.status)}
                                        size="small"
                                        onClick={() => {
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                    <strong>Role:</strong> {user.role}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                    <strong>Created:</strong> {user.created_at}
                                </Typography>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <Tooltip title="Edit user">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => onEdit(user)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete user">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onDelete(user)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>


                                    {onReset &&
                                        ['Admin', 'Super Admin'].includes(authUser?.role ?? '') &&
                                        user.status === 'active' && (
                                            <Tooltip title="Reset password">
                                                <IconButton size="small" onClick={() => onReset(user)}>
                                                    <LockResetIcon fontSize="small"/>
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                </Box>
                            </Paper>
                        ))
                    )}
                </Box>
        </>
    );
};

export default UsersTable;
