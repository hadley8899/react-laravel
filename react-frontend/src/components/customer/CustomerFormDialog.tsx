import React, {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    IconButton,
    Box,
    SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

import {Customer} from '../../interfaces/Customer';
import {
    createCustomer,
    updateCustomer,
    CreateCustomerPayload,
    UpdateCustomerPayload,
} from '../../services/CustomerService';
import {syncCustomerTags} from '../../services/TagService';
import CustomerTagSelect from './CustomerTagSelect.tsx';
import {Tag} from '../../interfaces/Tag';
import {useNotifier} from '../../context/NotificationContext';
import useContactFieldDefs from '../../hooks/useContactFieldDefs.ts';

type CustomerStatus = 'Active' | 'Inactive';
const customerStatuses: CustomerStatus[] = ['Active', 'Inactive'];

interface Props {
    open: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    customerToEdit?: Customer | null;
}

const CustomerFormDialog: React.FC<Props> = ({
                                                 open,
                                                 onClose,
                                                 onSaveSuccess,
                                                 customerToEdit = null,
                                             }) => {
    const isEditMode = Boolean(customerToEdit);
    const {showNotification} = useNotifier();

    /* ---------------- form state ---------------- */
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<CustomerStatus>('Active');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    /* custom variables */
    const fieldDefs = useContactFieldDefs();
    const [customVars, setCustomVars] = useState<Record<string, string>>({});

    /* ---------------- UI state ---------------- */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    /* ---------------- initialise dialog ---------------- */
    useEffect(() => {
        if (open) {
            if (isEditMode && customerToEdit) {
                setCustomVars(customerToEdit.custom_variables || {});
                setFirstName(customerToEdit.first_name || '');
                setLastName(customerToEdit.last_name || '');
                setEmail(customerToEdit.email || '');
                setPhone(customerToEdit.phone || '');
                setAddress(customerToEdit.address || '');
                setStatus(
                    customerStatuses.includes(customerToEdit.status as any)
                        ? (customerToEdit.status as CustomerStatus)
                        : 'Active',
                );
                setSelectedTags(customerToEdit.tags || []);
            } else {
                setCustomVars({});
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setStatus('Active');
                setSelectedTags([]);
            }
            setError(null);
            setFieldErrors({});
            setIsSubmitting(false);
        }
    }, [open, customerToEdit, isEditMode]);

    /* ---------------- validation ---------------- */
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!firstName.trim()) errors.firstName = 'First name is required.';
        if (!lastName.trim()) errors.lastName = 'Last name is required.';
        if (!email.trim()) errors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email address is invalid.';
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /* ---------------- submit ---------------- */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (!validateForm()) return;
        setIsSubmitting(true);

        const corePayload = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            address: address.trim() || null,
            status,
        };

        try {
            let customerUuid: string;

            if (isEditMode && customerToEdit) {
                await updateCustomer(
                    customerToEdit.uuid,
                    corePayload as UpdateCustomerPayload,
                    customVars,
                );
                customerUuid = customerToEdit.uuid;
            } else {
                const newCustomer = await createCustomer(
                    corePayload as CreateCustomerPayload,
                    customVars,
                );
                customerUuid = newCustomer.uuid;
            }

            await syncCustomerTags(
                customerUuid,
                selectedTags.map((t) => t.uuid),
            );

            showNotification(`Customer ${isEditMode ? 'updated' : 'created'} successfully`);
            onSaveSuccess();
            onClose();
        } catch (err: any) {
            console.error('Customer save failed:', err);
            if (err?.response?.data?.errors) {
                const apiErrors = err.response.data.errors;
                const formatted: Record<string, string> = {};
                for (const k in apiErrors) {
                    formatted[k.replace('first_name', 'firstName').replace('last_name', 'lastName')] =
                        apiErrors[k][0];
                }
                setFieldErrors(formatted);
                setError('Please correct the errors below.');
            } else {
                setError(err.message ?? 'Unexpected error.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------------- helpers ---------------- */
    const handleCustomVarChange = (uuid: string, val: string) =>
        setCustomVars((prev) => ({...prev, [uuid]: val}));

    const handleStatusChange = (e: SelectChangeEvent<CustomerStatus>) =>
        setStatus(e.target.value as CustomerStatus);

    /* ---------------- render ---------------- */
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{m: 0, p: 2, display: 'flex', justifyContent: 'space-between'}}>
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
                <IconButton aria-label="close" onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent dividers sx={{p: {xs: 2, sm: 3}}}>
                    {error && !Object.keys(fieldErrors).length && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        {/* core fields */}
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                required
                                autoFocus={!isEditMode}
                                margin="dense"
                                id="firstName"
                                label="First Name"
                                fullWidth
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                error={!!fieldErrors.firstName}
                                helperText={fieldErrors.firstName}
                                disabled={isSubmitting}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                required
                                margin="dense"
                                id="lastName"
                                label="Last Name"
                                fullWidth
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                error={!!fieldErrors.lastName}
                                helperText={fieldErrors.lastName}
                                disabled={isSubmitting}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                required
                                margin="dense"
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!fieldErrors.email}
                                helperText={fieldErrors.email}
                                disabled={isSubmitting}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                margin="dense"
                                id="phone"
                                label="Phone Number"
                                fullWidth
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                helperText="Optional"
                                disabled={isSubmitting}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <FormControl fullWidth margin="dense" required disabled={isSubmitting}>
                                <InputLabel id="status-select-label">Status</InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    id="status"
                                    value={status}
                                    label="Status"
                                    onChange={handleStatusChange}
                                >
                                    {customerStatuses.map((s) => (
                                        <MenuItem key={s} value={s}>
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* tags */}
                        <Grid size={12}>
                            <CustomerTagSelect
                                value={selectedTags}
                                onChange={setSelectedTags}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* custom fields */}
                        {fieldDefs.length > 0 && (
                            <>
                                <Grid size={12}>
                                    <Box sx={{fontWeight: 600, mt: 1}}>Custom Fields</Box>
                                </Grid>
                                {fieldDefs.map((f) => (
                                    <Grid size={{xs: 12, sm: 6}} key={f.uuid}>
                                        <TextField
                                            label={f.friendly_name}
                                            value={customVars[f.uuid] ?? ''}
                                            onChange={(e) => handleCustomVarChange(f.uuid, e.target.value)}
                                            fullWidth
                                            margin="dense"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                ))}
                            </>
                        )}

                        {/* address */}
                        <Grid size={12}>
                            <TextField
                                margin="dense"
                                id="address"
                                label="Address"
                                fullWidth
                                multiline
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                helperText="Optional"
                                disabled={isSubmitting}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{p: {xs: 2, sm: 3}}}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={
                            isSubmitting ? (
                                <CircularProgress size={20} color="inherit"/>
                            ) : isEditMode ? (
                                <SaveIcon/>
                            ) : (
                                <AddIcon/>
                            )
                        }
                    >
                        {isSubmitting
                            ? isEditMode
                                ? 'Saving…'
                                : 'Adding…'
                            : isEditMode
                                ? 'Save Changes'
                                : 'Add Customer'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CustomerFormDialog;
