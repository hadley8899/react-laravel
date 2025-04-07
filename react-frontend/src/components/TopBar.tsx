import React, {useState} from "react";
import {
    AppBar, Avatar, Badge, Box, Divider, IconButton,
    ListItemIcon, Menu, MenuItem, Toolbar, Typography, useTheme
} from "@mui/material";
import {
    Menu as MenuIcon,
    Notifications,
    Logout,
    Settings,
    Person
} from "@mui/icons-material";
import ThemeSwitcher from "./ThemeSwitcher";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

interface TopBarProps {
    handleDrawerToggle: () => void;
    user: { name: string } | null;
    drawerWidth: number | null;
    pageName?: string;
}

const TopBar: React.FC<TopBarProps> = ({
                                           drawerWidth,
                                           handleDrawerToggle,
                                           user,
                                           pageName = "Dashboard"
                                       }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {logout} = useAuth();

    // User menu states
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(anchorEl);

    // Notifications menu states
    const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
    const notifMenuOpen = Boolean(notifAnchorEl);

    // Sample notifications
    const notifications = [
        {id: 1, message: "Service reminder for Honda Civic", read: false},
        {id: 2, message: "New invoice created", read: false},
        {id: 3, message: "Appointment scheduled for tomorrow", read: true}
    ];

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotifMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchorEl(event.currentTarget);
    };

    const handleNotifMenuClose = () => {
        setNotifAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleUserMenuClose();
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/profile");
        handleUserMenuClose();
    };

    const handleSettingsClick = () => {
        navigate("/settings");
        handleUserMenuClose();
    };

    return (
        <AppBar
            position="fixed"
            elevation={1}
            sx={{
                width: {sm: `calc(100% - ${drawerWidth}px)`},
                ml: {sm: `${drawerWidth}px`},
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}
        >
            <Toolbar sx={{justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {/* Hamburger menu for mobile */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            mr: 2,
                            display: {sm: 'none'}
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6">
                        {pageName}
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <ThemeSwitcher/>

                    {/* Notifications */}
                    <IconButton
                        color="inherit"
                        onClick={handleNotifMenuClick}
                        aria-controls={notifMenuOpen ? 'notifications-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={notifMenuOpen ? 'true' : undefined}
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <Notifications/>
                        </Badge>
                    </IconButton>

                    {/* User avatar with menu */}
                    <IconButton
                        onClick={handleUserMenuClick}
                        size="small"
                        aria-controls={userMenuOpen ? 'user-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={userMenuOpen ? 'true' : undefined}
                    >
                        <Avatar
                            alt={user?.name || 'User'}
                            sx={{bgcolor: theme.palette.primary.main}}
                        >
                            {(user?.name || 'U').charAt(0)}
                        </Avatar>
                    </IconButton>
                </Box>
            </Toolbar>

            {/* Notifications Menu */}
            <Menu
                id="notifications-menu"
                anchorEl={notifAnchorEl}
                open={notifMenuOpen}
                onClose={handleNotifMenuClose}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        width: 320,
                        maxHeight: 500,
                        mt: 1.5
                    }
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <Typography sx={{p: 2, fontWeight: 'bold'}}>Notifications</Typography>
                <Divider/>
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <MenuItem key={notif.id} sx={{
                            py: 1.5,
                            px: 2,
                            borderLeft: notif.read ? 'none' : `4px solid ${theme.palette.primary.main}`,
                            bgcolor: notif.read ? 'inherit' : 'action.hover'
                        }}>
                            <Typography variant="body2">{notif.message}</Typography>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem>
                        <Typography variant="body2">No notifications</Typography>
                    </MenuItem>
                )}
                <Divider/>
                <MenuItem onClick={handleNotifMenuClose} sx={{justifyContent: 'center'}}>
                    <Typography color="primary" variant="body2">View all notifications</Typography>
                </MenuItem>
            </Menu>

            {/* User Menu */}
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        width: 220,
                        mt: 1.5
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                        <Person fontSize="small"/>
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleSettingsClick}>
                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </AppBar>
    );
};

export default TopBar;