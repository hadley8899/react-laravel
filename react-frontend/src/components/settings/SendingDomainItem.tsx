import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Chip,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    LinearProgress,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DnsIcon from '@mui/icons-material/Dns';
import { SendingDomain } from '../../interfaces/SendingDomain';
import { verifySendingDomain } from '../../services/SendingDomainService';
import { useNotifier } from '../../context/NotificationContext';
import SendingDomainRecords from './SendingDomainRecords';
import FromAddressList from './FromAddressList';

const stateColor: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    pending: 'warning',
    active: 'success',
    failed: 'error',
};

const stateLabel: Record<string, string> = {
    pending: 'DNS Verification Needed',
    active: 'Verified',
    failed: 'Verification Failed',
};

interface Props {
    domain: SendingDomain;
    onRefresh: () => void;
    expanded?: boolean;
    onChange?: (e: React.SyntheticEvent, exp: boolean) => void;
}

const SendingDomainItem: React.FC<Props> = ({ domain, onRefresh, expanded, onChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { showNotification } = useNotifier();
    const [checking, setChecking] = useState(false);
    const [dnsOpen, setDnsOpen] = useState(false);

    /* ----- verify action ----- */
    const handleCheck = async () => {
        setChecking(true);
        try {
            await verifySendingDomain(domain.uuid);
            showNotification('Verification requested – refresh shortly.', 'success');
            onRefresh();
        } catch {
            showNotification('Failed to verify', 'error');
        } finally {
            setChecking(false);
        }
    };

    return (
        <>
            <Accordion
                expanded={expanded}
                onChange={onChange}
                sx={{
                    mb: 2,
                    borderRadius: 1,
                    '&.Mui-expanded': {
                        boxShadow: theme.shadows[1]
                    }
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    sx={{
                        minHeight: '48px',
                        '&.Mui-expanded': {
                            minHeight: '48px'
                        }
                    }}
                >
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{flexGrow: 1, fontWeight: 'medium'}}>{domain.domain}</Typography>
                        <Chip
                            label={stateLabel[domain.state]}
                            color={stateColor[domain.state]}
                            size="small"
                            sx={{fontWeight: 'medium'}}
                        />
                    </Box>
                </AccordionSummary>

                <AccordionDetails>
                    {domain.state !== 'active' && (
                        <>
                            <Alert severity="warning" sx={{mb: 2}}>
                                <Typography variant="subtitle2">
                                    This domain requires DNS verification before you can use it
                                </Typography>
                                <Typography variant="body2">
                                    Please add the required DNS records to your domain, then click "Check DNS" to
                                    verify.
                                </Typography>
                            </Alert>
                            <Box sx={{
                                display: 'flex',
                                mb: 2,
                                gap: 1,
                                flexDirection: isMobile ? 'column' : 'row'
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<DnsIcon/>}
                                    onClick={() => setDnsOpen(true)}
                                    fullWidth={isMobile}
                                    size="small"
                                >
                                    View DNS Records
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<ReplayIcon/>}
                                    onClick={handleCheck}
                                    disabled={checking}
                                    fullWidth={isMobile}
                                    size="small"
                                >
                                    {checking ? <CircularProgress size={16}/> : 'Check DNS'}
                                </Button>
                            </Box>
                            {checking && <LinearProgress sx={{mb: 2}}/>}
                            <Divider sx={{mb: 2}}/>
                        </>
                    )}

                    {domain.state === 'active' ? (
                        <>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 2,
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: isMobile ? 1 : 0
                            }}>
                                <Typography variant="subtitle1" sx={{fontWeight: 'medium'}}>
                                    From Addresses
                                </Typography>
                                <Button
                                    size="small"
                                    variant="text"
                                    startIcon={<InfoOutlinedIcon/>}
                                    onClick={() => setDnsOpen(true)}
                                >
                                    View DNS Records
                                </Button>
                            </Box>
                            <FromAddressList domainUuid={domain.uuid} />
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Once your domain is verified, you'll be able to create "From" email addresses here.
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* DNS Modal */}
            <Dialog open={dnsOpen} onClose={() => setDnsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>DNS records for {domain.domain}</DialogTitle>
                <DialogContent dividers>
                    <Alert severity="info" sx={{mb: 2}}>
                        <Typography variant="body2">
                            Add <b>all</b> of the following records at your DNS provider. DNS changes may take up to
                            24-48 hours to propagate.
                        </Typography>
                    </Alert>
                    <SendingDomainRecords records={domain.dns_records} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDnsOpen(false)}>Close</Button>
                    {domain.state !== 'active' && (
                        <Button
                            onClick={() => {
                                setDnsOpen(false);
                                handleCheck();
                            }}
                            variant="contained"
                            startIcon={<ReplayIcon/>}
                            color="primary"
                        >
                            Check DNS Now
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SendingDomainItem;
