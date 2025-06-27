import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {EmailTemplate} from '../interfaces/EmailTemplate';
import {useNotifier} from '../context/NotificationContext';
import {deleteTemplate, getTemplates} from '../services/EmailTemplateService';
import EmailTemplatesTopBar from '../components/email-templates/EmailTemplatesTopBar';
import EmailTemplatesTable from '../components/email-templates/EmailTemplatesTable';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';

const EmailTemplatesPage: React.FC = () => {
    const navigate = useNavigate();
    const {showNotification} = useNotifier();

    /* ---------------- state ---------------- */
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    /* delete-dialog */
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [toDeleteUuids, setToDeleteUuids] = useState<string[]>([]);

    /* ---------------- fetch list ---------------- */
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getTemplates({
                page: page + 1,
                per_page: rowsPerPage,
                search: search || undefined,
            });

            setTemplates(res.data);
            setTotal(res.meta.total);
            setPage(res.meta.current_page - 1);
            setError(null);
        } catch {
            setError('Could not load templates');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    /* ---------------- helpers ---------------- */
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSelected(e.target.checked ? templates.map(t => t.uuid) : []);

    const openDeleteDialog = (uuids: string[]) => {
        setToDeleteUuids(uuids);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        setPending(true);
        try {
            await Promise.all(toDeleteUuids.map(uuid => deleteTemplate(uuid)));
            showNotification(
                `${toDeleteUuids.length} template${toDeleteUuids.length === 1 ? '' : 's'} deleted`
            );
            setSelected([]);
            await fetch();
        } catch {
            showNotification('Delete failed', 'error');
        } finally {
            setPending(false);
            setConfirmOpen(false);
        }
    };

    /* ---------------- render ---------------- */
    return (
        <MainLayout>
            <EmailTemplatesTopBar
                searchInput={search}
                onSearchChange={e => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
                onAdd={() => navigate('/editor')}
                onRefresh={fetch}
                selectedCount={selected.length}
                onDeleteSelected={() => {
                    const uuids = templates
                        .filter(t => selected.includes(t.uuid))
                        .map(t => t.uuid);
                    openDeleteDialog(uuids);
                }}
            />

            <EmailTemplatesTable
                templates={templates}
                selected={selected}
                loading={loading}
                error={error}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                onRowClick={id =>
                    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
                }
                onSelectAll={handleSelectAll}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={e => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                onDelete={tpl => openDeleteDialog([tpl.uuid])}
            />

            {/* confirmation dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Delete {toDeleteUuids.length} template
                        {toDeleteUuids.length === 1 ? '' : 's'}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        onClick={confirmDelete}
                        disabled={pending}
                        autoFocus
                    >
                        {pending ? <CircularProgress size={24}/> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default EmailTemplatesPage;
