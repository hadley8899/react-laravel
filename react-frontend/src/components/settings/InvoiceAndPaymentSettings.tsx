import {
    Box,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem, Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";

type PaymentTerms = 'DueOnReceipt' | 'Net7' | 'Net15' | 'Net30';

const InvoiceAndPaymentSettings: React.FC = () => {

    // Invoicing
    const [invoicePrefix, setInvoicePrefix] = useState<string>("INV-");
    const [nextInvoiceNum] = useState<number>(1056); // Display only example
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('Net15');
    const [invoiceNotes, setInvoiceNotes] = useState<string>("Thank you for your business. Payment is due within 15 days.");

    return (

        <Box sx={{mb: 5}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <ReceiptIcon/>
                <Typography variant="h6" component="h2" fontWeight="medium">
                    Invoice and Payment Settings
                </Typography>
            </Box>
            <Paper variant="outlined" sx={{p: {xs: 2, sm: 3}}}>
                <Grid container spacing={3}>
                    <Grid>
                        <TextField
                            label="Invoice ID Prefix"
                            value={invoicePrefix}
                            onChange={(e) => setInvoicePrefix(e.target.value)}
                            fullWidth
                            slotProps={{
                                input: {startAdornment: <InputAdornment position="start">#</InputAdornment>}
                            }}
                        />
                    </Grid>
                    <Grid>
                        <TextField label="Next Invoice Number" value={nextInvoiceNum} disabled fullWidth
                                   helperText="Auto-increments, cannot be edited here."/>
                    </Grid>
                    <Grid>
                        <FormControl fullWidth>
                            <InputLabel id="payment-terms-label">Default Payment Terms</InputLabel>
                            <Select
                                labelId="payment-terms-label"
                                label="Default Payment Terms"
                                value={paymentTerms}
                                onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
                            >
                                <MenuItem value={'DueOnReceipt'}>Due On Receipt</MenuItem>
                                <MenuItem value={'Net7'}>Net 7 Days</MenuItem>
                                <MenuItem value={'Net15'}>Net 15 Days</MenuItem>
                                <MenuItem value={'Net30'}>Net 30 Days</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid>
                        <TextField label="Default Invoice Footer Notes" value={invoiceNotes}
                                   onChange={(e) => setInvoiceNotes(e.target.value)} fullWidth multiline rows={3}/>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default InvoiceAndPaymentSettings;