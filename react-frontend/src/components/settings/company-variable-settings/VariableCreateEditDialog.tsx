import React, { useRef } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { CreateCompanyVariablePayload } from '../../../interfaces/CompanyVariable.ts';

interface VariableCreateEditDialogProps {
    dialogOpen: boolean;
    closeDialog: () => void;
    dialogMode: 'create' | 'edit';
    payload: CreateCompanyVariablePayload;
    setPayload: (payload: CreateCompanyVariablePayload) => void;
    handleSave: () => Promise<void>;
    isSaving: boolean;
}

const VariableCreateEditDialog: React.FC<VariableCreateEditDialogProps> = ({
                                                                               dialogOpen,
                                                                               closeDialog,
                                                                               dialogMode,
                                                                               payload,
                                                                               setPayload,
                                                                               handleSave,
                                                                               isSaving,
                                                                           }) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPayload({ ...payload, value: file });
        }
    };

    const renderValueInput = () => {
        switch (payload.type) {
            case 'color':
                return (
                    <TextField
                        type="color"
                        label="Colour"
                        fullWidth
                        size="medium"
                        value={typeof payload.value === 'string' ? payload.value : '#000000'}
                        onChange={(e) =>
                            setPayload({ ...payload, value: e.target.value })
                        }
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />
                );

            case 'image':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                            >
                                {payload.value instanceof File ? 'Change image' : 'Choose image'}
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={onFileChange}
                                />
                            </Button>
                            {payload.value instanceof File && (
                                <Typography variant="body2">{payload.value.name}</Typography>
                            )}
                        </Box>
                        {/* Image preview */}
                        {payload.value instanceof File ? (
                            <Box
                                component="img"
                                src={URL.createObjectURL(payload.value)}
                                alt="Preview"
                                sx={{ maxWidth: 120, maxHeight: 120, borderRadius: 1, border: '1px solid #eee' }}
                            />
                        ) : (
                            // Show preview if editing and .url exists (from backend)
                            ((typeof payload.value === 'string' && payload.value) ? (<Box
                                component="img"
                                src={payload.value}
                                alt="Preview"
                                sx={{ maxWidth: 120, maxHeight: 120, borderRadius: 1, border: '1px solid #eee' }}
                            />) : // If .url exists on payload.meta (or similar), show that
                            (payload.meta && payload.meta.url ? (<Box
                                component="img"
                                src={payload.meta.url}
                                alt="Preview"
                                sx={{ maxWidth: 120, maxHeight: 120, borderRadius: 1, border: '1px solid #eee' }}
                            />) : null))
                        )}
                    </Box>
                );

            default:
                return (
                    <TextField
                        label="Value"
                        fullWidth
                        size="medium"
                        value={payload.value as string}
                        onChange={(e) =>
                            setPayload({ ...payload, value: e.target.value })
                        }
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />
                );
        }
    };

    return (
        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
            <DialogTitle>
                {dialogMode === 'create' ? 'Add Company Variable' : 'Edit Company Variable'}
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    {/* Friendly name ------------------------------------------------ */}
                    <TextField
                        label="Friendly Name"
                        fullWidth
                        size="medium"
                        value={payload.friendly_name}
                        onChange={(e) =>
                            setPayload({ ...payload, friendly_name: e.target.value })
                        }
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    {/* Key ---------------------------------------------------------- */}
                    <TextField
                        label="Key"
                        fullWidth
                        size="medium"
                        helperText="UPPER_SNAKE_CASE – used in templates like {{KEY}}"
                        value={payload.key}
                        onChange={(e) =>
                            setPayload({ ...payload, key: e.target.value.toUpperCase() })
                        }
                        disabled={dialogMode === 'edit'}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    {/* Dynamic value input ----------------------------------------- */}
                    {renderValueInput()}

                    {/* Type selector *cannot* change once created ------------------ */}
                    <TextField
                        select
                        label="Type"
                        fullWidth
                        size="medium"
                        value={payload.type ?? ''}
                        onChange={(e) =>
                            setPayload({ ...payload, type: e.target.value })
                        }
                        disabled={dialogMode === 'edit'}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    >
                        <MenuItem value="">(none)</MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="color">Colour</MenuItem>
                        <MenuItem value="url">URL</MenuItem>
                        <MenuItem value="image">Image</MenuItem>  {/* label updated */}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} disabled={isSaving}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaving}
                    startIcon={isSaving && <CircularProgress size={16} />}
                >
                    {isSaving ? 'Saving…' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VariableCreateEditDialog;
