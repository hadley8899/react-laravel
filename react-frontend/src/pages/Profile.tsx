import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom"; // Import for redirection
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Paper,
    Box,
    Avatar,
    TextField,
    Button,
    Divider,
    CircularProgress, // For loading state
    Alert, // For error messages
    Grid,
    IconButton,
    Tooltip, InputAdornment
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';

// Import user interface and auth service
import User from "../interfaces/User";
import {logout} from "../services/authService"; // Adjust path if needed

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);
        try {
            // Attempt to retrieve user data from localStorage first
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
                setEditedName(parsedUser.name);
                setEditedEmail(parsedUser.email);
            } else {
                // Optional: If not in localStorage, you could try fetching via getAuthUser()
                // This depends on your app's auth flow. For simplicity, we rely on localStorage here.
                // Example:
                // getAuthUser().then(fetchedUser => {
                //     setUser(fetchedUser);
                //     setEditedName(fetchedUser.name);
                //     setEditedEmail(fetchedUser.email);
                // }).catch(err => {
                //     console.error("Failed to fetch user:", err);
                //     setError("Could not load user profile. Please log in again.");
                //     // Optional: Redirect to login if fetch fails critically
                //     // navigate('/login');
                // });
                setError("User data not found. Please log in again.");
                // Optionally redirect if this state is unexpected
                // navigate('/login');
            }
        } catch (err) {
            console.error("Error loading user data:", err);
            setError("An error occurred while loading your profile.");
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means run once on mount

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login page after logout
        } catch (err) {
            console.error("Logout failed:", err);
            setError("Logout failed. Please try again.");
            // Optionally show a more user-friendly error message
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // If cancelling edit, reset fields to original user data
            if (user) {
                setEditedName(user.name);
                setEditedEmail(user.email);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = () => {
        // --- Placeholder for saving changes ---
        // In a real app, you would:
        // 1. Call an API endpoint (e.g., api.put('/user', { name: editedName, email: editedEmail }))
        // 2. Handle success:
        //    - Update the user state: setUser({ ...user, name: editedName, email: editedEmail });
        //    - Update localStorage: localStorage.setItem('user', JSON.stringify({ ...user, name: editedName, email: editedEmail }));
        //    - Set isEditing(false);
        //    - Show a success message (Snackbar)
        // 3. Handle errors:
        //    - Show an error message (Snackbar or Alert)
        console.log("Saving changes:", {name: editedName, email: editedEmail});
        // For demo purposes, just exit editing mode
        if (user) { // Check if user is not null before spreading
            const updatedUser = {...user, name: editedName, email: editedEmail};
            setUser(updatedUser); // Optimistically update UI state
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update storage
        }
        setIsEditing(false);
        // Add success feedback here (e.g., Snackbar)
    };

    const handleChangePassword = () => {
        // --- Placeholder for changing password ---
        // Typically navigates to a separate page/modal for security reasons
        // navigate('/change-password');
        console.log("Navigate to change password flow...");
        // Add feedback like a Snackbar: "Password change feature not implemented yet."
    }


    if (loading) {
        return (
            <MainLayout>
                <Container maxWidth="lg" sx={{
                    py: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh'
                }}>
                    <CircularProgress/>
                </Container>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Container maxWidth="sm" sx={{py: 4}}> {/* Smaller container for error */}
                    <Paper sx={{p: 3, borderRadius: 2}} elevation={3}>
                        <Alert severity="error" sx={{mb: 2}}>{error}</Alert>
                        <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
                    </Paper>
                </Container>
            </MainLayout>
        );
    }


    if (!user) {
        // This case might be redundant if error handling redirects, but good as a fallback
        return (
            <MainLayout>
                <Container maxWidth="sm" sx={{py: 4}}>
                    <Paper sx={{p: 3, borderRadius: 2}} elevation={3}>
                        <Typography>User not found.</Typography>
                        <Button variant="contained" onClick={() => navigate('/login')} sx={{mt: 2}}>Go to Login</Button>
                    </Paper>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container maxWidth="md" sx={{py: 4}}> {/* Medium container is usually good for profiles */}
                <Paper sx={{p: {xs: 2, sm: 3, md: 4}, borderRadius: 2}} elevation={3}>
                    <Grid container spacing={4} alignItems="center">

                        {/* Avatar Section */}
                        <Grid sx={{textAlign: 'center'}}>
                            <Avatar
                                sx={{
                                    width: {xs: 80, sm: 100, md: 120},
                                    height: {xs: 80, sm: 100, md: 120},
                                    mb: 2,
                                    mx: 'auto', // Center avatar
                                    fontSize: {xs: '2rem', md: '3rem'} // Scale initials font size
                                }}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h6" component="h1" gutterBottom>
                                {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {/* Placeholder for Role if available */}
                                Administrator
                            </Typography>
                        </Grid>

                        {/* Details & Actions Section */}
                        <Grid>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                                <Typography variant="h5" component="h2">
                                    Account Details
                                </Typography>
                                <Tooltip title={isEditing ? "Cancel" : "Edit Profile"}>
                                    <IconButton onClick={handleEditToggle} color={isEditing ? "secondary" : "primary"}>
                                        {isEditing ? <EditIcon sx={{transform: 'rotate(45deg)'}}/> : <EditIcon/>}
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Box component="form" noValidate autoComplete="off">
                                <TextField
                                    label="Full Name"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        readOnly: !isEditing,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant={isEditing ? "outlined" : "filled"} // Change variant when editing
                                />
                                <TextField
                                    label="Email Address"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        readOnly: !isEditing,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant={isEditing ? "outlined" : "filled"}
                                />

                                {isEditing && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon/>}
                                        onClick={handleSaveChanges}
                                        sx={{mt: 2}}
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </Box>

                            <Divider sx={{my: 4}}/>

                            {/* Security & Logout */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Security & Actions
                                </Typography>
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2}}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<LockResetIcon/>}
                                        onClick={handleChangePassword}
                                    >
                                        Change Password
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<LogoutIcon/>}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Profile;
