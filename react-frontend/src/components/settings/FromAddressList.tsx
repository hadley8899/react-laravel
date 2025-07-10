import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    TextField,
    CircularProgress,
    Typography,
    Tooltip,
    InputAdornment,
    Alert,
    Paper,
    Divider,
    Grid,
    useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EmailIcon from '@mui/icons-material/Email';
import { createFromAddress, getFromAddresses } from '../../services/FromAddressService';
import { useNotifier } from '../../context/NotificationContext';

interface Row {
    uuid: string;
    email: string;
    verified: boolean;
}

const FromAddressList: React.FC<{ domainUuid: string }> = ({ domainUuid }) => {
    const theme = useTheme();
    const { showNotification } = useNotifier();
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [newLocal, setNewLocal] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const [domain, setDomain] = useState('');

    /* ---------- load ---------- */
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getFromAddresses(domainUuid);
                setRows(data);
                if (data.length > 0) {
                    // Extract domain from email for display
                    const emailParts = data[0].email.split('@');
                    if (emailParts.length > 1) {
                        setDomain('@' + emailParts[1]);
                    }
                }
            } catch {
                showNotification('Failed to load from-addresses', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [domainUuid]);

    /* ---------- validate ---------- */
    const validateLocalPart = (value: string) => {
        if (!value.trim()) {
            setError('Email address is required');
            return false;
        }

        // Same regex as backend: /^[a-z0-9._%+-]+$/i
        const regex = /^[a-z0-9._%+-]+$/i;
        if (!regex.test(value)) {
            setError('Only letters, numbers, and these special characters are allowed: . _ % + -');
            return false;
        }

        setError('');
        return true;
    };

    /* ---------- add ---------- */
    const add = async () => {
        if (!validateLocalPart(newLocal)) return;

        setAdding(true);
        try {
            const fa = await createFromAddress(domainUuid, newLocal.trim());
            setRows((prev) => [...prev, fa]);
            setNewLocal('');
            showNotification('From address added successfully', 'success');
        } catch (e: any) {
            const message = e?.response?.data?.message || 'Failed to add address';
            showNotification(message, 'error');
        } finally {
            setAdding(false);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa'
                }}
            >
                <Typography variant="subtitle2" gutterBottom>
                    Create email addresses for sending
                </Typography>
                <Typography variant="body2" sx={{mb: 2}}>
                    These addresses will appear in the "From" field of your emails. Create addresses like
                    <b> newsletter</b>, <b>support</b>, or <b>no-reply</b>.
                </Typography>

                <Divider sx={{mb: 2}}/>

                <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{xs: 12, sm: 9, md: 9}}>
                        <TextField
                            fullWidth
                            label="Email address"
                            placeholder="e.g. newsletter"
                            value={newLocal}
                            onChange={(e) => {
                                setNewLocal(e.target.value);
                                if (error) validateLocalPart(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !error && newLocal.trim()) {
                                    add();
                                }
                            }}
                            onBlur={() => validateLocalPart(newLocal)}
                            error={!!error}
                            helperText={error || "This will be the local part of your email address"}
                            disabled={adding}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: 40
                                },
                                '& .MuiInputLabel-root': {
                                    transform: 'translate(14px, 9px) scale(1)'
                                },
                                '& .MuiInputLabel-shrink': {
                                    transform: 'translate(14px, -9px) scale(0.75)'
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action"/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: domain ? (
                                        <InputAdornment position="end">
                                            <Typography color="text.secondary">{domain}</Typography>
                                        </InputAdornment>
                                    ) : null
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 3, md: 3}} sx={{mt: error ? '24px' : '0px'}}>
                        <Button
                            variant="contained"
                            startIcon={adding ? <CircularProgress size={16}/> : <AddIcon/>}
                            onClick={add}
                            disabled={adding || !!error}
                            fullWidth
                            sx={{height: 40}}
                        >
                            Add Address
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Typography variant="subtitle2" gutterBottom>
                Your email addresses
            </Typography>
            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', my: 2}}>
                    <CircularProgress size={20}/>
                </Box>
            ) : rows.length === 0 ? (
                <Alert severity="info">
                    No addresses yet. Add your first email address above.
                </Alert>
            ) : (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                    {rows.map((r) => (
                        <Tooltip
                            key={r.uuid}
                            title={r.verified ? 'Verified – ready to use' : 'Domain pending – verify DNS first'}
                        >
                            <Chip
                                icon={r.verified ? <CheckCircleIcon fontSize="small"/> :
                                    <ErrorOutlineIcon fontSize="small"/>}
                                label={r.email}
                                color={r.verified ? 'success' : 'warning'}
                                sx={{mb: 0.5}}
                            />
                        </Tooltip>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default FromAddressList;
