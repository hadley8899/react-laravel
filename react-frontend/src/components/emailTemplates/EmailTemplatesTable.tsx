import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Paper,
    TablePagination,
    Box,
    Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { EmailTemplate } from '../../interfaces/EmailTemplate';

interface Props {
    templates: EmailTemplate[];
    selected: string[];
    loading: boolean;
    error: string | null;
    page: number;
    rowsPerPage: number;
    total: number;
    onRowClick: (uuid: string) => void;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: (tpl: EmailTemplate) => void;
}

const EmailTemplatesTable: React.FC<Props> = ({
                                                  templates,
                                                  selected,
                                                  loading,
                                                  error,
                                                  page,
                                                  rowsPerPage,
                                                  total,
                                                  onRowClick,
                                                  onSelectAll,
                                                  onPageChange,
                                                  onRowsPerPageChange,
                                                  onDelete,
                                              }) => {
    const isSelected = (uuid: string) => selected.includes(uuid);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;

    const empty = templates.length === 0;

    return (
        <TableContainer component={Paper} variant="outlined">
            {empty ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No templates found.</Typography>
                </Box>
            ) : (
                <>
                    <Table>
                        <TableHead sx={{ backgroundColor: t => t.palette.action.hover }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < templates.length}
                                        checked={templates.length > 0 && selected.length === templates.length}
                                        onChange={onSelectAll}
                                    />
                                </TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Subject</strong></TableCell>
                                <TableCell><strong>Preview Text</strong></TableCell>
                                <TableCell><strong>Updated</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {templates.map(tpl => {
                                const sel = isSelected(tpl.uuid);
                                return (
                                    <TableRow
                                        hover
                                        key={tpl.uuid}
                                        selected={sel}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox" onClick={() => onRowClick(tpl.uuid)}>
                                            <Checkbox checked={sel} />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }} onClick={() => onRowClick(tpl.uuid)}>
                                            {tpl.name}
                                        </TableCell>
                                        <TableCell onClick={() => onRowClick(tpl.uuid)}>
                                            {tpl.subject ?? '—'}
                                        </TableCell>
                                        <TableCell onClick={() => onRowClick(tpl.uuid)}>
                                            {tpl.preview_text ?? '—'}
                                        </TableCell>
                                        <TableCell onClick={() => onRowClick(tpl.uuid)}>
                                            {new Date(tpl.updated_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Preview">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => window.open(`/templates/${tpl.uuid}/preview`, '_blank')}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        onDelete(tpl);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    <Box sx={{ px: 2, pb: 2 }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onPageChange}
                            onRowsPerPageChange={onRowsPerPageChange}
                        />
                    </Box>
                </>
            )}
        </TableContainer>
    );
};

export default EmailTemplatesTable;
