import React, {useState, useEffect} from "react";
import MainLayout from "../components/layout/MainLayout";
import {
    Typography, Container, Box,
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Alert, Snackbar
} from "@mui/material";
import UserForm from "../components/user-management/UserForm";
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import {
    getCompanyUsers,
    getAvailableRoles,
    createCompanyUser,
    updateCompanyUser,
    deleteCompanyUser,
    updateUserStatus,
    CompanyUser,
    CreateUserPayload,
    UpdateCompanyUserPayload
} from "../services/UserManagementService";
import UsersTable from "../components/user-management/UsersTable.tsx";

const UserManagement: React.FC = () => {
    // Data states
    const [users, setUsers] = useState<CompanyUser[]>([]);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);

    // UI states
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);

    // Form states
    const [newUser, setNewUser] = useState<CreateUserPayload>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        status: "active",
        role: "",
        permissions: []
    });

    // Loading/error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel
                const [usersData, rolesData] = await Promise.all([
                    getCompanyUsers(),
                    getAvailableRoles(),
                ]);

                setUsers(usersData);
                setAvailableRoles(rolesData);

                // Set default role if available
                if (rolesData.length > 0 && !newUser.role) {
                    setNewUser(prev => ({...prev, role: rolesData[rolesData.length - 1]}));
                }
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load user data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadData().then(() => {
        });
    }, [newUser.role]);

    // CRUD operations
    const handleEditUser = (user: CompanyUser) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleDeleteUser = (user: CompanyUser) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedUser?.uuid) return;

        try {
            setLoading(true);
            await deleteCompanyUser(selectedUser.uuid);
            setUsers(users.filter(user => user.uuid !== selectedUser.uuid));
            setSuccessMessage(`User ${selectedUser.name} deleted successfully`);
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError("Failed to delete user. Please try again.");
        } finally {
            setLoading(false);
            setOpenDeleteDialog(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser?.uuid) return;

        try {
            setLoading(true);

            const payload: UpdateCompanyUserPayload = {
                name: selectedUser.name,
                email: selectedUser.email,
                status: selectedUser.status,
            };

            // Only include role if it exists
            if (selectedUser.role) {
                payload.role = selectedUser.role;
            }

            // Only include permissions if they exist
            if (selectedUser.permissions?.length) {
                payload.permissions = selectedUser.permissions;
            }

            const updatedUser = await updateCompanyUser(selectedUser.uuid, payload);

            setUsers(users.map(user =>
                user.uuid === updatedUser.uuid ? updatedUser : user
            ));

            setSuccessMessage(`User ${updatedUser.name} updated successfully`);
        } catch (err) {
            console.error("Failed to update user:", err);
            setError("Failed to update user. Please try again.");
        } finally {
            setLoading(false);
            setOpenEditDialog(false);
        }
    };

    const handleAddUser = async () => {
        try {
            setLoading(true);

            const createdUser = await createCompanyUser(newUser);

            setUsers([...users, createdUser]);
            setSuccessMessage(`User ${createdUser.name} added successfully`);

            // Reset form
            setNewUser({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                status: "active",
                role: availableRoles.length > 0 ? availableRoles[availableRoles.length - 1] : "",
                permissions: []
            });
        } catch (err) {
            console.error("Failed to add user:", err);
            setError("Failed to create user. Please try again.");
        } finally {
            setLoading(false);
            setOpenAddDialog(false);
        }
    };

    const handleToggleStatus = async (user: CompanyUser) => {
        try {
            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            const updatedUser = await updateUserStatus(user.uuid, newStatus);

            setUsers(users.map(u =>
                u.uuid === updatedUser.uuid ? updatedUser : u
            ));

            setSuccessMessage(`User ${updatedUser.name} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        } catch (err) {
            console.error("Failed to update user status:", err);
            setError("Failed to update user status. Please try again.");
        }
    };

    const handleCloseAlert = () => {
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        <PeopleIcon sx={{mr: 1, verticalAlign: 'middle', fontSize: '2rem'}}/>
                        User Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Add User
                    </Button>
                </Box>

                {/* Error and Success Messages */}
                <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity="error" sx={{width: '100%'}}>
                        {error}
                    </Alert>
                </Snackbar>

                <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity="success" sx={{width: '100%'}}>
                        {successMessage}
                    </Alert>
                </Snackbar>

                {loading && !openAddDialog && !openEditDialog && !openDeleteDialog ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <UsersTable
                        users={users}
                        loading={loading}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        onToggleStatus={handleToggleStatus}
                    />
                )}

                {/* Edit User Dialog */}
                <Dialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        {selectedUser && (
                            <UserForm
                                mode="edit"
                                userData={selectedUser}
                                availableRoles={availableRoles}
                                onUserChange={(updatedUser) => setSelectedUser(updatedUser as CompanyUser)}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleUpdateUser}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete {selectedUser?.name}?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button
                            onClick={confirmDelete}
                            color="error"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="error"/> : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add User Dialog */}
                <Dialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent>
                        <UserForm
                            mode="add"
                            userData={newUser}
                            availableRoles={availableRoles}
                            onUserChange={(updatedUser) => setNewUser(updatedUser as CreateUserPayload)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleAddUser}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : 'Add User'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </MainLayout>
    );
};

export default UserManagement;