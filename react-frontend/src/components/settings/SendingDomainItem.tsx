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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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

interface Props {
    domain: SendingDomain;
    onRefresh: () => void;
    expanded?: boolean;
    onChange?: (e: React.SyntheticEvent, exp: boolean) => void;
}

const SendingDomainItem: React.FC<Props> = ({ domain, onRefresh, expanded, onChange }) => {
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
            <Accordion expanded={expanded} onChange={onChange}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ flexGrow: 1 }}>{domain.domain}</Typography>
                        <Chip
                            label={domain.state}
                            color={stateColor[domain.state]}
                            size="small"
                            variant="outlined"
                        />
                        {domain.state !== 'active' ? (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ReplayIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheck();
                                }}
                                disabled={checking}
                            >
                                {checking ? <CircularProgress size={18} /> : 'Check DNS'}
                            </Button>
                        ) : null}
                        <Button
                            size="small"
                            variant="text"
                            startIcon={<InfoOutlinedIcon />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDnsOpen(true);
                            }}
                        >
                            View DNS details
                        </Button>
                    </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0 }}>
                    {domain.state === 'active' ? (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                From addresses
                            </Typography>
                            <FromAddressList domainUuid={domain.uuid} />
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Verify your DNS records first, then you’ll be able to add “From” e-mail
                            addresses.
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* DNS Modal */}
            <Dialog open={dnsOpen} onClose={() => setDnsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>DNS records for {domain.domain}</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Add <b>all</b> of the following records at your DNS provider. Once they
                        propagate, click “Check DNS” and this domain will turn&nbsp;green.
                    </Typography>
                    <SendingDomainRecords records={domain.dns_records} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDnsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SendingDomainItem;
