import React, {useEffect, useState} from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    Box, Container, Paper, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions,
} from '@mui/material';
import {
    getCustomVariables,
    createCustomVariable,
    updateCustomVariable,
    deleteCustomVariable,
} from '../services/ContactCustomVariableService';
import {ContactCustomVariable} from '../interfaces/ContactCustomVariable';
import CustomVariableTable from '../components/customVariable/CustomVariableTable';
import CustomVariableFormDialog from '../components/customVariable/CustomVariableFormDialog';
import {useNotifier} from '../context/NotificationContext';

const ContactCustomVariables: React.FC = () => {
    const [vars, setVars] = useState<ContactCustomVariable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formOpen, setFormOpen] = useState(false);
    const [editingVar, setEditingVar] = useState<ContactCustomVariable | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [varToDelete, setVarToDelete] = useState<ContactCustomVariable | null>(null);

    const {showNotification} = useNotifier();

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCustomVariables();
            setVars(data);
        } catch (e: any) {
            setError(e?.message ?? 'Failed to load fields');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ---------- CRUD helpers ---------- */
    const handleSave = async (payload: Partial<ContactCustomVariable>) => {
        if (editingVar) {
            await updateCustomVariable(editingVar.uuid, payload);
        } else {
            await createCustomVariable(payload as any);
        }
        await fetchData();
    };

    const openNewDialog = () => {
        setEditingVar(null);
        setFormOpen(true);
    };

    const openEditDialog = (v: ContactCustomVariable) => {
        setEditingVar(v);
        setFormOpen(true);
    };

    const openDeleteDialog = (v: ContactCustomVariable) => {
        setVarToDelete(v);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!varToDelete) return;
        try {
            await deleteCustomVariable(varToDelete.uuid);
            showNotification('Field deleted.');
            await fetchData();
        } catch (e: any) {
            showNotification(e?.message ?? 'Failed to delete field', 'error');
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    return (
        <MainLayout title="Contact Fields">
            <Container maxWidth="md" sx={{py: 4}}>
                <Paper sx={{p: 3, borderRadius: 3}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                        <Box component="h2" sx={{m: 0, fontSize: '1.3rem'}}>Contact Custom Fields</Box>
                        <Button variant="contained" onClick={openNewDialog}>New Field</Button>
                    </Box>

                    {loading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
                            <CircularProgress/>
                        </Box>
                    )}

                    {error && !loading && <Alert severity="error">{error}</Alert>}

                    {!loading && !error && (
                        <CustomVariableTable variables={vars} onEdit={openEditDialog} onDelete={openDeleteDialog}/>
                    )}
                </Paper>
            </Container>

            <CustomVariableFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSave={handleSave}
                editingVar={editingVar}
            />

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Field</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Delete <strong>{varToDelete?.friendly_name}</strong>? This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default ContactCustomVariables;
