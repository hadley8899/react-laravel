import React from 'react';
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip, Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {DnsRecord} from '../../interfaces/DnsRecord';
import {useNotifier} from '../../context/NotificationContext';

interface Props {
    records: DnsRecord[];
}

const SendingDomainRecords: React.FC<Props> = ({records}) => {
    const {showNotification} = useNotifier();

    function copy(text: string) {
        navigator.clipboard.writeText(text).then(() => {
        });
        showNotification('Copied!', 'success');
    }

    console.log('records', records);

    if (records === null || records.length === 0) {
        return (
            <Box sx={{p: 2, textAlign: 'center'}}>
                <Typography variant="body2" color="textSecondary">
                    No DNS records found. Please add the required records to your DNS provider.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{overflowX: 'auto', mb: 2}}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell align="center">Valid</TableCell>
                        <TableCell align="center">Copy</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((r, i) => {
                        return (
                            <TableRow key={i}>
                                <TableCell>{r?.type}</TableCell>
                                <TableCell>{r?.name ?? ' '}</TableCell>
                                <TableCell sx={{wordBreak: 'break-all'}}>{r.value}</TableCell>
                                <TableCell align="center">
                                    {r?.valid ? (
                                        <CheckCircleIcon color="success" fontSize="small"/>
                                    ) : (
                                        <ErrorOutlineIcon color="warning" fontSize="small"/>
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
    );
};

export default SendingDomainRecords;
