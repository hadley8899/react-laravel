import React, {useEffect, useState} from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    Container, Paper, Box, CircularProgress, Alert, Table,
    TableHead, TableRow, TableCell, TableBody, TablePagination, Chip,
    IconButton, Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';

import {
    getCustomerImports,
    downloadImportFailures,
    CustomerImport,
} from '../services/CustomerImportService';
import {useNotifier} from '../context/NotificationContext';

function statusColor(s: CustomerImport['status']) {
    return (
        s === 'finished' ? 'success' :
            s === 'failed' ? 'error' :
                s === 'processing' ? 'warning' : 'default'
    ) as 'success' | 'error' | 'warning' | 'default';
}

const ImportJobs: React.FC = () => {
    const {showNotification} = useNotifier();
    const [rows, setRows] = useState<CustomerImport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rpp, setRpp] = useState(25);
    const [total, setTotal] = useState(0);

    const load = async (shLoading = true) => {
        if (shLoading) setLoading(true);
        setError(null);
        try {
            const res = await getCustomerImports(page + 1, rpp);
            setRows(res.data);
            setTotal(res.meta.total);
        } catch (e: any) {
            setError(e.message ?? 'Unable to load import jobs');
        } finally {
            if (shLoading) setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [page, rpp]);

    const dlFailures = async (uuid: string) => {
        try {
            const blob = await downloadImportFailures(uuid);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `import_failures_${uuid}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            showNotification('Could not download failures', 'error');
        }
    };

    return (
        <MainLayout title="Import Jobs">
            <Container maxWidth="lg" sx={{py: 4}}>
                <Paper sx={{p: {xs: 2, sm: 3}, borderRadius: 3}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                        <Box component="span"/>
                        <IconButton onClick={() => load()}>
                            <RefreshIcon/>
                        </IconButton>
                    </Box>

                    {loading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
                            <CircularProgress/>
                        </Box>
                    )}

                    {error && !loading && (
                        <Alert severity="error" sx={{my: 4}}>{error}</Alert>
                    )}

                    {!loading && !error && (
                        <>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>File</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Imported / Total</TableCell>
                                        <TableCell align="right">Failed</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(r => (
                                        <TableRow key={r.uuid} hover>
                                            <TableCell>{r.filename}</TableCell>
                                            <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Chip label={r.status} size="small" color={statusColor(r.status)}/>
                                            </TableCell>
                                            <TableCell align="right">
                                                {r.imported_rows} / {r.total_rows}
                                            </TableCell>
                                            <TableCell align="right">{r.failed_rows}</TableCell>
                                            <TableCell align="center">
                                                {r.failed_rows > 0 && (
                                                    <Tooltip title="Download failures CSV">
                                                        <IconButton size="small" onClick={() => dlFailures(r.uuid)}>
                                                            <DownloadIcon fontSize="small"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={(_, p) => setPage(p)}
                                rowsPerPage={rpp}
                                onRowsPerPageChange={e => {
                                    setRpp(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default ImportJobs;
