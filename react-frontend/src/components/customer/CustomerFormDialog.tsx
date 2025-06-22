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
    FormHelperText,
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
import {
    syncCustomerTags,
} from '../../services/TagService';
import CustomerTagSelect from './CustomerTagSelect.tsx';
import {Tag} from '../../interfaces/Tag';
import {useNotifier} from '../../context/NotificationContext';

type CustomerStatus = 'Active' | 'Inactive';
const customerStatuses: CustomerStatus[] = ['Active', 'Inactive'];

interface CustomerFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    customerToEdit?: Customer | null;
}

const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   onSaveSuccess,
                                                                   customerToEdit = null,
                                                               }) => {
    const isEditMode = !!customerToEdit;
    const {showNotification} = useNotifier();

    /* -------- form state -------- */
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<CustomerStatus>('Active');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    /* -------- UI state -------- */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    /* -------- initialise form -------- */
    useEffect(() => {
        if (open) {
            if (isEditMode && customerToEdit) {
                setFirstName(customerToEdit.first_name || '');
                setLastName(customerToEdit.last_name || '');
                setEmail(customerToEdit.email || '');
                setPhone(customerToEdit.phone || '');
                setAddress(customerToEdit.address || '');
                const validStatus = customerStatuses.includes(customerToEdit.status)
                    ? customerToEdit.status
                    : 'Active';
                setStatus(validStatus);
                setSelectedTags(customerToEdit.tags || []);
            } else {
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

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!firstName.trim()) errors.firstName = 'First name is required.';
        if (!lastName.trim()) errors.lastName = 'Last name is required.';
        if (!email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email address is invalid.';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setError(null);

        if (!validateForm()) return;
        setIsSubmitting(true);

        const apiPayload = {
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
                    apiPayload as UpdateCustomerPayload,
                );
                customerUuid = customerToEdit.uuid;
            } else {
                const newCustomer = await createCustomer(
                    apiPayload as CreateCustomerPayload,
                );
                customerUuid = newCustomer.uuid;
            }

            // sync tags
            await syncCustomerTags(
                customerUuid,
                selectedTags.map((t) => t.uuid),
            );

            showNotification(
                `Customer ${isEditMode ? 'updated' : 'created'} successfully`,
            );
            onSaveSuccess();
            onClose();
        } catch (err: any) {
            console.error(
                `Failed to ${isEditMode ? 'update' : 'create'} customer:`,
                err,
            );
            if (err.response && err.response.data && err.response.data.errors) {
                const apiErrors = err.response.data.errors;
                const formattedErrors: Record<string, string> = {};
                for (const key in apiErrors) {
                    let frontendKey = key;
                    if (key === 'first_name') frontendKey = 'firstName';
                    if (key === 'last_name') frontendKey = 'lastName';
                    formattedErrors[frontendKey] = apiErrors[key][0];
                }
                setFieldErrors(formattedErrors);
                setError('Please correct the errors below.');
            } else {
                setError(
                    err.message ||
                    `An unexpected error occurred. Could not ${
                        isEditMode ? 'update' : 'add'
                    } customer.`,
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = (
        event: SelectChangeEvent<CustomerStatus>,
    ) => {
        setStatus(event.target.value as CustomerStatus);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{color: (theme) => theme.palette.grey[500]}}
                >
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
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                required
                                autoFocus={!isEditMode}
                                margin="dense"
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                type="text"
                                fullWidth
                                variant="outlined"
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
                                name="lastName"
                                label="Last Name"
                                type="text"
                                fullWidth
                                variant="outlined"
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
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
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
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                fullWidth
                                variant="outlined"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                error={!!fieldErrors.phone}
                                helperText={fieldErrors.phone || 'Optional'}
                                disabled={isSubmitting}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <FormControl
                                fullWidth
                                margin="dense"
                                required
                                variant="outlined"
                                disabled={isSubmitting}
                                error={!!fieldErrors.status}
                            >
                                <InputLabel id="status-select-label">Status</InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    id="status"
                                    name="status"
                                    value={status}
                                    label="Status"
                                    onChange={handleStatusChange}
                                >
                                    {customerStatuses.map((stat) => (
                                        <MenuItem key={stat} value={stat}>
                                            {stat}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {fieldErrors.status && (
                                    <FormHelperText error>{fieldErrors.status}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* ------------ TAG SELECTOR ------------- */}
                        <Grid size={12}>
                            <CustomerTagSelect
                                value={selectedTags}
                                onChange={setSelectedTags}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                margin="dense"
                                id="address"
                                name="address"
                                label="Address"
                                type="text"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={!!fieldErrors.address}
                                helperText={fieldErrors.address || 'Optional'}
                                disabled={isSubmitting}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{p: {xs: 2, sm: 3}}}>
                    <Button onClick={onClose} disabled={isSubmitting} color="inherit">
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
