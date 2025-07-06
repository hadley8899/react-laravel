import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

/* Public */
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword.tsx';
import ResetPassword from '../pages/ResetPassword';
import AcceptInvitation from '../pages/AcceptInvitation.tsx';

/* Protected */
import Dashboard from '../pages/Dashboard';
import Vehicles from '../pages/Vehicles';
import Customers from '../pages/Customers';
import Invoices from '../pages/Invoices';
import InvoiceDetails from '../pages/InvoiceDetails';
import Appointments from '../pages/Appointments';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import CustomerDetails from '../pages/CustomerDetails.tsx';
import InvoiceCreate from '../pages/InvoiceCreate.tsx';
import InvoiceEdit from '../pages/InvoiceEdit.tsx';
import AppointmentCreate from '../pages/AppointmentCreate.tsx';
import AppointmentDetails from '../pages/AppointmentDetails.tsx';
import AppointmentEdit from '../pages/AppointmentEdit.tsx';
import UserManagement from '../pages/UserManagement.tsx';
import VehicleDetails from '../pages/VehicleDetails.tsx';
import CompanySetupWizard from '../pages/CompanySetupWizard.tsx';
import Admin from '../pages/Admin.tsx';
import TagListPage from '../pages/tags/TagListPage.tsx';
import MediaLibrary from '../pages/MediaLibrary.tsx';
import EmailTemplates from '../pages/EmailTemplates.tsx';
import Editor from '../pages/Editor.tsx';
import EmailTemplateSend from '../pages/EmailTemplateSend.tsx';
import Campaigns from '../pages/Campaigns.tsx';
import CampaignDetail from '../pages/CampaignDetail.tsx';
import ContactCustomVariables from '../pages/ContactCustomVariables';  // ★ new

const AppRoutes: React.FC = () => (
    <Routes>
        {/* Public */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/accept-invitation" element={<AcceptInvitation/>}/>

        {/* Protected */}
        <Route element={<ProtectedRoute/>}>
            <Route path="/company-setup" element={<CompanySetupWizard/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>

            <Route path="/vehicles" element={<Vehicles/>}/>
            <Route path="/vehicles/:uuid" element={<VehicleDetails/>}/>

            <Route path="/customers" element={<Customers/>}/>
            <Route path="/customers/:uuid" element={<CustomerDetails/>}/>

            <Route path="/contact-fields" element={<ContactCustomVariables/>}/> {/* ★ new */}

            <Route path="/invoices" element={<Invoices/>}/>
            <Route path="/invoices/create" element={<InvoiceCreate/>}/>
            <Route path="/invoices/:uuid" element={<InvoiceDetails/>}/>
            <Route path="/invoices/:uuid/edit" element={<InvoiceEdit/>}/>

            <Route path="/appointments" element={<Appointments/>}/>
            <Route path="/appointments/create" element={<AppointmentCreate/>}/>
            <Route path="/appointments/:uuid" element={<AppointmentDetails/>}/>
            <Route path="/appointments/:uuid/edit" element={<AppointmentEdit/>}/>

            <Route path="/tags" element={<TagListPage/>}/>
            <Route path="/media" element={<MediaLibrary/>}/>

            <Route path="/profile" element={<Profile/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/user-management" element={<UserManagement/>}/>
            <Route path="/admin" element={<Admin/>}/>

            <Route path="/campaigns" element={<Campaigns/>}/>
            <Route path="/campaigns/:uuid" element={<CampaignDetail/>}/>

            <Route path="/email-templates" element={<EmailTemplates/>}/>
            <Route path="/email-templates/editor" element={<Editor/>}/>
            <Route path="/email-templates/editor/:uuid" element={<Editor/>}/>
            <Route path="/email-templates/send/:uuid" element={<EmailTemplateSend/>}/>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace/>}/>
    </Routes>
);

export default AppRoutes;
