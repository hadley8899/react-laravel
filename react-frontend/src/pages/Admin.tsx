import React from "react";
import MainLayout from "../components/layout/MainLayout.tsx";

const Admin: React.FC = () => {
    return (
        <MainLayout>
            <div>
                <h1>Admin Page</h1>
                <p>This is the admin page. Only accessible to users with admin permissions.</p>
                {/* Add your admin content here */}
            </div>
        </MainLayout>
    )
}

export default Admin;