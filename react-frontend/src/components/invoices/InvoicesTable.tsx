import {
    Chip,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
    Box,
    Paper
} from '@mui/material';
import React from 'react';
import VisibilityIcon from "@mui/icons-material/Visibility";
import GetAppIcon from '@mui/icons-material/GetApp';
import {Invoice} from "../../interfaces/Invoice.ts";
import { useTheme } from '@mui/material/styles';

interface HeadCell {
    uuid: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
}

interface InvoicesTableProps {
    loading?: boolean,
    invoices: Invoice[],
    order: 'asc' | 'desc',
    handleRequestSort: (property: string) => void,
    orderBy: string;
    handleViewInvoice: (invoice: Invoice) => void;
    handleDownloadPdf: (invoice: Invoice) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
                                                         invoices,
                                                         loading,
                                                         order,
                                                         handleRequestSort,
                                                         orderBy,
                                                         handleViewInvoice,
                                                         handleDownloadPdf,
                                                     }) => {
    const theme = useTheme();

    const headCells: readonly HeadCell[] = [
        {uuid: 'invoice_number', numeric: false, label: 'Invoice #', sortable: true},
        {uuid: 'customer.name', numeric: false, label: 'Customer', sortable: true},
        {uuid: 'issue_date', numeric: false, label: 'Issued', sortable: true},
        {uuid: 'due_date', numeric: false, label: 'Due Date', sortable: true},
        {uuid: 'total', numeric: true, label: 'Amount ($)', sortable: true},
        {uuid: 'status', numeric: false, label: 'Status', sortable: true},
        {uuid: 'actions', numeric: false, label: 'Actions', sortable: false},
    ];

    const customersFullName = (customer) => {
        if (!customer) return 'N/A';
        const {first_name, last_name} = customer;
        return `${first_name || ''} ${last_name || ''}`.trim();
    }

    // Get status chip
    const getStatusChip = (status: string) => {
        let color: "success" | "warning" | "error" | "info" | "default" = "default";
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        switch (status.toLowerCase()) {
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
        <>
            {/* Desktop Table */}
            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                <Table sx={{minWidth: 750}} aria-labelledby="tableTitle" size='medium'>
                    <TableHead sx={{backgroundColor: (theme) => theme.palette.action.hover}}>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.uuid}
                                    align={headCell.numeric ? 'right' : 'left'}
                                    padding='normal'
                                    sortDirection={orderBy === headCell.uuid ? order : false}
                                >
                                    {headCell.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === headCell.uuid}
                                            direction={orderBy === headCell.uuid ? order : 'asc'}
                                            onClick={() => handleRequestSort(headCell.uuid)}
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
                                <TableCell colSpan={headCells.length} align="center" sx={{py: 5}}>
                                    <CircularProgress/>
                                </TableCell>
                            </TableRow>
                        ) : invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <TableRow
                                    hover
                                    key={invoice.uuid}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {invoice.invoice_number}
                                    </TableCell>
                                    <TableCell align="left">{customersFullName(invoice.customer)}</TableCell>
                                    <TableCell align="left">{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                                    <TableCell align="left">{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">${Number(invoice.total).toFixed(2)}</TableCell>
                                    <TableCell align="left">{getStatusChip(invoice.status)}</TableCell>
                                    <TableCell align="left">
                                        <Tooltip title="View Invoice">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewInvoice(invoice)}
                                            >
                                                <VisibilityIcon fontSize='small'/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download PDF">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDownloadPdf(invoice)}
                                            >
                                                <GetAppIcon fontSize='small'/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={headCells.length} align="center" sx={{py: 4}}>
                                    <Typography color="text.secondary">
                                        No invoices found matching your search criteria.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Mobile Cards */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : invoices.length > 0 ? (
                    invoices.map((invoice) => (
                        <Paper
                            key={invoice.uuid}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                p: 2,
                                borderLeft: `4px solid ${theme.palette.primary.main}`,
                                boxShadow: 0,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    #{invoice.invoice_number}
                                </Typography>
                                {getStatusChip(invoice.status)}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <strong>Customer:</strong> {customersFullName(invoice.customer)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <strong>Issued:</strong> {new Date(invoice.issue_date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <strong>Due:</strong> {new Date(invoice.due_date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>Amount:</strong> ${Number(invoice.total).toFixed(2)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Invoice">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleViewInvoice(invoice)}
                                    >
                                        <VisibilityIcon fontSize='small' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download PDF">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDownloadPdf(invoice)}
                                    >
                                        <GetAppIcon fontSize='small' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Paper>
                    ))
                ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No invoices found matching your search criteria.
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    )
}

export default InvoicesTable;
