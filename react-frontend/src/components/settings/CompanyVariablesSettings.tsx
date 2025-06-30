import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

import SettingsAccordionItem from '../layout/SettingsAccordionItem.tsx';
import {useNotifier} from '../../context/NotificationContext.tsx';
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
import VariableTable from "./company-variable-settings/VariableTable.tsx";
import VariableCreateEditDialog from "./company-variable-settings/VariableCreateEditDialog.tsx";

const EMPTY_PAYLOAD: CreateCompanyVariablePayload = {
    key: '',
    value: '',
    friendly_name: '',
    type: '',
    meta: {},
};

type DialogMode = 'create' | 'edit';

const CompanyVariablesSettings: React.FC = () => {
    const {showNotification} = useNotifier();

    const [variables, setVariables] = useState<CompanyVariable[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<DialogMode>('create');
    const [payload, setPayload] = useState<CreateCompanyVariablePayload>(EMPTY_PAYLOAD);
    const [editingUuid, setEditingUuid] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchVariables = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const list = await getCompanyVariables();

            console.log(list);

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
            value: variable.type === 'image' ? (variable.url ?? '') : variable.value,
            friendly_name: variable.friendly_name ?? '',
            type: variable.type ?? '',
            meta: {
                ...variable.meta,
                ...(variable.type === 'image' && variable.url ? { url: variable.url } : {}),
            },
        });
        setDialogOpen(true);
    };

    const closeDialog = () => {
        if (!isSaving) setDialogOpen(false);
    };

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

    return (
        <SettingsAccordionItem
            title="Company Variables"
            icon={<TuneIcon/>}
            isLoading={false}
            error={error}
        >
            {isLoading ? (
                <Box sx={{display: 'flex', alignItems: 'center', py: 3}}>
                    <CircularProgress size={20} sx={{mr: 2}}/>
                    <Typography>Loading variables…</Typography>
                </Box>
            ) : (
                <>
                    {variables.length === 0 && (
                        <Alert severity="info" sx={{mb: 2}}>
                            No variables yet. Click “Add Variable” to create your first one.
                        </Alert>
                    )}
                    <VariableTable
                        variables={variables}
                        openCreateDialog={openCreateDialog}
                        openEditDialog={openEditDialog}
                        handleDelete={handleDelete}
                    />
                </>
            )}

            <VariableCreateEditDialog
                dialogOpen={dialogOpen}
                closeDialog={closeDialog}
                dialogMode={dialogMode}
                payload={payload}
                setPayload={setPayload}
                handleSave={handleSave}
                isSaving={isSaving}

            />
        </SettingsAccordionItem>
    );
};

export default CompanyVariablesSettings;
