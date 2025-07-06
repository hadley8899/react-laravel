import {
    Avatar, Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    ListSubheader, Typography,
} from '@mui/material';
import {
    CalendarMonth, Dashboard as DashboardIcon, DirectionsCar, ReceiptLong, Settings,
    Shield, PhotoLibrary as PhotoLibraryIcon, Campaign as CampaignIcon,
    DynamicForm as DynamicFormIcon, EmailOutlined, Person, CloudUpload,
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

interface SidebarGroup {
    title: string;
    items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({mobileOpen, handleDrawerToggle}) => {
    const drawerWidth = 240;
    const location = useLocation();
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(getAuthUserLocal());
    const [switchCompanyOpen, setSwitchCompanyOpen] = useState(false);

    useEffect(() => {
        const h = () => setAuthUser(getAuthUserLocal());
        window.addEventListener('user-updated', h);
        return () => window.removeEventListener('user-updated', h);
    }, []);

    const companyLogo = authUser?.company?.logo_url;
    const companyName = authUser?.company?.name || 'Company';

    /* ---------- grouped nav ---------- */
    const groups: SidebarGroup[] = [
        {
            title: 'General',
            items: [{title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon/>}],
        },
        {
            title: 'Contacts',
            items: [
                {title: 'Customers', path: '/customers', icon: <PersonIcon/>, permissions: ['view_customers']},
                {title: 'Contact Fields', path: '/contact-fields', icon: <DynamicFormIcon/>},
                {title: 'Tags', path: '/tags', icon: <LocalOfferIcon/>},
                {title: 'Import Jobs', path: '/imports', icon: <CloudUpload/>},                // ★ new
            ],
        },
        {
            title: 'Fleet',
            items: [{title: 'Vehicles', path: '/vehicles', icon: <DirectionsCar/>, permissions: ['view_vehicles']}],
        },
        {
            title: 'Billing',
            items: [{title: 'Invoices', path: '/invoices', icon: <ReceiptLong/>, permissions: ['view_invoices']}],
        },
        {
            title: 'Schedule',
            items: [{
                title: 'Appointments',
                path: '/appointments',
                icon: <CalendarMonth/>,
                permissions: ['view_appointments']
            }],
        },
        {
            title: 'Marketing',
            items: [
                {title: 'Campaigns', path: '/campaigns', icon: <CampaignIcon/>},
                {title: 'Email Templates', path: '/email-templates', icon: <EmailOutlined/>},
            ],
        },
        {
            title: 'Media',
            items: [{title: 'Media Library', path: '/media', icon: <PhotoLibraryIcon/>}],
        },
    ];

    const secondary: SidebarItem[] = [
        {title: 'Profile', path: '/profile', icon: <Person/>},
        {title: 'Settings', path: '/settings', icon: <Settings/>},
    ];

    const go = (p: string) => {
        navigate(p);
        if (mobileOpen) handleDrawerToggle();
    };

    const drawer = (
        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {companyLogo
                    ? <Box component="img" src={companyLogo} alt={companyName}
                           sx={{maxWidth: '100%', maxHeight: 80, mb: 1}}/>
                    : <Avatar sx={{width: 80, height: 80, mb: 1}}>{companyName.charAt(0)}</Avatar>}
                <Typography variant="subtitle2" fontWeight="bold">{companyName}</Typography>
            </Box>

            <Divider/>

            {groups.map(g => (
                <List key={g.title}
                      subheader={<ListSubheader component="div">{g.title}</ListSubheader>}>
                    {g.items.map(item => {
                        const show = !item.permissions || hasPermission(item.permissions);
                        return show && (
                            <ListItemButton key={item.path}
                                            selected={location.pathname.startsWith(item.path)}
                                            onClick={() => go(item.path)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.title}/>
                            </ListItemButton>
                        );
                    })}
                </List>
            ))}

            <Divider sx={{mt: 'auto'}}/>

            <List>
                {secondary.map(i => (
                    <ListItemButton key={i.path}
                                    selected={location.pathname.startsWith(i.path)}
                                    onClick={() => go(i.path)}>
                        <ListItemIcon>{i.icon}</ListItemIcon>
                        <ListItemText primary={i.title}/>
                    </ListItemButton>
                ))}

                {hasPermission('switch_companies') && (
                    <ListItemButton onClick={() => setSwitchCompanyOpen(true)}>
                        <ListItemIcon><SwapHorizIcon/></ListItemIcon>
                        <ListItemText primary="Switch Company"/>
                    </ListItemButton>
                )}

                {authUser?.role === 'Super Admin' && (
                    <ListItemButton onClick={() => go('/admin')}>
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
                sx={{display: {xs: 'none', sm: 'block'}, '& .MuiDrawer-paper': {width: drawerWidth}}} open>
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
