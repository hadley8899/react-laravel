import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
// Public pages
import Login from '../pages/Login';
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import ResetPassword from "../pages/ResetPassword";

//Protected pages
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles";
import Customers from "../pages/Customers";
import Invoices from "../pages/Invoices";
import Appointments from "../pages/Appointments";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>

            {/* Protected routes */}
            <Route element={<ProtectedRoute/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/vehicles" element={<Vehicles/>}/>
                <Route path="/customers" element={<Customers/>}/>
                <Route path="/invoices" element={<Invoices/>}/>
                <Route path="/appointments" element={<Appointments/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/settings" element={<Settings/>}/>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
    );
};

export default AppRoutes;
