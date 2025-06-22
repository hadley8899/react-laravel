import React, {useEffect, useState} from 'react';
import {
    Paper,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    Button,
    CircularProgress,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SaveIcon from '@mui/icons-material/Save';

import {
    updateCompanyBilling,
    UpdateCompanyBillingPayload,
} from '../../services/CompanyService';
import {useNotifier} from '../../context/NotificationContext.tsx';
import SettingsAccordionItem from "../layout/SettingsAccordionItem.tsx";
import {Company} from "../../interfaces/Company.ts";

type PaymentTerms = 'DueOnReceipt' | 'Net7' | 'Net15' | 'Net30';

interface InvoiceAndPaymentSettingsProps {
    company: Company | null;
    setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

const InvoiceAndPaymentSettings: React.FC<InvoiceAndPaymentSettingsProps> = ({company, setCompany}) => {
    const {showNotification} = useNotifier();

    /* -------------------------------- state ------------------------------- */
    const [companyUuid, setCompanyUuid] = useState<string>('');

    const [invoicePrefix, setInvoicePrefix] = useState('INV-');
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState(1);
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('Net15');
    const [invoiceNotes, setInvoiceNotes] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ----------------------------- fetch current -------------------------- */
    useEffect(() => {
        if (!company) {
            setLoading(true);
            return;
        }
        setCompanyUuid(company.uuid);
        setInvoicePrefix(company.invoice_prefix ?? 'INV-');
        setNextInvoiceNumber(company.next_invoice_number ?? 1);
        setPaymentTerms((company.default_payment_terms ?? 'Net15') as PaymentTerms);
        setInvoiceNotes(company.invoice_footer_notes ?? '');
        setLoading(false);
    }, [company]);

    /* ----------------------------- save handler --------------------------- */
    const handleSave = async () => {
        if (!companyUuid) {
            setError('Company UUID is required to save settings.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const payload: UpdateCompanyBillingPayload = {
                invoice_prefix: invoicePrefix.trim(),
                default_payment_terms: paymentTerms,
                invoice_footer_notes: invoiceNotes.trim(),
            };
            const updatedCompany = await updateCompanyBilling(companyUuid, payload);
            setCompany(updatedCompany);
            showNotification('Invoice & payment settings saved!', 'success');
        } catch (e: any) {
            setError(e.message ?? 'Save failed.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SettingsAccordionItem
            title="Invoice & Payment Settings"
            icon={<ReceiptIcon/>}
            isLoading={loading}
            error={error}
        >
            <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 4}}>
                        <TextField
                            label="Invoice Prefix"
                            fullWidth
                            value={invoicePrefix}
                            onChange={(e) => setInvoicePrefix(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                                }
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <TextField
                            label="Next Invoice #"
                            fullWidth
                            disabled
                            value={nextInvoiceNumber}
                            helperText="Auto-increments; edit via DB if you must reset."
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <TextField
                            select
                            label="Default Payment Terms"
                            fullWidth
                            value={paymentTerms}
                            onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
                        >
                            <MenuItem value="DueOnReceipt">Due on Receipt</MenuItem>
                            <MenuItem value="Net7">Net 7 Days</MenuItem>
                            <MenuItem value="Net15">Net 15 Days</MenuItem>
                            <MenuItem value="Net30">Net 30 Days</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Default Invoice Footer Notes"
                            fullWidth
                            multiline
                            rows={3}
                            value={invoiceNotes}
                            onChange={(e) => setInvoiceNotes(e.target.value)}
                        />
                    </Grid>

                    <Grid size={12} sx={{textAlign: 'right'}}>
                        <Button
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon/>}
                            disabled={saving}
                            onClick={handleSave}
                        >
                            {saving ? 'Saving…' : 'Save Settings'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </SettingsAccordionItem>
    );
};

export default InvoiceAndPaymentSettings;
