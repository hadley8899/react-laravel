import React, {useState, useEffect} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, CircularProgress,
    Alert, Autocomplete, Stack, Box
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {Vehicle} from '../../interfaces/Vehicle';
import {Customer} from '../../interfaces/Customer';
import {getCustomers} from '../../services/CustomerService';
import {createVehicle, updateVehicle} from '../../services/VehicleService';
import {VehicleMake, VehicleModel, getVehicleMakes, getVehicleModels} from '../../services/VehicleMakeModelService';
import {format} from "date-fns";

interface VehicleFormDialogProps {
    open: boolean;
    onClose: () => void;
    vehicleToEdit: Vehicle | null;
    onSaveSuccess: () => void;
}

const VEHICLE_TYPES = ['Car', 'Truck', 'Motorcycle', 'Van', 'SUV', 'Commercial'];

const VehicleFormDialog: React.FC<VehicleFormDialogProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 vehicleToEdit,
                                                                 onSaveSuccess
                                                             }) => {
    // Form state with defaults
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear().toString(),
        registration: '',
        customer_id: '',
        last_service: format(new Date(), 'yyyy-MM-dd'),
        next_service_due: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'yyyy-MM-dd'),
        type: 'Car',
    });

    // Form-related state
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [makes, setMakes] = useState<VehicleMake[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMake, setSelectedMake] = useState<VehicleMake | null>(null);
    const [isMakesLoading, setIsMakesLoading] = useState(false);
    const [isModelsLoading, setIsModelsLoading] = useState(false);
    const [makeSearch, setMakeSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');

    // For tracking the vehicle being edited
    const isEditMode = Boolean(vehicleToEdit);

    // Load customers on mount
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await getCustomers();
                setCustomers(data.data);
            } catch (err) {
                console.error('Failed to load customers:', err);
            }
        };

        if (open) {
            loadCustomers().then(() => {
            });
        }
    }, [open]);

    // Load makes with debounce
    useEffect(() => {
        if (!open) {
            return;
        }

        const fetchMakes = async () => {
            setIsMakesLoading(true);
            try {
                const data = await getVehicleMakes(makeSearch || undefined);
                setMakes(data);
            } catch (err) {
                console.error('Failed to load makes:', err);
            } finally {
                setIsMakesLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchMakes().then(() => {
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [makeSearch, open]);

    // Load models when make changes or search changes
    useEffect(() => {
        if (!selectedMake || !open) {
            setModels([]);
            return;
        }

        const fetchModels = async () => {
            setIsModelsLoading(true);
            try {
                const data = await getVehicleModels(selectedMake.uuid, modelSearch || undefined);
                setModels(data);
            } catch (err) {
                console.error('Failed to load models:', err);
            } finally {
                setIsModelsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchModels().then(() => {});
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedMake, modelSearch, open]);

    // Set form data when editing a vehicle
    useEffect(() => {
        if (vehicleToEdit && open) {
            setFormData({
                make: vehicleToEdit.make || '',
                model: vehicleToEdit.model || '',
                year: vehicleToEdit.year?.toString() || new Date().getFullYear().toString(),
                registration: vehicleToEdit.registration || '',
                customer_id: vehicleToEdit?.customer?.uuid ? vehicleToEdit?.customer?.uuid : '',
                last_service: vehicleToEdit.last_service || format(new Date(), 'yyyy-MM-dd'),
                next_service_due: vehicleToEdit.next_service_due || format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'yyyy-MM-dd'),
                type: vehicleToEdit.type || 'Car',
            });

            // Try to find the make
            const findMake = async () => {
                if (!vehicleToEdit.make) return;

                try {
                    const allMakes = await getVehicleMakes();
                    const found = allMakes.find(make =>
                        make.name.toLowerCase() === vehicleToEdit.make.toLowerCase());

                    if (found) {
                        setSelectedMake(found);
                    }
                } catch (err) {
                    console.error('Error finding make:', err);
                }
            };

            findMake().then(() => {});
        } else if (open) {
            // Reset form when adding new
            setFormData({
                make: '',
                model: '',
                year: new Date().getFullYear().toString(),
                registration: '',
                customer_id: '',
                last_service: format(new Date(), 'yyyy-MM-dd'),
                next_service_due: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'yyyy-MM-dd'),
                type: 'Car',
            });
            setSelectedMake(null);
        }
    }, [vehicleToEdit, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleDateChange = (name: string, date: Date | null) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                [name]: format(date, 'yyyy-MM-dd')
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            if (isEditMode && vehicleToEdit) {
                await updateVehicle(vehicleToEdit.uuid, {
                    ...formData,
                    year: parseInt(formData.year)
                });
            } else {
                await createVehicle({
                    ...formData,
                    year: parseInt(formData.year)
                });
            }

            onSaveSuccess();
            onClose();
        } catch (err: unknown) {
            console.error('Save error:', err);
            setError(err instanceof Error ? err.message : 'Failed to save vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                <Box sx={{mt: 2}}>
                    {/* Make and Model row */}
                    <Stack direction="row" spacing={2} sx={{mb: 2}}>
                        <Box sx={{flex: 1}}>
                            <Autocomplete
                                fullWidth
                                loading={isMakesLoading}
                                options={makes}
                                getOptionLabel={(option) => option.name}
                                value={selectedMake}
                                onChange={(_, newValue) => {
                                    setSelectedMake(newValue);
                                    setFormData(prev => ({
                                        ...prev,
                                        make: newValue?.name || '',
                                        model: ''
                                    }));
                                }}
                                onInputChange={(_, newInputValue) => {
                                    setMakeSearch(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Make"
                                        required
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isMakesLoading ?
                                                            <CircularProgress color="inherit" size={20}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={{flex: 1}}>
                            <Autocomplete
                                fullWidth
                                disabled={!selectedMake}
                                loading={isModelsLoading}
                                options={models}
                                getOptionLabel={(option) => option.name}
                                value={models.find(model => model.name === formData.model) || null}
                                onChange={(_, newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        model: newValue?.name || ''
                                    }));
                                }}
                                onInputChange={(_, newInputValue) => {
                                    setModelSearch(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Model"
                                        required
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isModelsLoading ?
                                                            <CircularProgress color="inherit" size={20}/> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </Stack>

                    {/* Year and Registration row */}
                    <Stack direction="row" spacing={2} sx={{mb: 2}}>
                        <Box sx={{flex: 1}}>
                            <TextField
                                name="year"
                                label="Year"
                                type="number"
                                value={formData.year}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                slotProps={{
                                    htmlInput: {min: 1900, max: new Date().getFullYear() + 1}
                                }}
                            />
                        </Box>
                        <Box sx={{flex: 1}}>
                            <TextField
                                name="registration"
                                label="Registration"
                                value={formData.registration}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Box>
                    </Stack>

                    {/* Customer and Vehicle Type row */}
                    <Stack direction="row" spacing={2} sx={{mb: 2}}>
                        <Box sx={{flex: 1}}>
                            <TextField
                                name="customer_id"
                                label="Customer"
                                select
                                value={formData.customer_id || ""}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            >
                                <MenuItem value="" disabled>Select Customer</MenuItem>
                                {customers.map(customer => (
                                    <MenuItem key={customer.uuid} value={customer.uuid}>
                                        {customer.first_name} {customer.last_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{flex: 1}}>
                            <TextField
                                name="type"
                                label="Vehicle Type"
                                select
                                value={formData.type}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            >
                                {VEHICLE_TYPES.map(type => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Stack>

                    {/* Service Dates row */}
                    <Stack direction="row" spacing={2}>
                        <Box sx={{flex: 1}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Last Service Date"
                                    value={new Date(formData.last_service)}
                                    onChange={(date) => handleDateChange('last_service', date as Date)}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box sx={{flex: 1}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Next Service Due"
                                    value={new Date(formData.next_service_due)}
                                    onChange={(date) => handleDateChange('next_service_due', date as Date)}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={loading || !formData.make || !formData.model || !formData.customer_id}
                >
                    {loading ? <CircularProgress size={24}/> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VehicleFormDialog;