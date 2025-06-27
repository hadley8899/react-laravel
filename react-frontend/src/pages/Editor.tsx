import React from "react";
import MainLayout from "../components/layout/MainLayout.tsx";
import EmailEditor from "../components/EmailEditor.tsx"; // You'll need to create this file

const Editor: React.FC = () => {
    return (
        <MainLayout>
            <EmailEditor />
        </MainLayout>
    )
}

export default Editor;