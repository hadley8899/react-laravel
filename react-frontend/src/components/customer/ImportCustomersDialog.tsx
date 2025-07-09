import React, {useState, useMemo} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Stepper, Step, StepLabel, Box, Typography,
    CircularProgress, Checkbox, FormControlLabel, Link,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import {
    uploadCustomerImport,
    startCustomerImport,
    downloadCustomerImportTemplate,
} from '../../services/CustomerImportService';
import ColumnMapperTable from './ColumnMapperTable';
import TagFilterSelect from '../filters/TagFilterSelect';
import {Tag} from '../../interfaces/Tag';
import {useNotifier} from '../../context/NotificationContext.tsx';
import {CustomerImport} from "../../interfaces/CustomerImport.ts";

const steps = ['Upload', 'Map columns', 'Tags', 'Review'];

const builtInOptions = [
    {value: 'first_name', label: 'First Name'},
    {value: 'last_name', label: 'Last Name'},
    {value: 'email', label: 'Email'},
    {value: 'phone', label: 'Phone'},
    {value: 'address', label: 'Address'},
    {value: 'status', label: 'Status'},
    {value: 'tags', label: 'Tags (per-row)'},
    {value: 'IGNORE', label: 'Ignore'},
];

interface Props {
    open: boolean;
    onClose: () => void;
}

const ImportCustomersDialog: React.FC<Props> = ({open, onClose}) => {
    const {showNotification} = useNotifier();

    /* ───────── state ───────── */
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [record, setRecord] = useState<CustomerImport | null>(null);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [bulkTags, setBulkTags] = useState<Tag[]>([]);
    const [readTagsCol, setReadTags] = useState(false);

    const headings = useMemo<string[]>(
        () => (record?.meta?.headings ?? []) as string[],
        [record],
    );

    const reset = () => {
        setStep(0);
        setFile(null);
        setRecord(null);
        setMapping({});
        setBulkTags([]);
        setReadTags(false);
        setLoading(false);
    };
    const close = () => {
        reset();
        onClose();
    };

    /* ───────── handlers ───────── */
    const selectFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setLoading(true);
        try {
            const rec = await uploadCustomerImport(f);
            setRecord(rec);

            const canon = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
            const auto: Record<string, string> = {};
            const lookup: Record<string, string> = {
                firstname: 'first_name', lastname: 'last_name', email: 'email',
                phone: 'phone', address: 'address', status: 'status', tags: 'tags',
            };
            rec.meta?.headings?.forEach((h: string) =>
                auto[h] = lookup[canon(h)] ?? 'IGNORE');
            setMapping(auto);

            setStep(1);
        } catch (err: any) {
            showNotification(err.message ?? 'Upload failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const beginImport = async () => {
        if (!record) return;
        setLoading(true);
        try {
            await startCustomerImport(record.uuid, {
                mapping,
                bulk_tag_ids: bulkTags.map(t => t.uuid),
                read_tags_column: readTagsCol,
            });
            showNotification('Import queued – we’ll notify you when it finishes.');
            close();
        } catch (err: any) {
            showNotification(err.message ?? 'Could not start import', 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const blob = await downloadCustomerImportTemplate();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'customers_template.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            showNotification('Could not download template', 'error');
        }
    };

    /* ───────── step content ───────── */
    const render = () => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{py: 3, textAlign: 'center'}}>
                        <input id="imp-file" type="file"
                               accept=".xlsx,.xls,.csv,.ods,.tsv,.xml,.html"
                               style={{display: 'none'}} onChange={selectFile}/>
                        <label htmlFor="imp-file">
                            <Button component="span" variant="outlined"
                                    startIcon={<UploadFileIcon/>} sx={{borderRadius: 2, px: 4}}>
                                Choose file
                            </Button>
                        </label>
                        {file && <Typography sx={{mt: 1.5}}>{file.name}</Typography>}

                        <Box sx={{mt: 3}}>
                            <Link component="button" onClick={downloadTemplate}>
                                Download sample template
                            </Link>
                        </Box>
                    </Box>
                );
            case 1:
                return (
                    <>
                        <Typography variant="subtitle1" sx={{mb: 1}}>
                            Match columns
                        </Typography>
                        <ColumnMapperTable
                            headings={headings}
                            mapping={mapping}
                            setMapping={setMapping}
                            options={builtInOptions}
                        />
                    </>
                );
            case 2:
                return (
                    <Box sx={{py: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Typography variant="subtitle1">Bulk tags</Typography>
                        <TagFilterSelect value={bulkTags} onChange={setBulkTags}/>
                        <FormControlLabel
                            control={<Checkbox checked={readTagsCol}
                                               onChange={e => setReadTags(e.target.checked)}/>}
                            label="Also read per-row ‘Tags’ column"
                        />
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{py: 2}}>
                        <Typography variant="subtitle1">Review</Typography>
                        <Typography sx={{mt: 0.5}}><b>File:</b> {file?.name}</Typography>
                        <Typography sx={{mt: 0.5}}><b>Rows:</b> {record?.total_rows}</Typography>
                        <Typography sx={{mt: 0.5}}>
                            <b>Bulk tags:</b> {bulkTags.length
                            ? bulkTags.map(t => t.name).join(', ')
                            : 'None'}
                        </Typography>
                        <Typography sx={{mt: 0.5}}>
                            <b>Per-row tags column:</b> {readTagsCol ? 'Yes' : 'No'}
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    /* ───────── footer buttons ───────── */
    const footer = () => (
        <>
            {step > 0 && <Button onClick={() => setStep(p => p - 1)}>Back</Button>}
            {step < steps.length - 1 && (
                <Button variant="contained" onClick={() => setStep(p => p + 1)}>
                    Next
                </Button>
            )}
            {step === steps.length - 1 && (
                <Button variant="contained" onClick={beginImport}>
                    Start import
                </Button>
            )}
        </>
    );

    return (
        <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
            <DialogTitle>Import contacts</DialogTitle>
            <DialogContent dividers>
                <Stepper activeStep={step} alternativeLabel>
                    {steps.map(l => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}
                </Stepper>

                {loading
                    ? <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
                        <CircularProgress/>
                    </Box>
                    : render()}
            </DialogContent>
            <DialogActions sx={{pr: 3, pb: 2}}>
                <Button onClick={close}>Cancel</Button>
                {footer()}
            </DialogActions>
        </Dialog>
    );
};

export default ImportCustomersDialog;
