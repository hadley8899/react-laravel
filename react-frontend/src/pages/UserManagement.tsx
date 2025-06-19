import React, {useState, useEffect} from "react";
import MainLayout from "../components/layout/MainLayout";
import {
    Typography, Container, Box,
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Alert, Snackbar,
    Tabs, Tab, Badge
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const USER_STATUSES = [
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Invited", value: "invited" },
    { label: "Rejected", value: "rejected" },
    { label: "Inactive", value: "inactive" },
    { label: "All", value: "all" }
];

const STATUS_HELPER = [
    {
        label: "Active",
        color: "success.main",
        description: "User is fully active and can log in to the system."
    },
    {
        label: "Pending",
        color: "warning.main",
        description: "User has verified their email but is awaiting admin approval before they can log in."
    },
    {
        label: "Invited",
        color: "info.main",
        description: "User was invited by an admin or manager and has not yet accepted the invitation."
    },
    {
        label: "Rejected",
        color: "error.main",
        description: "User's registration or invitation was rejected by an admin or manager and cannot access the system."
    },
    {
        label: "Inactive",
        color: "grey.600",
        description: "User account has been deactivated by an admin or manager and cannot log in."
    },
    {
        label: "All",
        color: "text.primary",
        description: "Displays all users, regardless of their status."
    }
];

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
    });

    // Loading/error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Tab state
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    // Add state for status helper collapse
    const [showStatusHelper, setShowStatusHelper] = useState(true);

    // Filter/search states
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

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

    // Filter users based on selected tab, search, and role
    const filteredUsers = users.filter(u => {
        // Status filter
        if (selectedStatus !== "all" && u.status !== selectedStatus) return false;
        // Search filter
        const searchLower = search.toLowerCase();
        if (
            searchLower &&
            !(
                u.name.toLowerCase().includes(searchLower) ||
                u.email.toLowerCase().includes(searchLower)
            )
        ) {
            return false;
        }
        // Role filter
        if (roleFilter && u.role !== roleFilter) return false;
        return true;
    });

    // Count for badges
    const statusCounts = {
        pending: users.filter(u => u.status === "pending").length,
        invited: users.filter(u => u.status === "invited").length,
        rejected: users.filter(u => u.status === "rejected").length,
        active: users.filter(u => u.status === "active").length,
    };

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

                {/* Status Helper */}
                <Box sx={{ mb: 3 }}>
                    {showStatusHelper ? (
                        <Box
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 1,
                                p: { xs: 1.5, sm: 2 },
                                borderLeft: 4,
                                borderColor: 'primary.main',
                                display: 'flex',
                                alignItems: { xs: 'stretch', sm: 'flex-start' },
                                gap: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                                position: 'relative'
                            }}
                        >
                            {/* Collapse button */}
                            <Button
                                size="small"
                                onClick={() => setShowStatusHelper(false)}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    minWidth: 0,
                                    p: 0.5,
                                    zIndex: 2,
                                }}
                                aria-label="Hide status helper"
                            >
                                <KeyboardArrowUpIcon />
                            </Button>
                            <InfoOutlinedIcon
                                color="primary"
                                sx={{
                                    mt: { xs: 0, sm: 0.5 },
                                    alignSelf: { xs: 'center', sm: 'flex-start' },
                                    fontSize: { xs: 32, sm: 24 }
                                }}
                            />
                            <Box sx={{ width: '100%' }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                                >
                                    What do user statuses mean?
                                </Typography>
                                <Box
                                    component="ul"
                                    sx={{
                                        pl: { xs: 0, sm: 3 },
                                        mb: 0,
                                        display: 'flex',
                                        flexDirection: { xs: 'row', sm: 'column' },
                                        overflowX: { xs: 'auto', sm: 'visible' },
                                        gap: { xs: 2, sm: 0 },
                                        listStyle: 'none'
                                    }}
                                >
                                    {STATUS_HELPER.map(status => (
                                        <li
                                            key={status.label}
                                            style={{
                                                minWidth: 220,
                                                marginBottom: 4,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display: 'inline-block',
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        bgcolor: status.color,
                                                        mr: 1
                                                    }}
                                                />
                                                <Typography component="span" fontWeight="bold" sx={{ mr: 1, fontSize: { xs: 13, sm: 14 } }}>
                                                    {status.label}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    color="text.secondary"
                                                    sx={{
                                                        fontSize: { xs: 12, sm: 14 },
                                                        whiteSpace: { xs: 'normal', sm: 'inherit' }
                                                    }}
                                                >
                                                    {status.description}
                                                </Typography>
                                            </Box>
                                        </li>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 1,
                                py: 0.5,
                                px: 2,
                                borderLeft: 4,
                                borderColor: 'primary.main',
                                cursor: 'pointer',
                                width: 'fit-content',
                                mx: 'auto'
                            }}
                            onClick={() => setShowStatusHelper(true)}
                            aria-label="Show status helper"
                        >
                            <KeyboardArrowDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="primary">
                                Show status helper
                            </Typography>
                        </Box>
                    )}
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

                {/* Status Tabs */}
                <Box sx={{ mb: 2 }}>
                    <Tabs
                        value={selectedStatus}
                        onChange={(_, v) => setSelectedStatus(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {USER_STATUSES.map(tab => (
                            <Tab
                                key={tab.value}
                                label={
                                    (tab.value === "pending" || tab.value === "invited" || tab.value === "rejected" || tab.value === "active")
                                        ? (
                                            <Badge
                                                color={tab.value === "pending" ? "warning" : tab.value === "invited" ? "info" : tab.value === "rejected" ? "error" : "success"}
                                                badgeContent={statusCounts[tab.value as keyof typeof statusCounts] || 0}
                                                max={99}
                                            >
                                                {tab.label}
                                            </Badge>
                                        ) : tab.label
                                }
                                value={tab.value}
                            />
                        ))}
                    </Tabs>
                </Box>

                {loading && !openAddDialog && !openEditDialog && !openDeleteDialog ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <UsersTable
                        users={filteredUsers}
                        loading={loading}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        onToggleStatus={handleToggleStatus}
                        search={search}
                        onSearchChange={setSearch}
                        roleFilter={roleFilter}
                        onRoleFilterChange={setRoleFilter}
                        availableRoles={availableRoles}
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
                                availableStatuses={USER_STATUSES.filter(s => s.value !== "all")}
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
