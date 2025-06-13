import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Paper,
    Box,
    TablePagination,
    TextField,
    InputAdornment,
    Button,
    Alert,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from "@mui/icons-material/Add";

// Import service and interface
import {Invoice} from "../interfaces/Invoice";
import {getInvoices, downloadInvoicePdf} from "../services/invoiceService";
import InvoicesTable from "../components/invoices/InvoicesTable.tsx";

type Order = 'asc' | 'desc';

const Invoices: React.FC = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Search and sort state
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<string>('issue_date');

    // Fetch invoices function
    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const apiPage = page + 1; // API uses 1-based pagination
            const response = await getInvoices(
                apiPage,
                rowsPerPage,
                searchTerm,
                orderBy,
                order
            );
            setInvoices(response.data);
            setTotalCount(response.meta.total);
            setLoading(false);
        } catch (err) {
            setError('Failed to load invoices. Please try again.');
            setLoading(false);
            console.error('Error fetching invoices:', err);
        }
    }, [page, rowsPerPage, searchTerm, orderBy, order]);

    // Load invoices on component mount and when dependencies change
    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    // Handle search input with debounce
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(0); // Reset to first page on new search
    };

    // Sorting handler
    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Note: Ideally the API would handle sorting, but we're sorting client-side for now
    };

    // Pagination handlers
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle view invoice
    const handleViewInvoice = (uuid: string) => {
        navigate(`/invoices/${uuid}`);
    };

    // Handle download PDF
    const handleDownloadPdf = async (uuid: string) => {
        try {
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
            setError('Failed to download PDF. Please try again.');
        }
    };

    // Handle create invoice
    const handleCreateInvoice = () => {
        navigate('/invoices/create');
    };


    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{py: 4}}>
                <Paper sx={{p: 3, borderRadius: 2, overflow: 'hidden'}} elevation={3}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 3
                        }}
                    >
                        <Typography variant="h5" component="h1" fontWeight="bold">
                            <ReceiptIcon sx={{mr: 1, verticalAlign: 'middle'}}/>
                            Invoices
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 1,
                                width: { xs: '100%', sm: 'auto' },
                                flex: 1,
                                maxWidth: { xs: '100%', sm: 'unset' },
                            }}
                        >
                            <TextField
                                variant="outlined"
                                placeholder="Search invoices..."
                                size="small"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                sx={{
                                    minWidth: { xs: 0, sm: '280px' },
                                    width: { xs: '100%', sm: 'auto' },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                size="medium"
                                onClick={handleCreateInvoice}
                                sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Create Invoice
                            </Button>
                        </Box>
                    </Box>

                    {/* Error message */}
                    {error && (
                        <Alert severity="error" sx={{mb: 3}}>
                            {error}
                        </Alert>
                    )}

                    <InvoicesTable
                        invoices={invoices}
                        loading={loading}
                        handleDownloadPdf={(invoice) => handleDownloadPdf(invoice.uuid)}
                        handleViewInvoice={(invoice) => handleViewInvoice(invoice.uuid)}
                        handleRequestSort={handleRequestSort}
                        order={order}
                        orderBy={orderBy}
                    />

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{borderTop: 1, borderColor: 'divider'}}
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Invoices;
