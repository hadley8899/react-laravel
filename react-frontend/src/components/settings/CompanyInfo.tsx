import React, {useEffect, useRef, useState} from 'react';
import {
    Box, Paper, Stack, TextField, Typography, Button, Grid,
    Avatar, CircularProgress, Alert, Tabs, Tab,
    IconButton, alpha, useTheme, MenuItem
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    LocationOn as LocationOnIcon,
    Info as InfoIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import {Company} from '../../interfaces/Company';
import {updateCompany} from '../../services/CompanyService';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {DATE_FORMAT} from '../../services/DateService.ts';
import {format} from 'date-fns';
import {useNotifier} from "../../context/NotificationContext.tsx";
import {hasPermission} from "../../services/AuthService.ts";

const currencies = ['GBP', 'USD', 'EUR', 'AUD', 'CAD', 'NZD'];
const units = ['metric', 'imperial'] as const;
const plans = ['Free', 'Pro', 'Enterprise'];
const statuses = ['Active', 'Inactive', 'Pending'];

type Units = typeof units[number];

interface CompanyInfoProps {
    company: Company | null;
    setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({company, setCompany}) => {
    const theme = useTheme();
    const fileRef = useRef<HTMLInputElement>(null);
    const [tab, setTab] = useState(0);
    const {showNotification} = useNotifier();

    const [logoFile, setLogoFile] = useState<File | null>(null);

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');
    const [billing, setBilling] = useState('');
    const [country, setCountry] = useState('');
    const [status, setStatus] = useState<Company['status']>('Active');

    // business
    const [taxId, setTaxId] = useState('');
    const [regNum, setRegNum] = useState('');
    const [industry, setIndustry] = useState('');
    const [currency, setCurrency] = useState('');
    const [plan, setPlan] = useState<string>('Free');
    const [trialEnds, setTrialEnds] = useState('');
    const [activeUntil, setActiveUntil] = useState('');

    // prefs
    const [timezone, setTimezone] = useState('');
    const [locale, setLocale] = useState('');
    const [unitsPref, setUnitsPref] = useState<Units>('metric');
    const [notes, setNotes] = useState('');

    // ui
    const [loading, setLoad] = useState(true);
    const [saving, setSave] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const timezones: string[] =
        (Intl as any).supportedValuesOf?.('timeZone') ?? [
            'UTC', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
            'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
            'Asia/Tokyo', 'Asia/Hong_Kong', 'Asia/Singapore', 'Australia/Sydney',
        ];

    const locales = [
        {code: 'en-GB', label: 'English (United Kingdom)'},
        {code: 'en-US', label: 'English (United States)'},
        {code: 'fr-FR', label: 'Français (France)'},
        {code: 'de-DE', label: 'Deutsch (Deutschland)'},
        {code: 'es-ES', label: 'Español (España)'},
        {code: 'it-IT', label: 'Italiano (Italia)'},
        {code: 'nl-NL', label: 'Nederlands (Nederland)'},
    ];

    // Add permission check
    const canEditPlanSettings = hasPermission('update_company_plan_settings');

    const initialise = (c: Company) => {
        setCompany(c);
        setName(c.name ?? '');
        setSlug(c.slug ?? '');
        setEmail(c.email ?? '');
        setPhone(c.phone ?? '');
        setWebsite(c.website ?? '');
        setAddress(c.address ?? '');
        setBilling(c.billing_address ?? '');
        setCountry(c.country ?? '');
        setStatus(c.status);
        setTaxId(c.tax_id ?? '');
        setRegNum(c.registration_number ?? '');
        setIndustry(c.industry ?? '');
        setCurrency(c.currency ?? '');
        setPlan(c.plan ?? 'Free');
        setTrialEnds(c.trial_ends_at ?? '');
        setActiveUntil(c.active_until ?? '');
        setTimezone(c.timezone ?? '');
        setLocale(c.locale ?? '');
        setUnitsPref((c.default_units ?? 'metric') as Units);
        setNotes(c.notes ?? '');
    };

    useEffect(() => {
        if (company) {
            initialise(company);
            setLoad(false);
        } else {
            setLoad(true);
        }
    }, [company]);

    const pickLogo = () => fileRef.current?.click();
    const removeLogo = () => setLogoFile(null);
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        e.target.files?.[0] && setLogoFile(e.target.files[0]);

    const handleSave = async () => {
        if (!company) return;
        try {
            setSave(true);
            setError(null);

            const payload: Record<string, any> = {
                name, slug, email, phone, website, address, billing_address: billing,
                country, status, tax_id: taxId, registration_number: regNum,
                industry, currency, plan, trial_ends_at: trialEnds || null,
                active_until: activeUntil || null, timezone, locale,
                default_units: unitsPref, notes
            };
            if (logoFile) payload.logo = logoFile;

            const updated = await updateCompany(company.uuid, payload);
            setCompany(updated);
            setLogoFile(null);

            showNotification('Company information saved successfully!', 'success');
        } catch (e: any) {
            setError(e.message ?? 'Save failed');
        } finally {
            setSave(false);
        }
    };

    function handleTrialEndsChange(value: Date | null): void {
        if (value) {
            setTrialEnds(format(value as Date, 'yyyy-MM-dd'));
        } else {
            setTrialEnds('');
        }
    }

    function handleActiveUntilChange(value: Date | null): void {
        if (value) {
            setActiveUntil(format(value as Date, 'yyyy-MM-dd'));
        } else {
            setActiveUntil('');
        }
    }

    const logoUrl = logoFile
        ? URL.createObjectURL(logoFile)
        : company?.logo_url ?? '';

    /* ---------- render ---------- */
    if (loading)
        return (
            <Paper variant="outlined" sx={{p: 4, textAlign: 'center', mb: 6}}>
                <CircularProgress/>
            </Paper>
        );

    return (
        <Box mb={6}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <BusinessIcon color="primary"/><Typography variant="h6">Company Information</Typography>
            </Stack>
            <Paper variant="outlined" sx={{borderRadius: 2, overflow: 'hidden'}}>
                {error && <Alert severity="error">{error}</Alert>}

                {/* --- header / logo --- */}
                <Box
                    sx={{
                        p: 3,
                        bgcolor: alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.08 : 0.12),
                        borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{xs: 12, md: 4}}>
                            <Stack spacing={2} alignItems={{xs: 'center', md: 'flex-start'}}>
                                <Avatar src={logoUrl} sx={{width: 100, height: 100, boxShadow: 3}}>
                                    {name.charAt(0)}
                                </Avatar>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" size="small" startIcon={<CloudUploadIcon/>}
                                            onClick={pickLogo}>
                                        {logoFile ? 'Change' : 'Upload'} Logo
                                    </Button>
                                    {(logoUrl || logoFile) && (
                                        <IconButton size="small" color="error"
                                                    onClick={removeLogo}><DeleteIcon/></IconButton>
                                    )}
                                </Stack>
                                <input hidden type="file" ref={fileRef} accept="image/*" onChange={fileChange}/>
                            </Stack>
                        </Grid>

                        <Grid size={{xs: 12, md: 8}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField label="Company Name" required fullWidth value={name}
                                               onChange={e => setName(e.target.value)}/>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField label="Slug" fullWidth value={slug}
                                               onChange={e => setSlug(e.target.value)}/>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Email" type="email" fullWidth required value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        slotProps={{
                                            input: {startAdornment: <EmailIcon color="action" sx={{mr: 1}}/>}
                                        }}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Website" fullWidth value={website}
                                        onChange={e => setWebsite(e.target.value)}
                                        slotProps={{
                                            input: {startAdornment: <LanguageIcon color="action" sx={{mr: 1}}/>}
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                {/* --- tabs --- */}
                <Box px={3} pt={2}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
                        <Tab label="Contact"/>
                        <Tab label="Business"/>
                        <Tab label="Preferences"/>
                    </Tabs>

                    {/* ---- CONTACT ---- */}
                    {tab === 0 && (
                        <Box pt={3}>
                            <Grid container spacing={3}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Phone" fullWidth value={phone} onChange={e => setPhone(e.target.value)}
                                        slotProps={{
                                            input: {startAdornment: <PhoneIcon color="action" sx={{mr: 1}}/>}
                                        }}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        label="Country" fullWidth value={country}
                                        onChange={e => setCountry(e.target.value)}
                                        slotProps={{
                                            input: {startAdornment: <LocationOnIcon color="action" sx={{mr: 1}}/>}
                                        }}
                                    />
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <TextField
                                        label="Address" fullWidth multiline rows={2}
                                        value={address} onChange={e => setAddress(e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{xs: 12}} sx={{mb: 2}}>
                                    <TextField
                                        label="Billing Address" fullWidth multiline rows={2}
                                        value={billing} onChange={e => setBilling(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* ---- BUSINESS ---- */}
                    {tab === 1 && (
                        <Box pt={3}>
                            <Grid container spacing={3} sx={{mb: 3}}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField label="Tax ID" fullWidth value={taxId}
                                               onChange={e => setTaxId(e.target.value)}/>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField label="Registration #" fullWidth value={regNum}
                                               onChange={e => setRegNum(e.target.value)}/>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField label="Industry" fullWidth value={industry}
                                               onChange={e => setIndustry(e.target.value)}/>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        select label="Currency" fullWidth value={currency}
                                        onChange={e => setCurrency(e.target.value)}
                                    >
                                        {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        select label="Status" fullWidth value={status}
                                        onChange={e => setStatus(e.target.value as any)}
                                        disabled={!canEditPlanSettings}
                                    >
                                        {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextField
                                        select label="Plan" fullWidth value={plan}
                                        onChange={e => setPlan(e.target.value)}
                                        disabled={!canEditPlanSettings}
                                    >
                                        {plans.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Trial Ends"
                                            value={new Date(trialEnds)}
                                            onChange={(date) => handleTrialEndsChange(date as Date | null)}
                                            slotProps={{textField: {fullWidth: true, disabled: !canEditPlanSettings}}}
                                            format={DATE_FORMAT}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Active Until"
                                            value={new Date(activeUntil)}
                                            onChange={(date) => handleActiveUntilChange(date as Date)}
                                            slotProps={{textField: {fullWidth: true, disabled: !canEditPlanSettings}}}
                                            format={DATE_FORMAT}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* ---- PREFERENCES ---- */}
                    {tab === 2 && (
                        <Box pt={3}>
                            <Grid container spacing={3}>

                                {/* Timezone */}
                                <Grid size={{xs: 12, md: 4}}>
                                    <Autocomplete
                                        options={timezones}
                                        value={timezone}
                                        onChange={(_, v) => setTimezone(v ?? '')}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Timezone" fullWidth/>
                                        )}
                                    />
                                </Grid>

                                {/* Locale */}
                                <Grid size={{xs: 12, md: 4}}>
                                    <Autocomplete
                                        options={locales}
                                        autoHighlight
                                        getOptionLabel={(opt) => typeof opt === 'string' ? opt : opt.label}
                                        value={locales.find(l => l.code === locale) ?? null}
                                        onChange={(_, v) => setLocale(v ? (v as any).code : '')}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Locale" fullWidth/>
                                        )}
                                    />
                                </Grid>

                                {/* Units (unchanged) */}
                                <Grid size={{xs: 12, md: 4}}>
                                    <TextField
                                        select label="Default Units" fullWidth
                                        value={unitsPref}
                                        onChange={e => setUnitsPref(e.target.value as Units)}
                                    >
                                        {units.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                                    </TextField>
                                </Grid>

                                {/* Notes (unchanged) */}
                                <Grid size={{xs: 12}}>
                                    <TextField
                                        label="Internal Notes" fullWidth multiline rows={3}
                                        value={notes} onChange={e => setNotes(e.target.value)}
                                    />
                                </Grid>

                                <Grid size={{xs: 12}} sx={{mb: 3}}>
                                    <Alert severity="info" icon={<InfoIcon/>}>
                                        These preferences control how dates, currency and measurements are formatted
                                        throughout the app.
                                    </Alert>
                                </Grid>

                            </Grid>
                        </Box>
                    )}
                </Box>

                {/* --- SAVE --- */}
                <Box sx={{p: 3, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'right'}}>
                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20}/> : <SaveIcon/>}
                        disabled={saving}
                        onClick={handleSave}
                    >
                        {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CompanyInfo;
