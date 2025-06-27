import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import EmailEditor from "../components/email-editor/EmailEditor.tsx";

const EditorPage: React.FC = () => {
    const { uuid } = useParams(); // undefined when creating a new template
    return (
        <MainLayout>
            <EmailEditor templateUuid={uuid} />
        </MainLayout>
    );
};

export default EditorPage;