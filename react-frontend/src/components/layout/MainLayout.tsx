import React, {useState, useContext, ReactNode, useEffect} from 'react';
import {Box, CssBaseline, Toolbar} from '@mui/material';
import {AuthContext} from '../../context/AuthContext';
import Sidebar from "../Sidebar";
import TopBar from "../TopBar";

interface MainLayoutProps {
    children: ReactNode;
    title?: string;
}

const drawerWidth = 240;

const MainLayout: React.FC<MainLayoutProps> = ({children, title}) => {
    const {user} = useContext(AuthContext);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Set page title
    useEffect(() => {
        if (title) {
            document.title = title;
        } else {
            document.title = 'React Laravel Starter';
        }
    });

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>

            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
            />

            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    width: {sm: `calc(100% - ${drawerWidth}px)`}
                }}
            >
                {/* Top bar */}
                <TopBar
                    drawerWidth={drawerWidth}
                    handleDrawerToggle={handleDrawerToggle}
                    user={user}
                    pageName={title}
                />

                {/* Page content */}
                <Toolbar/>

                <div style={{marginRight: '3%', marginLeft: '3%', paddingTop: '3%'}}>
                    {children}
                </div>
            </Box>
        </Box>
    );
};

export default MainLayout;