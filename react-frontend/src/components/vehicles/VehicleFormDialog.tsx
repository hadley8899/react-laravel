import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Alert, IconButton, CircularProgress,
    Box, MenuItem, Select, InputLabel, FormControl,
    Autocomplete, Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonAdd from '@mui/icons-material/PersonAdd';

import {Vehicle, VehicleType} from '../../interfaces/Vehicle';
import {
    createVehicle,
    updateVehicle,
    CreateVehiclePayload,
    UpdateVehiclePayload
} from '../../services/VehicleService';
import {getCustomers} from '../../services/CustomerService';
import CustomerFormDialog from '../customer/CustomerFormDialog';
import {Customer} from '../../interfaces/Customer';

interface Props {
    open: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    vehicleToEdit?: Vehicle | null;
}

const vehicleTypes: VehicleType[] = [
    'Car', 'Truck', 'Van', 'SUV', 'Motorcycle', 'Bus', 'Trailer', 'Other'
];

const VehicleFormDialog: React.FC<Props> = ({
                                                open,
                                                onClose,
                                                onSaveSuccess,
                                                vehicleToEdit = null
                                            }) => {
    const isEdit = Boolean(vehicleToEdit);

    /* ---------- form state ---------- */
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
    const [searchingCustomers, setSearchingCustomers] = useState(false);

    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [registration, setRegistration] = useState('');
    const [lastService, setLastService] = useState<string | ''>('');
    const [nextServiceDue, setNextServiceDue] = useState<string | ''>('');
    const [type, setType] = useState<VehicleType | ''>('');

    /* ---------- misc state ---------- */
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    /* ---------- load existing data / reset ---------- */
    useEffect(() => {
        if (!open) return;

        if (isEdit && vehicleToEdit) {
            setCustomer(vehicleToEdit.customer ? vehicleToEdit.customer : null);
            setMake(vehicleToEdit.make);
            setModel(vehicleToEdit.model);
            setYear(vehicleToEdit.year ?? '');
            setRegistration(vehicleToEdit.registration);
            setLastService(vehicleToEdit.last_service ?? '');
            setNextServiceDue(vehicleToEdit.next_service_due ?? '');
            setType(vehicleToEdit.type ?? '');
        } else {
            setCustomer(null);
            setMake('');
            setModel('');
            setYear('');
            setRegistration('');
            setLastService('');
            setNextServiceDue('');
            setType('');
        }
        setError(null);
        setFieldErrors({});
    }, [open]);

    /* ---------- customer search ---------- */
    const handleCustomerSearch = async (q: string) => {
        if (!q.trim()) return;
        setSearchingCustomers(true);
        try {
            const res = await getCustomers(1, 10, q, false);
            setCustomerOptions(res.data);
        } finally {
            setSearchingCustomers(false);
        }
    };

    /* ---------- validation ---------- */
    const validate = () => {
        const errs: Record<string, string> = {};
        if (!customer?.uuid) errs.customer = 'Customer is required';
        if (!make.trim()) errs.make = 'Make is required';
        if (!model.trim()) errs.model = 'Model is required';
        if (!registration.trim()) errs.registration = 'Registration is required';
        if (year !== '' && Number.isNaN(Number(year))) errs.year = 'Year must be a number';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;

        setSubmitting(true);

        const payload: CreateVehiclePayload = {
            customer_id: customer!.uuid,
            make: make.trim(),
            model: model.trim(),
            year: year === '' ? null : Number(year),
            registration: registration.trim(),
            last_service: lastService || null,
            next_service_due: nextServiceDue || null,
            type: type.trim() || null
        };

        try {
            if (isEdit && vehicleToEdit) {
                await updateVehicle(vehicleToEdit.uuid, payload as UpdateVehiclePayload);
            } else {
                await createVehicle(payload);
            }
            onSaveSuccess();
            onClose();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setFieldErrors(err.response.data.errors);
                setError('Please fix the errors below');
            } else {
                setError(err.message || 'Something went wrong');
            }
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- quick-add customer modal ---------- */
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const handleQuickAddClose = () => setQuickAddOpen(false);
    const handleQuickAddSuccess = () => {
        if (customer) {
            handleCustomerSearch(customer.first_name).then(() => {
            });
        }
        setQuickAddOpen(false);
    };

    /* ---------- render ---------- */
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                    {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
                    <IconButton onClick={onClose}><CloseIcon/></IconButton>
                </DialogTitle>

                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                        {/* ----- CUSTOMER ----- */}
                        <Stack direction="row" spacing={1} sx={{mb: 2}}>
                            <Autocomplete
                                fullWidth
                                options={customerOptions}
                                loading={searchingCustomers}
                                getOptionLabel={(c) => `${c.first_name} ${c.last_name} – ${c.email}`}
                                value={customer}
                                onInputChange={(_, value) => handleCustomerSearch(value)}
                                onChange={(_, value) => setCustomer(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Customer"
                                        error={!!fieldErrors.customer}
                                        helperText={fieldErrors.customer}
                                    />
                                )}
                            />
                            <IconButton
                                color="primary"
                                onClick={() => setQuickAddOpen(true)}
                                sx={{flexShrink: 0}}
                                aria-label="quick add customer"
                            >
                                <PersonAdd/>
                            </IconButton>
                        </Stack>

                        {/* ----- BASIC FIELDS ----- */}
                        <Stack direction={{xs: 'column', md: 'row'}} spacing={2} sx={{mb: 2}}>
                            <TextField
                                label="Make" fullWidth required disabled={submitting}
                                value={make} onChange={e => setMake(e.target.value)}
                                error={!!fieldErrors.make} helperText={fieldErrors.make}
                            />
                            <TextField
                                label="Model" fullWidth required disabled={submitting}
                                value={model} onChange={e => setModel(e.target.value)}
                                error={!!fieldErrors.model} helperText={fieldErrors.model}
                            />
                        </Stack>

                        <Stack direction={{xs: 'column', md: 'row'}} spacing={2} sx={{mb: 2}}>
                            <TextField
                                label="Year" type="number" fullWidth disabled={submitting}
                                value={year}
                                onChange={e => setYear(e.target.value === '' ? '' : Number(e.target.value))}
                                error={!!fieldErrors.year} helperText={fieldErrors.year}
                            />
                            <TextField
                                label="Registration" fullWidth required disabled={submitting}
                                value={registration} onChange={e => setRegistration(e.target.value)}
                                error={!!fieldErrors.registration} helperText={fieldErrors.registration}
                            />
                        </Stack>

                        <Stack direction={{xs: 'column', md: 'row'}} spacing={2} sx={{mb: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={type}
                                    label="Type"
                                    disabled={submitting}
                                    onChange={e => setType(e.target.value as VehicleType)}
                                >
                                    {vehicleTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
                            <TextField
                                label="Last Service" type="date" InputLabelProps={{shrink: true}}
                                fullWidth disabled={submitting}
                                value={lastService} onChange={e => setLastService(e.target.value)}
                            />
                            <TextField
                                label="Next Service Due" type="date" InputLabelProps={{shrink: true}}
                                fullWidth disabled={submitting}
                                value={nextServiceDue} onChange={e => setNextServiceDue(e.target.value)}
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{p: 2}}>
                        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                submitting
                                    ? <CircularProgress size={20} color="inherit"/>
                                    : isEdit ? <SaveIcon/> : <AddIcon/>
                            }
                            disabled={submitting}
                        >
                            {submitting
                                ? (isEdit ? 'Saving…' : 'Adding…')
                                : (isEdit ? 'Save Changes' : 'Add Vehicle')}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* quick-add customer */}
            <CustomerFormDialog
                open={quickAddOpen}
                onClose={handleQuickAddClose}
                onSaveSuccess={handleQuickAddSuccess}
                customerToEdit={null}
            />
        </>
    );
};

export default VehicleFormDialog;
