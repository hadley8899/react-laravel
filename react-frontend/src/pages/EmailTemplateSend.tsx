import React, { useEffect, useState } from "react";
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
    DialogActions
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useParams, useNavigate } from "react-router-dom";
import { getTemplate, previewTemplate, sendCampaign, getTags, getCustomerCountByTags } from "../services/EmailTemplateService";
import { EmailTemplate } from "../interfaces/EmailTemplate";
import { Tag } from "../interfaces/Tag";

const EmailTemplateSend: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<EmailTemplate | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customerCount, setCustomerCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Placeholder: from addresses (simulate >1 for demo)
    const [fromAddresses] = useState<string[]>(["noreply@company.com", "info@company.com"]);
    const [selectedFrom, setSelectedFrom] = useState<string>("noreply@company.com");

    // Placeholder: reply-to addresses (simulate >1 for demo)
    const [replyToAddresses] = useState<string[]>(["reply@company.com"]);
    const [selectedReplyTo, setSelectedReplyTo] = useState<string>("reply@company.com");
    const [customReplyTo, setCustomReplyTo] = useState<string>("");

    // Subject and pre-text (editable per send)
    const [subject, setSubject] = useState<string>("");
    const [preText, setPreText] = useState<string>("");

    // Fetch template and tags
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tpl, tagList] = await Promise.all([
                    getTemplate(uuid!),
                    getTags()
                ]);
                setTemplate(tpl);
                setTags(tagList);
                setSubject(tpl.subject || "");
                setPreText(tpl.preview_text || "");
            } catch {
                setSnackbar({ open: true, message: "Failed to load data", severity: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [uuid]);

    // Fetch preview HTML
    useEffect(() => {
        if (!uuid) return;
        previewTemplate(uuid)
            .then(data => setPreviewHtml(data.html))
            .catch(() => setPreviewHtml(null));
    }, [uuid]);

    // Fetch customer count when tags change
    useEffect(() => {
        if (selectedTags.length === 0) {
            setCustomerCount(null);
            return;
        }
        getCustomerCountByTags(selectedTags)
            .then(count => setCustomerCount(count))
            .catch(() => setCustomerCount(null));
    }, [selectedTags]);

    const handleSend = async () => {
        setSending(true);
        try {
            // In future: pass subject, preText, from, replyTo to backend
            await sendCampaign(uuid!, selectedTags);
            setSnackbar({ open: true, message: "Campaign sent!", severity: "success" });
            setConfirmOpen(false);
        } catch {
            setSnackbar({ open: true, message: "Failed to send campaign", severity: "error" });
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 6, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Send Email Campaign
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {template?.name}
                </Typography>

                {/* Subject and Pre-text fields */}
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ flex: 2 }}
                    />
                    <TextField
                        label="Pre-header Text"
                        value={preText}
                        onChange={e => setPreText(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ flex: 2 }}
                    />
                </Box>

                {/* From Address (placeholder logic) */}
                <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="from-select-label">From Address</InputLabel>
                        <Select
                            labelId="from-select-label"
                            value={selectedFrom}
                            label="From Address"
                            onChange={e => setSelectedFrom(e.target.value)}
                            disabled={fromAddresses.length <= 1}
                        >
                            {fromAddresses.map(addr => (
                                <MenuItem key={addr} value={addr}>{addr}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Reply-To Address (placeholder logic) */}
                <Box sx={{ mt: 3 }}>
                    {replyToAddresses.length > 1 ? (
                        <FormControl fullWidth>
                            <InputLabel id="replyto-select-label">Reply-To Address</InputLabel>
                            <Select
                                labelId="replyto-select-label"
                                value={selectedReplyTo}
                                label="Reply-To Address"
                                onChange={e => setSelectedReplyTo(e.target.value)}
                            >
                                {replyToAddresses.map(addr => (
                                    <MenuItem key={addr} value={addr}>{addr}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            label="Reply-To Address"
                            value={customReplyTo || replyToAddresses[0]}
                            onChange={e => setCustomReplyTo(e.target.value)}
                            fullWidth
                            size="small"
                        />
                    )}
                </Box>

                {/* Tag selection */}
                <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="tag-select-label">Select Tags</InputLabel>
                        <Select
                            labelId="tag-select-label"
                            multiple
                            value={selectedTags}
                            onChange={e => setSelectedTags(e.target.value as string[])}
                            label="Select Tags"
                            renderValue={selected => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map(tagUuid => {
                                        const tag = tags.find(t => t.uuid === tagUuid);
                                        return <Chip key={tagUuid} label={tag?.name || tagUuid} />;
                                    })}
                                </Box>
                            )}
                        >
                            {tags.map(tag => (
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
                            ? "Select tags to see how many customers will be emailed."
                            : customerCount === null
                                ? "Counting customers..."
                                : `${customerCount} customer${customerCount === 1 ? "" : "s"} will receive this email.`}
                    </Typography>
                </Box>
                <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={selectedTags.length === 0 || sending}
                        onClick={() => setConfirmOpen(true)}
                    >
                        Send Campaign
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </Box>
                <Box sx={{ mt: 5 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Email Preview
                    </Typography>
                    <Paper variant="outlined" sx={{ minHeight: 200, p: 0 }}>
                        {previewHtml ? (
                            <iframe
                                title="preview"
                                srcDoc={previewHtml}
                                style={{ border: 0, width: "100%", height: "300px" }}
                            />
                        ) : (
                            <Box sx={{ p: 4, textAlign: "center" }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Paper>
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Send</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to send this campaign to {customerCount ?? 0} customer{customerCount === 1 ? "" : "s"}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        color="success"
                        onClick={handleSend}
                        disabled={sending}
                        autoFocus
                    >
                        {sending ? <CircularProgress size={22} /> : "Send"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmailTemplateSend;

