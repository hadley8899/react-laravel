import React, {useEffect, useState} from 'react';
import {
    Box,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Typography,
    Alert,
    Paper,
    Stepper,
    Step,
    StepLabel,
    useTheme,
    useMediaQuery,
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {showNotification} = useNotifier();

    const [domains, setDomains] = useState<SendingDomain[]>([]);
    const [loading, setLoading] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [adding, setAdding] = useState(false);
    const [expandedDomain, setExpandedDomain] = useState<string | false>(false);
    const [domainError, setDomainError] = useState('');

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

    // Validate domain format
    const validateDomain = (domain: string) => {
        if (!domain.trim()) {
            setDomainError('Domain is required');
            return false;
        }

        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        if (!domainRegex.test(domain)) {
            setDomainError('Please enter a valid domain (e.g. news.example.com)');
            return false;
        }

        setDomainError('');
        return true;
    };

    /* -------- add ---------- */
    const handleAdd = async () => {
        if (!validateDomain(newDomain)) return;

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
            {/* Setup guide */}
            <Paper
                elevation={0}
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa'
                }}
            >
                <Typography variant="h6" gutterBottom>
                    How to set up sender domains
                </Typography>

                <Stepper
                    activeStep={-1}
                    orientation={isMobile ? "vertical" : "vertical"}
                    sx={{
                        mb: 2,
                        '& .MuiStepLabel-label': {
                            color: theme.palette.text.primary,
                        },
                    }}
                >
                    <Step>
                        <StepLabel>Add your domain (e.g., news.example.com)</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Add the required DNS records to your domain</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Verify DNS settings</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Create "From" email addresses for sending</StepLabel>
                    </Step>
                </Stepper>

                <Alert severity="info" sx={{mb: 1}}>
                    You'll need access to your domain's DNS settings to complete this process.
                </Alert>
            </Paper>

            {/* Add domain */}
            <Box sx={{mb: 3}}>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{xs: 12, sm: 9, md: 9}}>
                        <TextField
                            fullWidth
                            label="New domain"
                            placeholder="e.g. news.example.com"
                            value={newDomain}
                            onChange={(e) => {
                                setNewDomain(e.target.value);
                                if (domainError) validateDomain(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !domainError && newDomain.trim()) {
                                    handleAdd();
                                }
                            }}
                            onBlur={() => validateDomain(newDomain)}
                            error={!!domainError}
                            helperText={domainError || "The domain you want to send emails from"}
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
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 3, md: 3}} sx={{mt: domainError ? '24px' : '0px'}}>
                        <Button
                            startIcon={<AddIcon/>}
                            variant="contained"
                            onClick={handleAdd}
                            disabled={adding || !!domainError}
                            fullWidth
                            sx={{height: 40}}
                        >
                            {adding ? <CircularProgress size={24}/> : 'Add Domain'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', my: 3}}>
                    <CircularProgress/>
                </Box>
            ) : domains.length === 0 ? (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa'
                    }}
                >
                    <Typography variant="body1">No domains yet. Add your first domain above to get started.</Typography>
                </Paper>
            ) : (
                <Box sx={{mt: 2}}>
                    {domains.map((domain) => (
                        <SendingDomainItem
                            key={domain.uuid}
                            domain={domain}
                            onRefresh={fetchDomains}
                            expanded={expandedDomain === domain.uuid}
                            onChange={(_event, isExpanded) => setExpandedDomain(isExpanded ? domain.uuid : false)}
                        />
                    ))}
                </Box>
            )}
        </SettingsAccordionItem>
    );
};

export default SendingDomainsSettings;
