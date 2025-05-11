import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GetAppIcon from '@mui/icons-material/GetApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Invoice} from '../interfaces/Invoice';
import {getInvoice, downloadInvoicePdf, deleteInvoice, emailInvoice} from '../services/invoiceService';

const InvoiceDetails: React.FC = () => {
    const {uuid} = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                if (!uuid) return;
                setLoading(true);
                const data = await getInvoice(uuid);
                setInvoice(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching invoice:', err);
                setError('Failed to load invoice details');
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [uuid]);

    const handleBack = () => {
        navigate('/invoices');
    };

    const handleDownloadPdf = async () => {
        try {
            if (!uuid) return;
            const blob = await downloadInvoicePdf(uuid);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${uuid}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading PDF:', err);
            setError('Failed to download PDF');
        }
    };

    const handleDeleteInvoiceClick = (invoice: Invoice) => {
        setInvoiceToDelete(invoice);
        setDeleteDialogOpen(true);
    }

    const handleDeleteInvoice = () => {
        return async () => {
            try {
                const uuid = invoiceToDelete?.uuid;
                if (!uuid) return;
                setLoading(true);

                await deleteInvoice(uuid);
                setLoading(false);
                setDeleteDialogOpen(false);
                navigate('/invoices');
            } catch (err) {
                console.error('Error deleting invoice:', err);
                setError('Failed to delete invoice');
                setLoading(false);
            }
        };
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setInvoiceToDelete(null);
    };

    const handleEmail = async () => {
        try {
            if (!uuid) return;
            setLoading(true);
            await emailInvoice(uuid);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to send email');
            setLoading(false);
        }
    };

    // Get status chip
    const getStatusChip = (status: string) => {
        let color: "success" | "warning" | "error" | "info" | "default" = "default";
        const formattedStatus = status?.charAt(0).toUpperCase() + status?.slice(1)?.toLowerCase();

        switch (status?.toLowerCase()) {
            case 'paid':
                color = "success";
                break;
            case 'pending':
                color = "warning";
                break;
            case 'overdue':
                color = "error";
                break;
            case 'draft':
                color = "info";
                break;
            case 'cancelled':
                color = "default";
                break;
        }

        return <Chip label={formattedStatus} color={color} size="small"/>;
    };

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Box sx={{mb: 3, display: 'flex', alignItems: 'center'}}>
                    <Button
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon/>}
                        sx={{mr: 2}}
                    >
                        Back to Invoices
                    </Button>
                    <Typography variant="h5" component="h1" fontWeight="bold" sx={{flexGrow: 1}}>
                        Invoice Details
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{mb: 3}}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', my: 5}}>
                        <CircularProgress/>
                    </Box>
                ) : invoice ? (
                    <Paper sx={{p: 3, borderRadius: 2}} elevation={3}>
                        {/* Invoice Header */}
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2}}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Invoice #{invoice.invoice_number}
                                </Typography>
                                <Box sx={{mt: 1}}>
                                    {getStatusChip(invoice.status)}
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center'}}>
                                <Tooltip title="Download PDF">
                                    <IconButton size="small" onClick={handleDownloadPdf}>
                                        <GetAppIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Send to Customer">
                                    <IconButton size="small" onClick={handleEmail}>
                                        <MailOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Mark as Paid">
                                    <IconButton
                                        size="small"
                                        color="success"
                                        disabled={invoice.status === 'paid'}
                                    >
                                        <PaymentIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit Invoice">
                                    <IconButton
                                        size="small"
                                        onClick={() => navigate(`/invoices/${uuid}/edit`)}
                                    >
                                        <EditIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete Invoice">
                                    <IconButton size="small" color="error"
                                                onClick={() => handleDeleteInvoiceClick(invoice)}>
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </Box>

                        </Box>

                        <Divider sx={{my: 3}}/>

                        {/* Invoice Metadata & Customer Info */}
                        <Grid container spacing={3} sx={{mb: 4}}>
                            <Grid size={{xs: 12, md: 6}}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Customer
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {invoice.customer ?
                                        `${invoice.customer.first_name} ${invoice.customer.last_name}` :
                                        'N/A'}
                                </Typography>
                                {invoice.customer?.email && (
                                    <Typography variant="body2">
                                        {invoice.customer.email}
                                    </Typography>
                                )}
                                {invoice.customer?.phone && (
                                    <Typography variant="body2">
                                        {invoice.customer.phone}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 6}}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Issue Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(invoice.issue_date).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 6}}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Due Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Invoice Items */}
                        <Typography variant="h6" sx={{mb: 2}}>
                            Invoice Items
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{mb: 3}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.items && invoice.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">${Number(item.unit_price).toFixed(2)}</TableCell>
                                            <TableCell
                                                align="right">${Number(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Invoice Totals */}
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 3}}>
                            <Table sx={{maxWidth: '300px'}}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Subtotal</TableCell>
                                        <TableCell align="right">${Number(invoice.subtotal).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tax ({invoice.tax_rate}%)</TableCell>
                                        <TableCell align="right">${Number(invoice.tax_amount).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: 'bold'}}>Total</TableCell>
                                        <TableCell align="right"
                                                   sx={{fontWeight: 'bold'}}>${Number(invoice.total).toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>

                        {/* Notes */}
                        {invoice.notes && (
                            <>
                                <Divider sx={{my: 3}}/>
                                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                                    Notes
                                </Typography>
                                <Typography variant="body2">
                                    {invoice.notes}
                                </Typography>
                            </>
                        )}
                    </Paper>
                ) : (
                    <Alert severity="info">No invoice found with the specified ID.</Alert>
                )}
            </Container>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete {invoiceToDelete?.invoice_number || "this invoice"}?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteInvoice()} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </MainLayout>
    );
};

export default InvoiceDetails;
