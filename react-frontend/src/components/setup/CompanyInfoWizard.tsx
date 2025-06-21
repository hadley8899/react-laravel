import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Stack,
    Avatar,
    Button,
    IconButton,
    TextField,
    MenuItem,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    Language as LanguageIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    Info as InfoIcon,
} from '@mui/icons-material';

import Autocomplete from '@mui/material/Autocomplete';
import {Company} from '../../interfaces/Company';

type Units = 'metric' | 'imperial';

interface CompanyInfoWizardProps {
    company: Company | null;
    setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

/* ------------------------------------------------------------------ */
/* ------------------------- form sections -------------------------- */
/* ------------------------------------------------------------------ */

const ContactSection: React.FC<CompanyInfoWizardProps> = ({company, setCompany}) => {
    const [phone, setPhone] = useState(company?.phone ?? '');
    const [country, setCountry] = useState(company?.country ?? '');
    const [address, setAddress] = useState(company?.address ?? '');
    const [billing, setBilling] = useState(company?.billing_address ?? '');

    // propagate changes upward immediately
    const onChange = (field: keyof Company, value: any) =>
        setCompany(c => (c ? {...c, [field]: value} as Company : c));

    return (
        <Grid container spacing={3}>
            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    fullWidth
                    label="Phone"
                    value={phone}
                    onChange={e => {
                        setPhone(e.target.value);
                        onChange('phone', e.target.value);
                    }}
                    slotProps={{
                        input: {startAdornment: <PhoneIcon color="action" sx={{mr: 1}}/>}
                    }}
                />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    fullWidth
                    label="Country"
                    value={country}
                    onChange={e => {
                        setCountry(e.target.value);
                        onChange('country', e.target.value);
                    }}
                    slotProps={{
                        input: {startAdornment: <LocationOnIcon color="action" sx={{mr: 1}}/>}
                    }}
                />
            </Grid>
            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Address"
                    value={address}
                    onChange={e => {
                        setAddress(e.target.value);
                        onChange('address', e.target.value);
                    }}
                />
            </Grid>
            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Billing Address"
                    value={billing}
                    onChange={e => {
                        setBilling(e.target.value);
                        onChange('billing_address', e.target.value);
                    }}
                />
            </Grid>
        </Grid>
    );
};

const BusinessSection: React.FC<CompanyInfoWizardProps> = ({company, setCompany}) => {
    const currencies = ['GBP', 'USD', 'EUR', 'AUD', 'CAD', 'NZD'];

    const [taxId, setTaxId] = useState(company?.tax_id ?? '');
    const [regNum, setRegNum] = useState(company?.registration_number ?? '');
    const [industry, setIndustry] = useState(company?.industry ?? '');
    const [currency, setCurrency] = useState(company?.currency ?? '');

    const onChange = (field: keyof Company, value: any) =>
        setCompany(c => (c ? {...c, [field]: value} as Company : c));

    return (
        <Grid container spacing={3}>
            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    fullWidth
                    label="Tax ID"
                    value={taxId}
                    onChange={e => {
                        setTaxId(e.target.value);
                        onChange('tax_id', e.target.value);
                    }}
                />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    fullWidth
                    label="Registration #"
                    value={regNum}
                    onChange={e => {
                        setRegNum(e.target.value);
                        onChange('registration_number', e.target.value);
                    }}
                />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    fullWidth
                    label="Industry"
                    value={industry}
                    onChange={e => {
                        setIndustry(e.target.value);
                        onChange('industry', e.target.value);
                    }}
                />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    select
                    fullWidth
                    label="Currency"
                    value={currency}
                    onChange={e => {
                        setCurrency(e.target.value);
                        onChange('currency', e.target.value);
                    }}
                >
                    {currencies.map(c => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
    );
};

const PreferencesSection: React.FC<CompanyInfoWizardProps> = ({company, setCompany}) => {
    const timezones: string[] =
        (Intl as any).supportedValuesOf?.('timeZone') ?? ['UTC', 'Europe/London', 'America/New_York'];

    const locales = [
        {code: 'en-GB', label: 'English (UK)'},
        {code: 'en-US', label: 'English (US)'},
        {code: 'fr-FR', label: 'Français'},
    ];

    const units: Units[] = ['metric', 'imperial'];

    const [timezone, setTimezone] = useState(company?.timezone ?? '');
    const [locale, setLocale] = useState(company?.locale ?? '');
    const [unitsPref, setUnitsPref] = useState<Units>((company?.default_units as Units) ?? 'metric');
    const [notes, setNotes] = useState(company?.notes ?? '');

    const onChange = (field: keyof Company, value: any) =>
        setCompany(c => (c ? {...c, [field]: value} as Company : c));

    return (
        <Grid container spacing={3}>
            <Grid size={{xs: 12, md: 4}}>
                <Autocomplete
                    options={timezones}
                    value={timezone}
                    onChange={(_, v) => {
                        setTimezone(v ?? '');
                        onChange('timezone', v ?? '');
                    }}
                    renderInput={params => <TextField {...params} label="Timezone" fullWidth/>}
                />
            </Grid>

            <Grid size={{xs: 12, md: 4}}>
                <Autocomplete
                    options={locales}
                    autoHighlight
                    getOptionLabel={opt => (typeof opt === 'string' ? opt : opt.label)}
                    value={locales.find(l => l.code === locale) ?? null}
                    onChange={(_, v) => {
                        const code = v ? (v as any).code : '';
                        setLocale(code);
                        onChange('locale', code);
                    }}
                    renderInput={params => <TextField {...params} label="Locale" fullWidth/>}
                />
            </Grid>

            <Grid size={{xs: 12, md: 4}}>
                <TextField
                    select
                    fullWidth
                    label="Default Units"
                    value={unitsPref}
                    onChange={e => {
                        setUnitsPref(e.target.value as Units);
                        onChange('default_units', e.target.value);
                    }}
                >
                    {units.map(u => (
                        <MenuItem key={u} value={u}>
                            {u}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Internal Notes"
                    value={notes}
                    onChange={e => {
                        setNotes(e.target.value);
                        onChange('notes', e.target.value);
                    }}
                />
            </Grid>

            <Grid size={{xs: 12}}>
                <Typography variant="caption" color="text.secondary" sx={{display: 'flex', alignItems: 'center'}}>
                    <InfoIcon sx={{fontSize: 16, mr: 0.5}}/> These preferences control how dates, currency and
                    measurements are formatted throughout the app.
                </Typography>
            </Grid>
        </Grid>
    );
};

/* ------------------------------------------------------------------ */
/* ---------------------- main wizard component --------------------- */
/* ------------------------------------------------------------------ */

const CompanyInfoWizard: React.FC<CompanyInfoWizardProps> = ({company, setCompany}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const fileRef = useRef<HTMLInputElement>(null);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [name, setName] = useState(company?.name ?? '');
    const [slug, setSlug] = useState(company?.slug ?? '');
    const [email, setEmail] = useState(company?.email ?? '');
    const [website, setWebsite] = useState(company?.website ?? '');

    // Validation state
    const [errors, setErrors] = useState({
        name: '',
        slug: '',
        email: '',
        website: '',
    });

    // Propagate header field changes immediately
    const update = (field: keyof Company, value: any) =>
        setCompany(c => (c ? {...c, [field]: value} as Company : c));

    useEffect(() => {
        // keep local state in sync if parent resets company
        if (company) {
            setName(company.name ?? '');
            setSlug(company.slug ?? '');
            setEmail(company.email ?? '');
            setWebsite(company.website ?? '');
        }
    }, [company]);

    // Validation logic
    const validateField = (field: string, value: string) => {
        switch (field) {
            case 'name':
                if (!value) return 'Company name is required';
                if (!maxLength(value, 255)) return 'Max 255 characters';
                return '';
            case 'slug':
                if (!value) return 'Slug is required';
                if (!validateSlug(value)) return 'Only letters, numbers, and dashes allowed';
                if (!maxLength(value, 255)) return 'Max 255 characters';
                return '';
            case 'email':
                if (!value) return 'Email is required';
                if (!validateEmail(value)) return 'Invalid email address';
                if (!maxLength(value, 255)) return 'Max 255 characters';
                return '';
            case 'website':
                if (value && !validateUrl(value)) return 'Invalid website URL';
                if (!maxLength(value, 255)) return 'Max 255 characters';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (field: keyof typeof errors, value: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: validateField(field, value)
        }));
    };

    const handleChange = (field: keyof typeof errors, value: string, setter: (v: string) => void) => {
        setter(value);
        update(field as keyof Company, value);
        // Live validation
        setErrors(prev => ({
            ...prev,
            [field]: prev[field] ? validateField(field, value) : ''
        }));
    };

    const pickLogo = () => fileRef.current?.click();
    const removeLogo = () => setLogoFile(null);
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        e.target.files?.[0] && setLogoFile(e.target.files[0]);

    const logoUrl = logoFile ? URL.createObjectURL(logoFile) : company?.logo_url ?? '';

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <BusinessIcon color="primary"/>
                <Typography variant="h6">Company Information</Typography>
            </Stack>
            <Paper variant="outlined" sx={{borderRadius: 2, overflow: 'hidden', mb: 3, p: { xs: 2, sm: 3 }}}>
                {/* ------- Header / basic info ------- */}
                <Box
                    sx={{
                        // Remove background color and borderBottom for consistency
                        p: 0,
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        {/* logo + upload */}
                        <Grid size={{xs: 12, md: 4}}>
                            <Stack spacing={2} alignItems={isMobile ? 'center' : {xs: 'center', md: 'flex-start'}}>
                                <Avatar src={logoUrl} sx={{width: 100, height: 100, boxShadow: 3}}>
                                    {name.charAt(0)}
                                </Avatar>

                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" size="small" startIcon={<CloudUploadIcon/>}
                                            onClick={pickLogo}>
                                        {logoFile ? 'Change' : 'Upload'} Logo
                                    </Button>
                                    {(logoUrl || logoFile) && (
                                        <IconButton size="small" color="error" onClick={removeLogo}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                </Stack>
                                <input hidden type="file" ref={fileRef} accept="image/*" onChange={fileChange}/>
                            </Stack>
                        </Grid>

                        {/* basic fields */}
                        <Grid size={{xs: 12, md: 8}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Company Name"
                                        required
                                        fullWidth
                                        value={name}
                                        onChange={e => handleChange('name', e.target.value, setName)}
                                        onBlur={e => handleBlur('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Slug"
                                        required
                                        fullWidth
                                        value={slug}
                                        onChange={e => handleChange('slug', e.target.value, setSlug)}
                                        onBlur={e => handleBlur('slug', e.target.value)}
                                        error={!!errors.slug}
                                        helperText={errors.slug}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Email"
                                        required
                                        type="email"
                                        fullWidth
                                        value={email}
                                        onChange={e => handleChange('email', e.target.value, setEmail)}
                                        onBlur={e => handleBlur('email', e.target.value)}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        slotProps={{
                                            input: {startAdornment: <EmailIcon color="action" sx={{mr: 1}}/>}
                                        }}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Website"
                                        fullWidth
                                        value={website}
                                        onChange={e => handleChange('website', e.target.value, setWebsite)}
                                        onBlur={e => handleBlur('website', e.target.value)}
                                        error={!!errors.website}
                                        helperText={errors.website}
                                        slotProps={{
                                            input: {startAdornment: <LanguageIcon color="action" sx={{mr: 1}}/>}
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Contact Details */}
            <Paper variant="outlined" sx={{borderRadius: 2, p: { xs: 2, sm: 3 }, mb: 3}}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <PhoneIcon color="primary"/>
                    <Typography variant="subtitle1" fontWeight="bold">Contact Details</Typography>
                </Stack>
                <ContactSection company={company} setCompany={setCompany}/>
            </Paper>

            {/* Business Details */}
            <Paper variant="outlined" sx={{borderRadius: 2, p: { xs: 2, sm: 3 }, mb: 3}}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <BusinessIcon color="primary"/>
                    <Typography variant="subtitle1" fontWeight="bold">Business Details</Typography>
                </Stack>
                <BusinessSection company={company} setCompany={setCompany}/>
            </Paper>

            {/* Preferences */}
            <Paper variant="outlined" sx={{borderRadius: 2, p: { xs: 2, sm: 3 }}}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <InfoIcon color="primary"/>
                    <Typography variant="subtitle1" fontWeight="bold">Preferences</Typography>
                </Stack>
                <PreferencesSection company={company} setCompany={setCompany}/>
            </Paper>
        </Box>
    );
};

export default CompanyInfoWizard;

// Validation helpers
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateSlug = (slug: string) =>
    /^[A-Za-z0-9-]+$/.test(slug);

const validateUrl = (url: string) =>
    !url || /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(url);

const maxLength = (val: string, max: number) =>
    !val || val.length <= max;

