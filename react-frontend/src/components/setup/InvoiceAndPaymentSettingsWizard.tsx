import React, {useEffect, useState} from 'react';
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Typography,
    InputAdornment,
    Paper,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {Company} from '../../interfaces/Company';

type PaymentTerms = 'DueOnReceipt' | 'Net7' | 'Net15' | 'Net30';

interface Props {
    company: Company | null;
    setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

const InvoiceAndPaymentSettingsWizard: React.FC<Props> = ({company, setCompany}) => {
    /* ------------------- local ------------------- */
    const [invoicePrefix, setInvoicePrefix] = useState('INV-');
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState(1);
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('Net15');
    const [invoiceNotes, setInvoiceNotes] = useState('');
    const [errors, setErrors] = useState({
        invoicePrefix: '',
        invoiceNotes: '',
    });

    /* ------------- initialise from prop ---------- */
    useEffect(() => {
        if (!company) return;
        setInvoicePrefix(company.invoice_prefix ?? 'INV-');
        setNextInvoiceNumber(company.next_invoice_number ?? 1);
        setPaymentTerms(
            (company.default_payment_terms as PaymentTerms) ?? 'Net15',
        );
        setInvoiceNotes(company.invoice_footer_notes ?? '');
    }, [company]);

    /* ---------------- propagate up --------------- */
    const update = (field: keyof Company, value: any) =>
        setCompany(c => (c ? {...c, [field]: value} as Company : c));

    // Validation helpers
    const maxLength = (val: string, max: number) => !val || val.length <= max;

    const validateField = (field: keyof typeof errors, value: string) => {
        switch (field) {
            case 'invoicePrefix':
                if (!value) return 'Invoice prefix is required';
                if (!maxLength(value, 32)) return 'Max 32 characters';
                return '';
            case 'invoiceNotes':
                if (!maxLength(value, 1000)) return 'Max 1000 characters';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (field: keyof typeof errors, value: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: validateField(field, value)
        }));
    };

    const handleChange = (
        field: keyof typeof errors,
        value: string,
        setter: (v: string) => void
    ) => {
        setter(value);
        update(
            field === 'invoicePrefix'
                ? 'invoice_prefix'
                : field === 'invoiceNotes'
                ? 'invoice_footer_notes'
                : (field as keyof Company),
            value
        );
        setErrors(prev => ({
            ...prev,
            [field]: prev[field] ? validateField(field, value) : ''
        }));
    };

    if (!company) return null;

    /* ---------------- render --------------------- */
    return (
        <Box>
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 3,
                    p: { xs: 2, sm: 3 },
                    // Match CompanyInfoWizard: remove custom background color
                }}
            >
                <Typography variant="h6" mb={2} sx={{display: 'flex', alignItems: 'center'}}>
                    <ReceiptIcon sx={{mr: 1}}/>
                    Invoice & Payment Settings
                </Typography>
                <Grid container spacing={3}>
                    {/* Invoice prefix */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Invoice Prefix"
                            value={invoicePrefix}
                            onChange={event => handleChange('invoicePrefix', event.target.value, setInvoicePrefix)}
                            onBlur={() => handleBlur('invoicePrefix', invoicePrefix)}
                            error={!!errors.invoicePrefix}
                            helperText={errors.invoicePrefix}
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                                }
                            }}
                        />
                    </Grid>

                    {/* Next number (read-only info) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Next Invoice #"
                            value={nextInvoiceNumber}
                            disabled
                            helperText="Auto-increments when you create invoices."
                        />
                    </Grid>

                    {/* Payment terms */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="Default Payment Terms"
                            value={paymentTerms}
                            onChange={event => {
                                const val = event.target.value as PaymentTerms;
                                setPaymentTerms(val);
                                update('default_payment_terms', val);
                            }}
                        >
                            <MenuItem value="DueOnReceipt">Due on Receipt</MenuItem>
                            <MenuItem value="Net7">Net 7 Days</MenuItem>
                            <MenuItem value="Net15">Net 15 Days</MenuItem>
                            <MenuItem value="Net30">Net 30 Days</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Footer notes */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Default Invoice Footer Notes"
                            value={invoiceNotes}
                            onChange={event => handleChange('invoiceNotes', event.target.value, setInvoiceNotes)}
                            onBlur={() => handleBlur('invoiceNotes', invoiceNotes)}
                            error={!!errors.invoiceNotes}
                            helperText={errors.invoiceNotes}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default InvoiceAndPaymentSettingsWizard;
