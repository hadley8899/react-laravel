import React, { useState, useMemo } from 'react';
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
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp'; // Download icon
import AddIcon from "@mui/icons-material/Add";

// Import data and interface
import { Invoice, InvoiceStatus } from "../interfaces/Invoice";
import invoicesData from "../example-data/invoices"; // Default import

// Helper type for sorting
type Order = 'asc' | 'desc';

// Head cell configuration
interface HeadCell {
    id: keyof Invoice;
    label: string;
    numeric: boolean;
    sortable: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: 'id', numeric: false, label: 'Invoice ID', sortable: true },
    { id: 'customerName', numeric: false, label: 'Customer', sortable: true },
    { id: 'issueDate', numeric: false, label: 'Issued', sortable: true },
    { id: 'dueDate', numeric: false, label: 'Due Date', sortable: true },
    { id: 'amount', numeric: true, label: 'Amount ($)', sortable: true },
    { id: 'status', numeric: false, label: 'Status', sortable: true },
    { id: 'actions' as any, numeric: false, label: 'Actions', sortable: false }, // Action column
];


// Utility for stable sorting
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1]; // Stabilize by original index if equal
    });
    return stabilizedThis.map((el) => el[0]);
}

// Utility for getting comparator
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}


const Invoices: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Invoice>('dueDate'); // Default sort


    const handleRequestSort = (property: keyof Invoice) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filter invoices based on search term
    const filteredInvoices = useMemo(() => invoicesData.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    // Sort and paginate visible rows
    const visibleRows = useMemo(() =>
            stableSort(filteredInvoices, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredInvoices, order, orderBy, page, rowsPerPage]
    );

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Get status color for Chips
    const getStatusChip = (status: InvoiceStatus) => {
        let color: "success" | "warning" | "error" | "info" | "default" = "default";
        switch (status) {
            case 'Paid': color = "success"; break;
            case 'Pending': color = "warning"; break;
            case 'Overdue': color = "error"; break;
            case 'Draft': color = "info"; break;
        }
        return <Chip label={status} color={color} size="small" />;
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
                                placeholder="Search Invoice ID or Customer..."
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ minWidth: '280px' }} // Wider search
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="medium"
                            >
                                Create Invoice
                            </Button>
                        </Box>
                    </Box>

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
                                {visibleRows.length > 0 ? (
                                    visibleRows.map((invoice) => (
                                        <TableRow
                                            hover // Add hover effect
                                            key={invoice.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {invoice.id}
                                            </TableCell>
                                            <TableCell align="left">{invoice.customerName}</TableCell>
                                            <TableCell align="left">{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                                            <TableCell align="left">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">${invoice.amount.toFixed(2)}</TableCell>
                                            <TableCell align="left">{getStatusChip(invoice.status)}</TableCell>
                                            <TableCell align="left">
                                                <Tooltip title="View Invoice">
                                                    <IconButton size="small">
                                                        <VisibilityIcon fontSize='small'/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Download PDF">
                                                    <IconButton size="small">
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
                        count={filteredInvoices.length}
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
