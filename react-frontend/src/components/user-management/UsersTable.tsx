import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, IconButton, Tooltip, Box, CircularProgress
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CompanyUser } from "../../services/UserManagementService";

interface UsersTableProps {
    users: CompanyUser[];
    loading: boolean;
    onEdit: (user: CompanyUser) => void;
    onDelete: (user: CompanyUser) => void;
    onToggleStatus: (user: CompanyUser) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
                                                   users,
                                                   loading,
                                                   onEdit,
                                                   onDelete,
                                                   onToggleStatus
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
        <Paper>
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
                                        color={user.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                        onClick={() => onToggleStatus(user)}
                                        sx={{cursor: 'pointer'}}
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
    );
};

export default UsersTable;