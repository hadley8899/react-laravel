import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from "../components/layout/MainLayout";
import {
    Typography,
    Container,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from "@mui/icons-material/Add";

// Import service and interface
import { Invoice } from "../interfaces/Invoice";
import { getInvoices, downloadInvoicePdf } from "../services/invoiceService";

// Helper type for sorting
type Order = 'asc' | 'desc';

// Updated HeadCell configuration to match API response
interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: 'invoice_number', numeric: false, label: 'Invoice #', sortable: true },
    { id: 'customer.name', numeric: false, label: 'Customer', sortable: true },
    { id: 'issue_date', numeric: false, label: 'Issued', sortable: true },
    { id: 'due_date', numeric: false, label: 'Due Date', sortable: true },
    { id: 'total', numeric: true, label: 'Amount ($)', sortable: true },
    { id: 'status', numeric: false, label: 'Status', sortable: true },
    { id: 'actions', numeric: false, label: 'Actions', sortable: false },
];

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
            const response = await getInvoices(apiPage, rowsPerPage, searchTerm);
            setInvoices(response.data);
            setTotalCount(response.meta.total);
            setLoading(false);
        } catch (err) {
            setError('Failed to load invoices. Please try again.');
            setLoading(false);
            console.error('Error fetching invoices:', err);
        }
    }, [page, rowsPerPage, searchTerm]);

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

    // Get status chip
    const getStatusChip = (status: string) => {
        let color: "success" | "warning" | "error" | "info" | "default" = "default";
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        switch (status.toLowerCase()) {
            case 'paid': color = "success"; break;
            case 'pending': color = "warning"; break;
            case 'overdue': color = "error"; break;
            case 'draft': color = "info"; break;
            case 'cancelled': color = "default"; break;
        }

        return <Chip label={formattedStatus} color={color} size="small" />;
    };

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 2, overflow: 'hidden' }} elevation={3}>
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
                            <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Invoices
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                            <TextField
                                variant="outlined"
                                placeholder="Search invoices..."
                                size="small"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ minWidth: '280px' }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="medium"
                                onClick={handleCreateInvoice}
                            >
                                Create Invoice
                            </Button>
                        </Box>
                    </Box>

                    {/* Error message */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Invoices Table */}
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size='medium'>
                            <TableHead sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' : 'left'}
                                            padding='normal'
                                            sortDirection={orderBy === headCell.id ? order : false}
                                        >
                                            {headCell.sortable ? (
                                                <TableSortLabel
                                                    active={orderBy === headCell.id}
                                                    direction={orderBy === headCell.id ? order : 'asc'}
                                                    onClick={() => handleRequestSort(headCell.id)}
                                                >
                                                    {headCell.label}
                                                </TableSortLabel>
                                            ) : (
                                                headCell.label
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={headCells.length} align="center" sx={{ py: 5 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <TableRow
                                            hover
                                            key={invoice.uuid}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {invoice.invoice_number}
                                            </TableCell>
                                            <TableCell align="left">{invoice.customer?.name || 'N/A'}</TableCell>
                                            <TableCell align="left">{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                                            <TableCell align="left">{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">${Number(invoice.total).toFixed(2)}</TableCell>
                                            <TableCell align="left">{getStatusChip(invoice.status)}</TableCell>
                                            <TableCell align="left">
                                                <Tooltip title="View Invoice">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewInvoice(invoice.uuid)}
                                                    >
                                                        <VisibilityIcon fontSize='small'/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Download PDF">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDownloadPdf(invoice.uuid)}
                                                    >
                                                        <GetAppIcon fontSize='small'/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={headCells.length} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                No invoices found matching your search criteria.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ borderTop: 1, borderColor: 'divider' }}
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Invoices;
