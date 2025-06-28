import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from "@mui/material";
import {CreateCompanyVariablePayload} from "../../../interfaces/CompanyVariable.ts";

interface VariableCreateEditDialogProps {
    dialogOpen: boolean;
    closeDialog: () => void;
    dialogMode: 'create' | 'edit';
    payload: CreateCompanyVariablePayload;
    setPayload: (payload: any) => void;
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
    return (
        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
            <DialogTitle>
                {dialogMode === 'create' ? 'Add Company Variable' : 'Edit Company Variable'}
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Friendly Name"
                        fullWidth
                        size="medium"
                        value={payload.friendly_name}
                        onChange={(e) =>
                            setPayload({...payload, friendly_name: e.target.value})
                        }
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Key"
                        fullWidth
                        size="medium"
                        helperText="UPPER_SNAKE_CASE – used in templates like {{KEY}}"
                        value={payload.key}
                        onChange={(e) =>
                            setPayload({...payload, key: e.target.value.toUpperCase()})
                        }
                        disabled={dialogMode === 'edit'}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Value"
                        fullWidth
                        size="medium"
                        value={payload.value}
                        onChange={(e) =>
                            setPayload({...payload, value: e.target.value})
                        }
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        select
                        label="Type"
                        fullWidth
                        size="medium"
                        value={payload.type ?? ''}
                        onChange={(e) =>
                            setPayload({...payload, type: e.target.value})
                        }
                        InputLabelProps={{ shrink: true }}
                    >
                        <MenuItem value="">(none)</MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="color">Color</MenuItem>
                        <MenuItem value="url">URL</MenuItem>
                        <MenuItem value="image">Image URL</MenuItem>
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
                    startIcon={isSaving && <CircularProgress size={16}/>}
                >
                    {isSaving ? 'Saving…' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default VariableCreateEditDialog;