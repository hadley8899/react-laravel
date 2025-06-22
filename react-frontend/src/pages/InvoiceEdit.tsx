import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, CircularProgress, Container } from '@mui/material';
import MainLayout from "../components/layout/MainLayout.tsx";
import InvoiceForm from "../components/invoices/InvoiceForm.tsx";
import {CreateInvoicePayload, getInvoice, updateInvoice} from '../services/InvoiceService.ts';

const InvoiceEdit: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<CreateInvoicePayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* load existing */
    useEffect(() => {
        (async () => {
            try {
                if (!uuid) return;
                const data = await getInvoice(uuid);

                // Ensure status is valid for CreateInvoicePayload
                const validStatuses = ["Draft", "Pending", "Paid", "Overdue"] as const;
                const status = validStatuses.includes(data.status as any)
                    ? data.status as "Draft" | "Pending" | "Paid" | "Overdue"
                    : "Draft"; // Default fallback

                setInvoice({
                    customer_uuid: data.customer?.uuid || "",
                    invoice_number: data.invoice_number,
                    issue_date: data.issue_date,
                    due_date: data.due_date,
                    tax_rate: data.tax_rate,
                    subtotal: data.subtotal,
                    tax_amount: data.tax_amount,
                    total: data.total,
                    status: status,
                    notes: data.notes ?? '',
                    items: data.items.map((i) => ({
                        description: i.description,
                        quantity: i.quantity,
                        unit: i.unit ?? '',
                        unit_price: i.unit_price,
                        amount: i.amount,
                        uuid: i.uuid,
                    })),
                });
                setLoading(false);
            } catch (_err) {
                setError('Failed to load invoice');
                setLoading(false);
                console.error(_err);
            }
        })();
    }, [uuid]);

    /* submit */
    const handleSubmit = async (payload: CreateInvoicePayload) => {
        if (!uuid) return;
        try {
            setSaving(true);
            await updateInvoice(uuid, payload);
            navigate(`/invoices/${uuid}`);
        } catch (error: any) {
            setError(error?.response?.data?.message ?? 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    /* UI */
    return (
        <MainLayout title={"Edit Invoice"}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading || !invoice ? (
                    <CircularProgress />
                ) : (
                    <InvoiceForm
                        mode="edit"
                        initialValues={invoice}
                        onSubmit={handleSubmit}
                        loading={saving}
                    />
                )}
            </Container>
        </MainLayout>
    );
};

export default InvoiceEdit;
