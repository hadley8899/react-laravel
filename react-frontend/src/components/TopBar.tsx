import React, {useState, useEffect, useCallback} from "react";
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
import NotificationService, {Notification} from "../services/NotificationService";
import User from "../interfaces/User.ts";

interface TopBarProps {
    handleDrawerToggle: () => void;
    user: User | null;
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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoadingNotifications(true);
        try {
            // For now, fetching only the first page. Implement pagination or infinite scroll as needed.
            const response = await NotificationService.getNotifications(1);
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.read_at).length);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
        setIsLoadingNotifications(false);
    }, []);

    useEffect(() => {
        fetchNotifications().then(() => {
        });
        // Optional: Set up polling for new notifications
        const intervalId = setInterval(fetchNotifications, 30000); // Fetch notifications every 30 seconds
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotifMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchorEl(event.currentTarget);
        fetchNotifications().then(() => {
        });
    };

    const handleNotifMenuClose = () => {
        setNotifAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleUserMenuClose();
        setNotifications([]); // Clear notifications on logout
        setUnreadCount(0);
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

    const handleMarkOneAsRead = async (notification: Notification) => {
        try {
            if (!notification.read_at) {
                await NotificationService.markAsRead(notification.id);
                // Refresh notifications or update the specific notification in the local state
                setNotifications(prevNotifications =>
                    prevNotifications.map(n =>
                        n.id === notification.id ? {...n, read_at: new Date().toISOString()} : n
                    )
                );
                setUnreadCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
            }

            if (notification.data.link) {
                // Navigate to the link if it exists

                let link = notification.data.link;
                // If the link has the full domain, Then strip it to just the path
                if (link.startsWith(window.location.origin)) {
                    link = link.replace(window.location.origin, '');
                }

                navigate(link);
            }

        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllUserNotificationsAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            setNotifications(prevNotifications =>
                prevNotifications.map(n => ({...n, read_at: new Date().toISOString()}))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const handleViewAllNotifications = () => {
        // Navigate to a dedicated notifications page if you have one
        // navigate('/notifications');
        handleNotifMenuClose();
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
                    {/* Only show ThemeSwitcher on desktop */}
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        <ThemeSwitcher/>
                    </Box>

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
                            src={user?.avatar_url || undefined}
                            sx={{bgcolor: theme.palette.primary.main}}
                        >
                            {!user?.avatar_url && (user?.name || 'U').charAt(0)}
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
                slotProps={{
                    paper: {
                        elevation: 4,
                        sx: {
                            width: 320,
                            maxHeight: 500,
                            mt: 1.5
                        }
                    }
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <Typography sx={{p: 2, fontWeight: 'bold'}}>Notifications</Typography>
                <Divider/>
                {isLoadingNotifications ? (
                    <MenuItem>
                        <Typography variant="body2">Loading notifications...</Typography>
                    </MenuItem>
                ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            onClick={() => handleMarkOneAsRead(notif)}
                            sx={{
                                py: 1.5,
                                px: 2,
                                borderLeft: notif.read_at ? 'none' : `4px solid ${theme.palette.primary.main}`,
                                bgcolor: notif.read_at ? 'inherit' : 'action.hover',
                                cursor: notif.read_at ? 'default' : 'pointer',
                            }}
                        >
                            <Typography variant="body2">{notif.data.message}</Typography>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem>
                        <Typography variant="body2">No new notifications</Typography>
                    </MenuItem>
                )}
                <Divider/>
                {notifications.length > 0 && unreadCount > 0 && (
                    <MenuItem onClick={handleMarkAllUserNotificationsAsRead} sx={{justifyContent: 'center'}}>
                        <Typography color="primary" variant="body2">Mark all as read</Typography>
                    </MenuItem>
                )}
                <MenuItem onClick={handleViewAllNotifications} sx={{justifyContent: 'center'}}>
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
                {/* ThemeSwitcher in menu for mobile only */}
                <Box sx={{display: {xs: 'flex', sm: 'none'}, px: 2, py: 1, justifyContent: 'center'}}>
                    <ThemeSwitcher/>
                </Box>
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
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        color: (theme) => theme.palette.error.main,
                        '& svg': {color: (theme) => theme.palette.error.main}
                    }}
                >
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
