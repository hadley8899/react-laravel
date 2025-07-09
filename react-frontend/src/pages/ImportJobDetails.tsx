import React, {useEffect, useState, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import {
    Container,
    Paper,
    Box,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import {getCustomerImport, downloadImportFailures} from "../services/CustomerImportService";
import {CustomerImport} from "../interfaces/CustomerImport";
import {useNotifier} from "../context/NotificationContext";

function statusColor(s: CustomerImport['status']) {
    return (
        s === 'finished' ? 'success' :
            s === 'failed' ? 'error' :
                s === 'processing' ? 'warning' : 'default'
    ) as 'success' | 'error' | 'warning' | 'default';
}

const ImportJobDetails: React.FC = () => {
    const {uuid} = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const {showNotification} = useNotifier();
    const [data, setData] = useState<CustomerImport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!uuid) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getCustomerImport(uuid);
            setData(res);
        } catch (e: any) {
            setError(e.message ?? "Unable to load import job");
        } finally {
            setLoading(false);
        }
    }, [uuid]);

    useEffect(() => {
        load();
    }, [load]);

    const dlFailures = async () => {
        if (!data) return;
        try {
            const blob = await downloadImportFailures(data.uuid);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `import_failures_${data.uuid}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            showNotification('Could not download failures', 'error');
        }
    };

    return (
        <MainLayout title="Import Job Details">
            <Container maxWidth="sm" sx={{py: 4}}>
                <Paper sx={{p: {xs: 2, sm: 3}, borderRadius: 3}}>
                    <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                        <Tooltip title="Back to Import Jobs">
                            <IconButton onClick={() => navigate(-1)} size="small" sx={{mr: 1}}>
                                <ArrowBackIcon/>
                            </IconButton>
                        </Tooltip>
                        <Typography variant="h6" fontWeight={600} flex={1}>
                            Import Job Details
                        </Typography>
                        <IconButton onClick={load}>
                            <RefreshIcon/>
                        </IconButton>
                    </Box>

                    {loading && (
                        <Box sx={{display: "flex", justifyContent: "center", my: 4}}>
                            <CircularProgress/>
                        </Box>
                    )}

                    {error && !loading && (
                        <Alert severity="error" sx={{my: 4}}>
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && data && (
                        <Box>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant="head">File</TableCell>
                                        <TableCell>{data.filename}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head">Status</TableCell>
                                        <TableCell>
                                            <Chip label={data.status} color={statusColor(data.status)} size="small"/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head">Created</TableCell>
                                        <TableCell>{new Date(data.created_at).toLocaleString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head">Started</TableCell>
                                        <TableCell>
                                            {data.started_at ? new Date(data.started_at).toLocaleString() : <em>—</em>}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head">Finished</TableCell>
                                        <TableCell>
                                            {data.finished_at ? new Date(data.finished_at).toLocaleString() :
                                                <em>—</em>}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head">Imported / Total</TableCell>
                                        <TableCell>
                                            {data.imported_rows} / {data.total_rows}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head">Failed</TableCell>
                                        <TableCell>
                                            {data.failed_rows}
                                            {data.failed_rows > 0 && (
                                                <Button
                                                    size="small"
                                                    startIcon={<DownloadIcon/>}
                                                    sx={{ml: 2}}
                                                    onClick={dlFailures}
                                                >
                                                    Download Failures
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    {data.meta && Object.keys(data.meta).length > 0 && (
                                        <TableRow>
                                            <TableCell variant="head" colSpan={2}>
                                                <Box sx={{mt: 2}}>
                                                    <Typography variant="subtitle2" sx={{mb: 1}}>
                                                        Additional Details
                                                    </Typography>
                                                    <Table size="small">
                                                        <TableBody>
                                                            {Object.entries(data.meta).map(([key, value]) => (
                                                                <TableRow key={key}>
                                                                    <TableCell variant="head"
                                                                               sx={{width: 160}}>{key}</TableCell>
                                                                    <TableCell>
                                                                        {typeof value === 'object' && value !== null
                                                                            ? <pre style={{
                                                                                margin: 0,
                                                                                fontSize: 13
                                                                            }}>{JSON.stringify(value, null, 2)}</pre>
                                                                            : String(value)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default ImportJobDetails;