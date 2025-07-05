import React, {useEffect, useState} from 'react';
import {
    Box,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsAccordionItem from '../layout/SettingsAccordionItem';
import {useNotifier} from '../../context/NotificationContext';
import {
    getSendingDomains,
    createSendingDomain,
} from '../../services/SendingDomainService';
import {SendingDomain} from '../../interfaces/SendingDomain';
import SendingDomainItem from './SendingDomainItem';

const SendingDomainsSettings: React.FC = () => {
    const {showNotification} = useNotifier();

    const [domains, setDomains] = useState<SendingDomain[]>([]);
    const [loading, setLoading] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [adding, setAdding] = useState(false);
    const [expandedDomain, setExpandedDomain] = useState<string | false>(false);

    const fetchDomains = async () => {
        setLoading(true);
        try {
            const data = await getSendingDomains();
            setDomains(data);
            // If the expanded domain was removed, collapse
            if (expandedDomain && !data.some(d => d.uuid === expandedDomain)) {
                setExpandedDomain(false);
            }
        } catch {
            showNotification('Failed to load sending domains', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    /* -------- add ---------- */
    const handleAdd = async () => {
        if (!newDomain.trim()) return;
        setAdding(true);
        try {
            await createSendingDomain(newDomain.trim());
            setNewDomain('');
            fetchDomains();
            showNotification('Domain added – add the DNS records shown below.', 'success');
        } catch (e: any) {
            showNotification(e?.response?.data?.message ?? 'Failed to add domain', 'error');
        } finally {
            setAdding(false);
        }
    };

    return (
        <SettingsAccordionItem title="Domain Settings" icon={<LanguageIcon/>} isLoading={false}>
            {/* Add domain */}
            <Box sx={{mb: 3}}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{xs: 12, md: 5}}>
                        <TextField
                            fullWidth
                            label="New domain (e.g. news.example.com)"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <Button
                            startIcon={<AddIcon/>}
                            variant="contained"
                            onClick={handleAdd}
                            disabled={adding}
                            fullWidth
                        >
                            {adding ? <CircularProgress size={24}/> : 'Add Domain'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {loading ? (
                <CircularProgress/>
            ) : domains.length === 0 ? (
                <Typography variant="body2">No domains yet.</Typography>
            ) : (
                domains.map((domain) => (
                    <SendingDomainItem
                        key={domain.uuid}
                        domain={domain}
                        onRefresh={fetchDomains}
                        expanded={expandedDomain === domain.uuid}
                        onChange={(_event, isExpanded) => setExpandedDomain(isExpanded ? domain.uuid : false)}
                    />
                ))
            )}
        </SettingsAccordionItem>
    );
};

export default SendingDomainsSettings;
