import React, {useEffect, useState} from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
import {useNavigate, useParams} from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {Campaign} from '../interfaces/Campaign';
import {getCampaign} from '../services/CampaignService';

const statusColor: Record<
    string,
    'default' | 'success' | 'warning' | 'error' | 'info'
> = {
    queued: 'warning',
    scheduled: 'info',
    sending: 'info',
    sent: 'success',
    failed: 'error',
};

const fmt = (dt?: string | null) =>
    dt ? dayjs(dt).format('DD MMM YYYY HH:mm') : '—';

const CampaignDetail: React.FC = () => {
    const {uuid = ''} = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* fetch */
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCampaign(uuid);
            setCampaign(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load campaign');
        } finally {
            setLoading(false);
        }
    };

    // Reply to will be from address if blank
    const replyToAddress = (campaign: Campaign) => {
        return campaign.reply_to || campaign.from_address || '—';
    }

    useEffect(() => {
        load();
    }, [uuid]);

    /* ─────────────────────────── render */
    return (
        <MainLayout title="Campaign details">
            <Container maxWidth="md" sx={{py: 4}}>
                <Box sx={{display: 'flex', gap: 1, mb: 2}}>
                    <Button
                        size="small"
                        startIcon={<ArrowBackIcon/>}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                    <Button
                        size="small"
                        startIcon={<RefreshIcon/>}
                        onClick={load}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{textAlign: 'center', py: 10}}>
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : campaign ? (
                    <Paper sx={{p: 3, borderRadius: 2}} elevation={3}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            {campaign.subject}
                        </Typography>

                        <Box sx={{mb: 1.5, display: 'flex', alignItems: 'center', columnGap: 1}}>
                            <Typography variant="body2" component="span" fontWeight={600}>
                                Status:
                            </Typography>

                            <Chip
                                label={campaign.status}
                                color={statusColor[campaign.status.toLowerCase()] ?? 'default'}
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        <Divider sx={{my: 2}}/>

                        <Box sx={{display: 'grid', rowGap: 1}}>
                            <Row label="From address">
                                {campaign.from_address ?? '—'}
                            </Row>
                            <Row label="Reply-To">{replyToAddress(campaign)}</Row>
                            <Row label="Template">{campaign.template?.name ?? '—'}</Row>
                            <Row label="Scheduled at">{fmt(campaign.scheduled_at)}</Row>
                            <Row label="Sent at">{fmt(campaign.sent_at)}</Row>
                            <Row label="Recipients">{campaign.total_contacts}</Row>
                        </Box>

                        {/* placeholder for future stats */}
                        <Divider sx={{my: 3}}/>
                        <Typography variant="subtitle1" gutterBottom>
                            Engagement (coming soon)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Open, click, bounce and complaint metrics will appear here once we
                            start ingesting Mailgun event data.
                        </Typography>
                    </Paper>
                ) : null}
            </Container>
        </MainLayout>
    );
};

/* small helper for label/value rows */
const Row: React.FC<{ label: string; children: React.ReactNode }> = ({
                                                                         label,
                                                                         children
                                                                     }) => (
    <Typography variant="body2">
        <strong>{label}:</strong> {children}
    </Typography>
);

export default CampaignDetail;
