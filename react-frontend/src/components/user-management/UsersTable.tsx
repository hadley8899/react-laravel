import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, IconButton, Tooltip, Box, CircularProgress, Typography
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {CompanyUser} from "../../services/UserManagementService";

interface UsersTableProps {
    users: CompanyUser[];
    loading: boolean;
    onEdit: (user: CompanyUser) => void;
    onDelete: (user: CompanyUser) => void;
    onToggleStatus: (user: CompanyUser) => void;
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
                                               }) => {
    const ucfirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <>
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
                            {users.map((user) => (
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
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
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
                            </Box>
                        </Paper>
                    ))
                )}
            </Box>
        </>
    );
};

export default UsersTable;
