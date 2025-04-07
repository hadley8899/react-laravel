import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import {
    CalendarMonth,
    Dashboard as DashboardIcon,
    DirectionsCar,
    Person,
    ReceiptLong,
    Settings
} from "@mui/icons-material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

interface SidebarItem {
    title: string;
    path: string;
    icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
    const drawerWidth = 240;
    const location = useLocation();
    const navigate = useNavigate();

    // Define navigation items
    const mainNavItems: SidebarItem[] = [
        { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
        { title: "Vehicles", path: "/vehicles", icon: <DirectionsCar /> },
        { title: "Invoices", path: "/invoices", icon: <ReceiptLong /> },
        { title: "Appointments", path: "/appointments", icon: <CalendarMonth /> }
    ];

    const secondaryNavItems: SidebarItem[] = [
        { title: "Profile", path: "/profile", icon: <Person /> },
        { title: "Settings", path: "/settings", icon: <Settings /> }
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        if (mobileOpen) {
            handleDrawerToggle();
        }
    };

    // Sidebar items
    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                React Laravel Starter
            </Typography>
            <List>
                {mainNavItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        selected={location.pathname === item.path}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                ))}
            </List>
            <Divider sx={{ mt: 'auto' }} />
            <List>
                {secondaryNavItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        selected={location.pathname === item.path}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { width: drawerWidth }
                }}
            >
                {drawer}
            </Drawer>

            {/* Permanent drawer for desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    }
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;