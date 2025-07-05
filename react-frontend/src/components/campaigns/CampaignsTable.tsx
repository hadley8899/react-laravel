import React from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    TableContainer, CircularProgress, Alert, TablePagination,
    Box, Chip, Paper, Typography, IconButton, Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Campaign } from '../../interfaces/Campaign';

interface Props {
    campaigns: Campaign[];
    loading: boolean;
    error: string | null;
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const statusColor: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    queued:    'warning',
    scheduled: 'info',
    sending:   'info',
    sent:      'success',
    failed:    'error',
};

const fmt = (dt?: string | null) =>
    dt ? dayjs(dt).format('DD MMM YYYY HH:mm') : '—';

/* ────────────────────────────────────────────────────────── */

const CampaignsTable: React.FC<Props> = ({
                                             campaigns,
                                             loading,
                                             error,
                                             page,
                                             rowsPerPage,
                                             total,
                                             onPageChange,
                                             onRowsPerPageChange,
                                         }) => {
    /* busy / error */
    if (loading)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    if (error) return <Alert severity="error">{error}</Alert>;

    /* ---------------------------------------------------------------- */

    return (
        <>
            {/* ───────── Desktop table ───────── */}
            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                <Table>
                    <TableHead sx={{ backgroundColor: t => t.palette.action.hover }}>
                        <TableRow>
                            <TableCell><strong>Subject</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Scheduled</strong></TableCell>
                            <TableCell><strong>Sent</strong></TableCell>
                            <TableCell align="right"><strong>Recipients</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map(c => (
                            <TableRow key={c.uuid} hover>
                                <TableCell sx={{ fontWeight: 500 }}>{c.subject}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={c.status}
                                        size="small"
                                        color={statusColor[c.status.toLowerCase()] ?? 'default'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{fmt(c.scheduled_at)}</TableCell>
                                <TableCell>{fmt(c.sent_at)}</TableCell>
                                <TableCell align="right">{c.total_contacts}</TableCell>

                                {/* actions */}
                                <TableCell align="center">
                                    <Tooltip title="View">
                                        <IconButton
                                            size="small"
                                            component={RouterLink}
                                            to={`/campaigns/${c.uuid}`}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ───────── Mobile cards ───────── */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {campaigns.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No campaigns found.</Typography>
                    </Box>
                ) : (
                    campaigns.map(c => (
                        <Paper
                            key={c.uuid}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                p: 2,
                                borderLeft: t => `4px solid ${t.palette.primary.main}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: .5 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {c.subject}
                                </Typography>

                                <Tooltip title="View">
                                    <IconButton
                                        size="small"
                                        component={RouterLink}
                                        to={`/campaigns/${c.uuid}`}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Typography variant="body2" sx={{ mb: .5 }}>
                                <strong>Status:</strong>{' '}
                                <Chip
                                    label={c.status}
                                    size="small"
                                    color={statusColor[c.status.toLowerCase()] ?? 'default'}
                                    variant="outlined"
                                    sx={{ verticalAlign: 'middle' }}
                                />
                            </Typography>

                            <Typography variant="body2" sx={{ mb: .5 }}>
                                <strong>Scheduled:</strong> {fmt(c.scheduled_at)}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: .5 }}>
                                <strong>Sent:</strong> {fmt(c.sent_at)}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Recipients:</strong> {c.total_contacts}
                            </Typography>
                        </Paper>
                    ))
                )}
            </Box>

            {/* ───────── Pagination ───────── */}
            <Box sx={{ px: 2, pb: 2 }}>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            </Box>
        </>
    );
};

export default CampaignsTable;
