import React from "react";
import MainLayout from "../components/layout/MainLayout.tsx";
import EmailEditor from "../components/email-editor/EmailEditor.tsx";

const Editor: React.FC = () => {
    return (
        <MainLayout>
            <EmailEditor />
        </MainLayout>
    )
}

export default Editor;