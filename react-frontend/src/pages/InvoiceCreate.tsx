import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Container} from '@mui/material';
import {createInvoice, CreateInvoicePayload} from "../services/InvoiceService.ts";
import MainLayout from "../components/layout/MainLayout.tsx";
import InvoiceForm from "../components/invoices/InvoiceForm.tsx";

const InvoiceCreate: React.FC = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (payload: CreateInvoicePayload) => {
        try {
            setSaving(true);
            setError(null);
            const invoice = await createInvoice(payload);
            // happy path – go to details page
            navigate(`/invoices/${invoice.uuid}`);
        } catch (err: any) {
            console.error(err);
            setError(
                err?.response?.data?.message ??
                'Something went wrong. Please check your inputs and try again.'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <MainLayout title="Create Invoice">
            <Container maxWidth="lg" sx={{py: 4}}>
                {error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}
                <InvoiceForm onSubmit={handleSubmit} loading={saving}/>
            </Container>
        </MainLayout>
    );
};

export default InvoiceCreate;
