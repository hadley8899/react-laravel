import React from 'react';
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Paper,
    Alert,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {DnsRecord} from '../../interfaces/DnsRecord';
import {useNotifier} from '../../context/NotificationContext';

interface Props {
    records: DnsRecord[];
}

const SendingDomainRecords: React.FC<Props> = ({records}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {showNotification} = useNotifier();

    function copy(text: string) {
        navigator.clipboard.writeText(text).then(() => {
        });
        showNotification('Copied to clipboard!', 'success');
    }

    if (records === null || records.length === 0) {
        return (
            <Alert severity="warning" sx={{mt: 2}}>
                No DNS records found. Please refresh the page or contact support.
            </Alert>
        );
    }

    // Count how many records are valid
    const validCount = records.filter(r => r.valid).length;
    const totalCount = records.length;

    return (
        <Box>
            {validCount < totalCount && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 203, 107, 0.1)' : '#fff4e5'
                    }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        DNS Setup Instructions
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        1. Log in to your domain registrar or DNS provider
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        2. Add each record below exactly as shown
                    </Typography>
                    <Typography variant="body2">
                        3. Click "Check DNS" once all records are added (may take 24-48 hours to propagate)
                    </Typography>
                </Paper>
            )}

            {validCount > 0 && validCount < totalCount && (
                <Alert severity="info" sx={{mb: 2}}>
                    {validCount} of {totalCount} records verified. All records must be verified for the domain to be
                    active.
                </Alert>
            )}

            {validCount === totalCount && (
                <Alert severity="success" sx={{mb: 2}}>
                    All DNS records verified successfully! Your domain is ready to use.
                </Alert>
            )}

            <Box sx={{overflowX: 'auto', mb: 2}}>
                <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f5f5f5'
                        }}>
                            <TableCell width={isMobile ? "15%" : "10%"}>Type</TableCell>
                            <TableCell width={isMobile ? "25%" : "20%"}>Name</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell align="center" width="10%">
                                Status
                                <Tooltip title="DNS records can take 24-48 hours to propagate">
                                    <IconButton size="small">
                                        <HelpOutlineIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="center" width="10%">Copy</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((r, i) => {
                            return (
                                <TableRow key={i} sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.03)'
                                            : '#fafafa'
                                    }
                                }}>
                                    <TableCell><strong>{r?.type}</strong></TableCell>
                                    <TableCell>{r?.name ?? ' '}</TableCell>
                                    <TableCell sx={{
                                        wordBreak: 'break-all',
                                        fontFamily: 'monospace',
                                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                                    }}>
                                        {r.value}
                                    </TableCell>
                                    <TableCell align="center">
                                        {r?.valid ? (
                                            <Tooltip title="Verified">
                                                <CheckCircleIcon color="success" fontSize="small"/>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Not verified yet">
                                                <ErrorOutlineIcon color="warning" fontSize="small"/>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Copy value">
                                            <IconButton size="small" onClick={() => copy(r.value)}>
                                                <ContentCopyIcon fontSize="inherit"/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default SendingDomainRecords;
