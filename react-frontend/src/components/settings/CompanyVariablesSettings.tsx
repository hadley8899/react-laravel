import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TuneIcon from '@mui/icons-material/Tune';

import SettingsAccordionItem from '../layout/SettingsAccordionItem.tsx';
import { useNotifier } from '../../context/NotificationContext.tsx';
import {
    CompanyVariable,
    CreateCompanyVariablePayload,
    UpdateCompanyVariablePayload,
} from '../../interfaces/CompanyVariable.ts';
import {
    createCompanyVariable,
    deleteCompanyVariable,
    getCompanyVariables,
    updateCompanyVariable,
} from '../../services/CompanyVariableService.ts';

const EMPTY_PAYLOAD: CreateCompanyVariablePayload = {
    key: '',
    value: '',
    friendly_name: '',
    type: '',
    meta: {},
};

type DialogMode = 'create' | 'edit';

const CompanyVariablesSettings: React.FC = () => {
    /* ------------------------------------------------------------------ */
    /* State & hooks                                                      */
    /* ------------------------------------------------------------------ */
    const { showNotification } = useNotifier();

    const [variables, setVariables] = useState<CompanyVariable[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /* Dialog state */
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<DialogMode>('create');
    const [payload, setPayload] = useState<CreateCompanyVariablePayload>(EMPTY_PAYLOAD);
    const [editingUuid, setEditingUuid] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    /* ------------------------------------------------------------------ */
    /* Data fetching                                                      */
    /* ------------------------------------------------------------------ */
    const fetchVariables = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const list = await getCompanyVariables();
            setVariables(list);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message ?? 'Failed to load variables.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVariables();
    }, []);

    /* ------------------------------------------------------------------ */
    /* Dialog helpers                                                     */
    /* ------------------------------------------------------------------ */
    const openCreateDialog = () => {
        setDialogMode('create');
        setPayload(EMPTY_PAYLOAD);
        setEditingUuid(null);
        setDialogOpen(true);
    };

    const openEditDialog = (variable: CompanyVariable) => {
        setDialogMode('edit');
        setEditingUuid(variable.uuid);
        setPayload({
            key: variable.key,
            value: variable.value,
            friendly_name: variable.friendly_name ?? '',
            type: variable.type ?? '',
            meta: variable.meta ?? {},
        });
        setDialogOpen(true);
    };

    const closeDialog = () => {
        if (!isSaving) setDialogOpen(false);
    };

    /* ------------------------------------------------------------------ */
    /* CRUD actions                                                       */
    /* ------------------------------------------------------------------ */
    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (dialogMode === 'create') {
                const created = await createCompanyVariable(payload);
                setVariables((prev) => [...prev, created]);
                showNotification('Variable created successfully');
            } else if (dialogMode === 'edit' && editingUuid) {
                // Construct payload for update – exclude key so backend rules are happy
                const updatePayload: UpdateCompanyVariablePayload = {
                    friendly_name: payload.friendly_name,
                    value: payload.value,
                    type: payload.type,
                    meta: payload.meta,
                };
                const updated = await updateCompanyVariable(editingUuid, updatePayload);
                setVariables((prev) =>
                    prev.map((v) => (v.uuid === updated.uuid ? updated : v)),
                );
                showNotification('Variable updated successfully');
            }
            setDialogOpen(false);
        } catch (err: any) {
            console.error(err);
            showNotification(
                err?.response?.data?.message ??
                (dialogMode === 'create'
                    ? 'Failed to create variable'
                    : 'Failed to update variable'),
                'error',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (uuid: string, canBeDeleted: boolean) => {
        if (!canBeDeleted) {
            showNotification('This variable cannot be deleted', 'error');
            return;
        }
        if (!confirm('Are you sure you want to delete this variable?')) return;

        try {
            await deleteCompanyVariable(uuid);
            setVariables((prev) => prev.filter((v) => v.uuid !== uuid));
            showNotification('Variable deleted');
        } catch (err: any) {
            console.error(err);
            showNotification(
                err?.response?.data?.message ?? 'Failed to delete variable',
                'error',
            );
        }
    };

    /* ------------------------------------------------------------------ */
    /* Render                                                             */
    /* ------------------------------------------------------------------ */
    return (
        <SettingsAccordionItem
            title="Company Variables"
            icon={<TuneIcon />}
            isLoading={false}
            error={error}
        >
            {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography>Loading variables…</Typography>
                </Box>
            ) : (
                <>
                    {variables.length === 0 && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            No variables yet. Click “Add Variable” to create your first one.
                        </Alert>
                    )}

                    <Paper variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Friendly Name</TableCell>
                                    <TableCell>Key</TableCell>
                                    <TableCell>Value</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="text"
                                            startIcon={<AddCircleOutlineIcon />}
                                            onClick={openCreateDialog}
                                        >
                                            Add Variable
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {variables.map((v) => (
                                    <TableRow key={v.uuid}>
                                        <TableCell>{v.friendly_name}</TableCell>
                                        <TableCell>
                                            <code>{`{{${v.key}}}`}</code>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 250, wordBreak: 'break-all' }}>
                                            {v.value}
                                        </TableCell>
                                        <TableCell>{v.type}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => openEditDialog(v)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(v.uuid, v.can_be_deleted)}
                                                disabled={!v.can_be_deleted}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </>
            )}

            {/* ---------------- Create / Edit Dialog ---------------- */}
            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {dialogMode === 'create' ? 'Add Company Variable' : 'Edit Company Variable'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Friendly Name"
                                    fullWidth
                                    value={payload.friendly_name}
                                    onChange={(e) =>
                                        setPayload({ ...payload, friendly_name: e.target.value })
                                    }
                                    slotProps={{}}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Key"
                                    fullWidth
                                    helperText="UPPER_SNAKE_CASE – used in templates like {{KEY}}"
                                    value={payload.key}
                                    onChange={(e) =>
                                        setPayload({ ...payload, key: e.target.value.toUpperCase() })
                                    }
                                    disabled={dialogMode === 'edit'}
                                    slotProps={{}}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Value"
                                    fullWidth
                                    value={payload.value}
                                    onChange={(e) =>
                                        setPayload({ ...payload, value: e.target.value })
                                    }
                                    slotProps={{}}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    select
                                    label="Type"
                                    fullWidth
                                    value={payload.type ?? ''}
                                    onChange={(e) =>
                                        setPayload({ ...payload, type: e.target.value })
                                    }
                                    slotProps={{}}
                                >
                                    <MenuItem value="">(none)</MenuItem>
                                    <MenuItem value="text">Text</MenuItem>
                                    <MenuItem value="color">Color</MenuItem>
                                    <MenuItem value="url">URL</MenuItem>
                                    <MenuItem value="image">Image URL</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSaving}
                        startIcon={isSaving && <CircularProgress size={16} />}
                    >
                        {isSaving ? 'Saving…' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </SettingsAccordionItem>
    );
};

export default CompanyVariablesSettings;
