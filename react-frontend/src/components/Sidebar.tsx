import {
    Avatar, Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography,
} from '@mui/material';
import {
    CalendarMonth, Dashboard as DashboardIcon, DirectionsCar, Person, ReceiptLong, Settings,
    Shield, PhotoLibrary as PhotoLibraryIcon, Campaign as CampaignIcon,
    DynamicForm as DynamicFormIcon, EmailOutlined,
} from '@mui/icons-material';
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {getAuthUserLocal, hasPermission} from '../services/AuthService.ts';
import SwitchCompanyModal from './settings/SwitchCompany';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface SidebarProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

interface SidebarItem {
    title: string;
    path: string;
    icon: React.ReactNode;
    permissions?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({mobileOpen, handleDrawerToggle}) => {
    const drawerWidth = 240;
    const location = useLocation();
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(getAuthUserLocal());
    const [switchCompanyOpen, setSwitchCompanyOpen] = useState(false);

    useEffect(() => {
        const handleUserUpdate = () => {
            const au = getAuthUserLocal();
            if (au) setAuthUser(au);
        };
        window.addEventListener('user-updated', handleUserUpdate);
        return () => window.removeEventListener('user-updated', handleUserUpdate);
    }, []);

    const companyLogo = authUser?.company?.logo_url;
    const companyName = authUser?.company?.name || 'Company';

    /* ---------------- Main nav ---------------- */
    const mainNavItems: SidebarItem[] = [
        {title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon/>},
        {title: 'Customers', path: '/customers', icon: <PersonIcon/>, permissions: ['view_customers']},
        {title: 'Contact Fields', path: '/contact-fields', icon: <DynamicFormIcon/>}, // ★ new
        {title: 'Tags', path: '/tags', icon: <LocalOfferIcon/>},
        {title: 'Vehicles', path: '/vehicles', icon: <DirectionsCar/>, permissions: ['view_vehicles']},
        {title: 'Invoices', path: '/invoices', icon: <ReceiptLong/>, permissions: ['view_invoices']},
        {title: 'Appointments', path: '/appointments', icon: <CalendarMonth/>, permissions: ['view_appointments']},
        {title: 'Media Library', path: '/media', icon: <PhotoLibraryIcon/>},
        {title: 'Campaigns', path: '/campaigns', icon: <CampaignIcon/>},
        {title: 'Email Templates', path: '/email-templates', icon: <EmailOutlined/>}, // distinct icon
    ];

    const secondaryNavItems: SidebarItem[] = [
        {title: 'Profile', path: '/profile', icon: <Person/>},
        {title: 'Settings', path: '/settings', icon: <Settings/>},
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        if (mobileOpen) handleDrawerToggle();
    };

    const drawer = (
        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {companyLogo ? (
                    <Box component="img" src={companyLogo} alt={companyName}
                         sx={{maxWidth: '100%', maxHeight: 80, mb: 1}}/>
                ) : (
                    <Avatar sx={{width: 80, height: 80, mb: 1}}>{companyName.charAt(0)}</Avatar>
                )}
                <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>{companyName}</Typography>
            </Box>

            <Divider/>

            <List>
                {mainNavItems.map((item) => {
                    const show = !item.permissions || hasPermission(item.permissions);
                    return show ? (
                        <ListItemButton
                            key={item.path}
                            selected={location.pathname.startsWith(item.path)}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title}/>
                        </ListItemButton>
                    ) : null;
                })}
            </List>

            <Divider sx={{mt: 'auto'}}/>

            <List>
                {secondaryNavItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        selected={location.pathname.startsWith(item.path)}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title}/>
                    </ListItemButton>
                ))}

                {hasPermission('switch_companies') && (
                    <ListItemButton onClick={() => setSwitchCompanyOpen(true)}>
                        <ListItemIcon><SwapHorizIcon/></ListItemIcon>
                        <ListItemText primary="Switch Company"/>
                    </ListItemButton>
                )}

                {authUser?.role === 'Super Admin' && (
                    <ListItemButton onClick={() => handleNavigation('/admin')}>
                        <ListItemIcon><Shield/></ListItemIcon>
                        <ListItemText primary="Admin"/>
                    </ListItemButton>
                )}
            </List>

            <SwitchCompanyModal open={switchCompanyOpen} onClose={() => setSwitchCompanyOpen(false)}/>
        </Box>
    );

    return (
        <Box component="nav" sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
            {/* Mobile */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{keepMounted: true}}
                sx={{display: {xs: 'block', sm: 'none'}, '& .MuiDrawer-paper': {width: drawerWidth}}}
            >
                {drawer}
            </Drawer>

            {/* Desktop */}
            <Drawer
                variant="permanent"
                sx={{display: {xs: 'none', sm: 'block'}, '& .MuiDrawer-paper': {width: drawerWidth}}}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
