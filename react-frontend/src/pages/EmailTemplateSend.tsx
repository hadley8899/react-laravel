import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import {
    DatePicker,
    TimePicker,
} from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getTemplate,
    previewTemplate,
    sendCampaign,
    getTags,
    getCustomerCountByTags,
} from '../services/EmailTemplateService';
import { getVerifiedFromAddresses } from '../services/SendingDomainService';
import { EmailTemplate } from '../interfaces/EmailTemplate';
import { Tag } from '../interfaces/Tag';
import { useNotifier } from '../context/NotificationContext';

dayjs.locale('en-gb');

interface FromOption {
    uuid: string;
    email: string;
}

const EmailTemplateSend: React.FC = () => {
    const { showNotification } = useNotifier();
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    /* ---------- base state ---------- */
    const [template, setTemplate] = useState<EmailTemplate | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customerCount, setCustomerCount] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    /* From / reply-to */
    const [fromOptions, setFromOptions] = useState<FromOption[]>([]);
    const [selectedFromUuid, setSelectedFromUuid] = useState('');
    const [customReplyTo, setCustomReplyTo] = useState('');

    /* Subject + pre-header */
    const [subject, setSubject] = useState('');
    const [preText, setPreText] = useState('');

    /* Schedule defaults to “now” */
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [time, setTime] = useState<Dayjs | null>(dayjs());

    /* ---------- fetch template + meta ---------- */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tpl, tagList, froms] = await Promise.all([
                    getTemplate(uuid!),
                    getTags(),
                    getVerifiedFromAddresses(),
                ]);

                setTemplate(tpl);
                setTags(tagList);

                setFromOptions(froms);
                setSelectedFromUuid(froms[0]?.uuid ?? '');

                setSubject(tpl.subject || '');
                setPreText(tpl.preview_text || '');
            } catch {
                showNotification('Failed to load data', 'error');
            } finally {
                setLoading(false);
            }
        };

        void fetchData(); // eslint rule: handle promise
    }, [uuid, showNotification]);

    /* ---------- preview iframe ---------- */
    useEffect(() => {
        if (!uuid) return;

        previewTemplate(uuid)
            .then((data) => setPreviewHtml(data.html))
            .catch(() => setPreviewHtml(null));
    }, [uuid]);

    /* ---------- customer count ---------- */
    useEffect(() => {
        if (selectedTags.length === 0) {
            setCustomerCount(null);
            return;
        }

        getCustomerCountByTags(selectedTags)
            .then((count) => setCustomerCount(count))
            .catch(() => setCustomerCount(null));
    }, [selectedTags]);

    /* ---------- send ---------- */
    const handleSend = useCallback(async () => {
        if (!date || !time || !selectedFromUuid) return;

        const scheduledIso = date
            .hour(time.hour())
            .minute(time.minute())
            .second(0)
            .millisecond(0)
            .toISOString();

        setSending(true);
        try {
            const { uuid: campaignUuid } = await sendCampaign({
                template_uuid: uuid!,
                subject,
                preheader_text: preText,
                from_address_uuid: selectedFromUuid,
                reply_to: customReplyTo || null,
                tag_uuids: selectedTags,
                scheduled_at: scheduledIso,
            });

            showNotification('Campaign queued!', 'success');
            navigate(`/campaigns/${campaignUuid}`);
        } catch {
            showNotification('Failed to queue campaign', 'error');
        } finally {
            setSending(false);
            setConfirmOpen(false);
        }
    }, [
        uuid,
        subject,
        preText,
        selectedFromUuid,
        customReplyTo,
        selectedTags,
        date,
        time,
        navigate,
        showNotification,
    ]);

    /* ---------- form ready? ---------- */
    const scheduleIsPast =
        date && time
            ? date.hour(time.hour()).minute(time.minute()).isBefore(dayjs())
            : false;

    const canSend =
        !sending &&
        selectedTags.length > 0 &&
        selectedFromUuid &&
        date &&
        time &&
        !scheduleIsPast;

    /* ---------- render ---------- */
    if (loading) {
        return (
            <Box sx={{ p: 6, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Send Email Campaign
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {template?.name}
                </Typography>

                {/* subject + pre-header */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Pre-header"
                        value={preText}
                        onChange={(e) => setPreText(e.target.value)}
                        fullWidth
                        size="small"
                    />
                </Box>

                {/* from */}
                <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="from-select-label">From Address</InputLabel>
                        <Select
                            labelId="from-select-label"
                            value={selectedFromUuid}
                            label="From Address"
                            onChange={(e) => setSelectedFromUuid(e.target.value as string)}
                        >
                            {fromOptions.map((opt) => (
                                <MenuItem key={opt.uuid} value={opt.uuid}>
                                    {opt.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* reply-to */}
                <Box sx={{ mt: 3 }}>
                    <TextField
                        label="Reply-To (optional)"
                        value={customReplyTo}
                        onChange={(e) => setCustomReplyTo(e.target.value)}
                        fullWidth
                        size="small"
                    />
                </Box>

                {/* schedule */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <DatePicker
                        label="Send date"
                        value={date}
                        onChange={(val) => setDate(val as Dayjs | null)}
                        format="DD/MM/YYYY"
                        sx={{ flex: 1 }}
                    />
                    <TimePicker
                        label="Send time"
                        value={time}
                        onChange={(val) => setTime(val as Dayjs | null)}
                        ampm={false}
                        sx={{ flex: 1 }}
                    />
                </Box>
                {scheduleIsPast && (
                    <Typography variant="caption" color="error">
                        Scheduled time is in the past – adjust it or it will send immediately.
                    </Typography>
                )}

                {/* tag picker */}
                <Box sx={{ mt: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel id="tag-select-label">Target tags</InputLabel>
                        <Select
                            labelId="tag-select-label"
                            multiple
                            value={selectedTags}
                            onChange={(e) => setSelectedTags(e.target.value as string[])}
                            label="Target tags"
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((tagUuid) => {
                                        const tag = tags.find((t) => t.uuid === tagUuid);
                                        return <Chip key={tagUuid} label={tag?.name || tagUuid} />;
                                    })}
                                </Box>
                            )}
                        >
                            {tags.map((tag) => (
                                <MenuItem key={tag.uuid} value={tag.uuid}>
                                    {tag.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {selectedTags.length === 0
                            ? 'Select tags to see how many recipients.'
                            : customerCount === null
                                ? 'Counting customers…'
                                : `${customerCount} customer${
                                    customerCount === 1 ? '' : 's'
                                } will receive this email.`}
                    </Typography>
                </Box>

                {/* actions */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={!canSend}
                        onClick={() => setConfirmOpen(true)}
                    >
                        {scheduleIsPast ? 'Send now' : 'Schedule / Send'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </Box>

                {/* preview */}
                <Box sx={{ mt: 5 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Email preview
                    </Typography>
                    <Paper variant="outlined" sx={{ minHeight: 200, p: 0 }}>
                        {previewHtml ? (
                            <iframe
                                title="preview"
                                srcDoc={previewHtml}
                                style={{ border: 0, width: '100%', height: '300px' }}
                            />
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Paper>

            {/* confirm dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm send</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        {scheduleIsPast
                            ? 'This campaign will be sent immediately.'
                            : `This campaign will be sent on ${date?.format(
                                'DD/MM/YYYY',
                            )} at ${time?.format('HH:mm')}.`}
                    </Typography>
                    <Typography>
                        Audience: {customerCount ?? 0} customer
                        {customerCount === 1 ? '' : 's'}.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        color="success"
                        onClick={handleSend}
                        disabled={!canSend}
                        autoFocus
                    >
                        {sending ? <CircularProgress size={22} /> : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmailTemplateSend;
