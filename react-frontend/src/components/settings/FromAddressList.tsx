import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    TextField,
    CircularProgress,
    Typography,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { createFromAddress, getFromAddresses } from '../../services/FromAddressService';
import { useNotifier } from '../../context/NotificationContext';

interface Row {
    uuid: string;
    email: string;
    verified: boolean;
}

const FromAddressList: React.FC<{ domainUuid: string }> = ({ domainUuid }) => {
    const { showNotification } = useNotifier();
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [newLocal, setNewLocal] = useState('');

    /* ---------- load ---------- */
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getFromAddresses(domainUuid);
                setRows(data);
            } catch {
                showNotification('Failed to load from-addresses', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [domainUuid]);

    /* ---------- add ---------- */
    const add = async () => {
        if (!newLocal.trim()) return;
        try {
            const fa = await createFromAddress(domainUuid, newLocal.trim());
            setRows((prev) => [...prev, fa]);
            setNewLocal('');
            showNotification('From address added', 'success');
        } catch {
            showNotification('Failed to add', 'error');
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Create the mailbox name you’d like to show in the&nbsp;
                <code>From:</code> field <em>(e.g.&nbsp;<b>marketing</b>@domain)</em>.
            </Typography>

            {loading ? (
                <CircularProgress size={20} />
            ) : rows.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No addresses yet.
                </Typography>
            ) : (
                rows.map((r) => (
                    <Tooltip
                        key={r.uuid}
                        title={r.verified ? 'Verified – ready to use' : 'Domain pending – verify DNS first'}
                    >
                        <Chip
                            icon={r.verified ? <CheckCircleIcon fontSize="small" /> : <ErrorOutlineIcon fontSize="small" />}
                            label={r.email}
                            color={r.verified ? 'success' : 'warning'}
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    </Tooltip>
                ))
            )}

            <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                <TextField
                    size="small"
                    label="local part"
                    helperText="only letters, numbers, . _ % + -"
                    value={newLocal}
                    onChange={(e) => setNewLocal(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={add}>
                    Add
                </Button>
            </Box>
        </Box>
    );
};

export default FromAddressList;
