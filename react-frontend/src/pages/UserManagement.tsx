import React, {useState, useEffect} from "react";
import MainLayout from "../components/layout/MainLayout";
import {
    Typography, Container, Box,
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, TextField
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';

import {
    getCompanyUsers,
    getAvailableRoles,
    createCompanyUser,
    updateCompanyUser,
    deleteCompanyUser,
    updateUserStatus,
    resetUserPassword,
    CompanyUser,
    CreateUserPayload,
    UpdateCompanyUserPayload
} from "../services/UserManagementService";

import UsersTable from "../components/user-management/UsersTable.tsx";
import {USER_STATUSES, getStatusCounts, filterUsersByStatus} from "../helpers/UserManagementHelper.ts";
import StatusHelper from "../components/user-management/StatusHelper.tsx";
import StatusTabs from "../components/user-management/StatusTabs.tsx";
import {useNotifier} from "../context/NotificationContext.tsx";
import UserForm from "../components/user-management/UserForm.tsx";

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<CompanyUser[]>([]);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openResetDialog, setOpenResetDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);

    const [newUser, setNewUser] = useState<CreateUserPayload>({
        name: "", email: "", password: "", password_confirmation: "", status: "active", role: "",
    });
    const [tempPassword, setTempPassword] = useState('');

    const {showNotification} = useNotifier();
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const statusCounts = getStatusCounts(users);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [usersData, rolesData] = await Promise.all([getCompanyUsers(), getAvailableRoles()]);
                setUsers(usersData);
                setAvailableRoles(rolesData);

                // Set default role if available
                if (rolesData.length > 0 && !newUser.role) {
                    setNewUser(prev => ({...prev, role: rolesData[rolesData.length - 1]}));
                }
            } catch (e) {
                console.error(e);
                showNotification('Failed to load user data. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        })();
    }, [newUser.role, showNotification]);

    const filteredUsers = filterUsersByStatus(users, selectedStatus, search, roleFilter);

    const handleEditUser = (u: CompanyUser) => {
        setSelectedUser(u);
        setOpenEditDialog(true);
    };
    const handleDeleteUser = (u: CompanyUser) => {
        setSelectedUser(u);
        setOpenDeleteDialog(true);
    };
    const handleResetUser = (u: CompanyUser) => {
        setSelectedUser(u);
        setTempPassword('');
        setOpenResetDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            await deleteCompanyUser(selectedUser.uuid);
            setUsers(prev => prev.filter(u => u.uuid !== selectedUser.uuid));
            showNotification(`User ${selectedUser.name} deleted successfully`, 'success');
        } catch (e) {
            console.error(e);
            showNotification('Failed to delete user. Please try again.', 'error');
        } finally {
            setLoading(false);
            setOpenDeleteDialog(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const payload: UpdateCompanyUserPayload = {
                name: selectedUser.name,
                email: selectedUser.email,
                status: selectedUser.status,
                ...(selectedUser.role && {role: selectedUser.role}),
                ...(selectedUser.permissions?.length && {permissions: selectedUser.permissions})
            };
            const updated = await updateCompanyUser(selectedUser.uuid, payload);
            setUsers(prev => prev.map(u => u.uuid === updated.uuid ? updated : u));
            showNotification(`User ${updated.name} updated successfully`, 'success');
        } catch (e) {
            console.error(e);
            showNotification('Failed to update user. Please try again.', 'error');
        } finally {
            setLoading(false);
            setOpenEditDialog(false);
        }
    };

    const handleAddUser = async () => {
        try {
            setLoading(true);
            const created = await createCompanyUser(newUser);
            setUsers(prev => [...prev, created]);
            showNotification(`User ${created.name} added successfully`, 'success');
            setNewUser({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                status: "active",
                role: availableRoles.length > 0 ? availableRoles[availableRoles.length - 1] : "",
            });
        } catch (e) {
            console.error(e);
            showNotification('Failed to create user. Please try again.', 'error');
        } finally {
            setLoading(false);
            setOpenAddDialog(false);
        }
    };

    const handleToggleStatus = async (user: CompanyUser) => {
        try {
            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            const updated = await updateUserStatus(user.uuid, newStatus);
            setUsers(prev => prev.map(u => u.uuid === updated.uuid ? updated : u));
            showNotification(`User ${updated.name} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
        } catch (e) {
            console.error(e);
            showNotification('Failed to update user status.', 'error');
        }
    };

    const confirmResetPassword = async () => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const res = await resetUserPassword(selectedUser.uuid, tempPassword || undefined);
            const tempPwd = res.data.tempPassword;                 // ← grab from .data
            showNotification(
                tempPwd ? `Temporary password: ${tempPwd}` : 'Password reset email sent.',
                'success'
            );
        } catch (e) {
            console.error(e);
            showNotification('Failed to reset password. Please try again.', 'error');
        } finally {
            setLoading(false);
            setOpenResetDialog(false);
        }
    };

    /* ─────────────── render ────────────── */
    return (
        <MainLayout title="User Management">
            <Container maxWidth="lg" sx={{py: 4}}>
                {/* header */}
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                    <Typography variant="h4" fontWeight="bold">
                        <PeopleIcon sx={{mr: 1, verticalAlign: 'middle', fontSize: '2rem'}}/>
                        User Management
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon/>} onClick={() => setOpenAddDialog(true)}>
                        Add User
                    </Button>
                </Box>

                <StatusHelper/>
                <StatusTabs selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                            statusCounts={statusCounts}/>

                {loading && !openAddDialog && !openEditDialog && !openDeleteDialog && !openResetDialog ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}><CircularProgress/></Box>
                ) : (
                    <UsersTable
                        users={filteredUsers}
                        loading={loading}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        onToggleStatus={handleToggleStatus}
                        onReset={handleResetUser}
                        search={search}
                        onSearchChange={setSearch}
                        roleFilter={roleFilter}
                        onRoleFilterChange={setRoleFilter}
                        availableRoles={availableRoles}
                    />
                )}

                {/* ----- Edit User Dialog ----- */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        {selectedUser && (
                            <UserForm
                                mode="edit"
                                userData={selectedUser}
                                availableRoles={availableRoles}
                                availableStatuses={USER_STATUSES.filter(s => s.value !== "all")}
                                onUserChange={u => setSelectedUser(u as CompanyUser)}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleUpdateUser} variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24}/> : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* ----- Delete Dialog ----- */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>Are you sure you want to delete {selectedUser?.name}?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24}/> : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* ----- Add User Dialog ----- */}
                <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent>
                        <UserForm mode="add" userData={newUser} availableRoles={availableRoles}
                                  onUserChange={u => setNewUser(u as CreateUserPayload)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddUser} variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24}/> : 'Add User'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* ----- Reset Password Dialog ----- */} {/* ➜ NEW */}
                <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Reset Password for {selectedUser?.name}</DialogTitle>
                    <DialogContent>
                        <Typography sx={{mb: 2}}>
                            Leave blank to email a reset link or enter a temporary password to set immediately.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Temporary Password"
                            value={tempPassword}
                            onChange={e => setTempPassword(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenResetDialog(false)}>Cancel</Button>
                        <Button variant="contained" onClick={confirmResetPassword} disabled={loading}>
                            {loading ? <CircularProgress size={24}/> : 'Reset'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </MainLayout>
    );
};

export default UserManagement;
