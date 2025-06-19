import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
// Public pages
import Login from '../pages/Login';
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import ResetPassword from "../pages/ResetPassword";
import AcceptInvitation from "../pages/AcceptInvitation.tsx";

//Protected pages
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles";
import Customers from "../pages/Customers";
import Invoices from "../pages/Invoices";
import InvoiceDetails from "../pages/InvoiceDetails";
import Appointments from "../pages/Appointments";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import CustomerDetails from '../pages/CustomerDetails.tsx';
import InvoiceCreate from "../pages/InvoiceCreate.tsx";
import InvoiceEdit from '../pages/InvoiceEdit.tsx';
import AppointmentCreate from "../pages/AppointmentCreate.tsx";
import AppointmentDetails from "../pages/AppointmentDetails.tsx";
import AppointmentEdit from "../pages/AppointmentEdit.tsx";
import UserManagement from "../pages/UserManagement.tsx";
import VehicleDetails from "../pages/VehicleDetails.tsx";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/accept-invitation" element={<AcceptInvitation/>}/>

            {/* Protected routes */}
            <Route element={<ProtectedRoute/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/vehicles" element={<Vehicles/>}/>
                <Route path="/vehicles/:uuid" element={<VehicleDetails/>}/>
                <Route path="/customers" element={<Customers/>}/>
                <Route path="/customers/:uuid" element={<CustomerDetails/>}/>
                <Route path="/invoices" element={<Invoices/>}/>
                <Route path="/invoices/create" element={<InvoiceCreate/>}/>
                <Route path="/invoices/:uuid" element={<InvoiceDetails/>}/>
                <Route path="/invoices/:uuid/edit" element={<InvoiceEdit/>}/>
                <Route path="/appointments" element={<Appointments/>}/>
                <Route path="/appointments/create" element={<AppointmentCreate/>}/>
                <Route path="/appointments/:uuid" element={<AppointmentDetails/>}/>
                <Route path="/appointments/:uuid/edit" element={<AppointmentEdit/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/user-management" element={<UserManagement/>}/>

            </Route>

            <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
    );
};

export default AppRoutes;
