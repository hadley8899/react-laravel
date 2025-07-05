import React from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    InputAdornment,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import SearchIcon    from '@mui/icons-material/Search';
import CampaignIcon  from '@mui/icons-material/Campaign';
import RefreshIcon   from '@mui/icons-material/Refresh';

interface Props {
    searchInput:   string;
    onSearchChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
    statusFilter:  string;
    onStatusChange:(e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => void;
    onRefresh:     () => void;
}

const STATUS_OPTS = [
    { value: '',          label: 'All'       },
    { value: 'Queued',    label: 'Queued'    },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Sending',   label: 'Sending'   },
    { value: 'Sent',      label: 'Sent'      },
    { value: 'Failed',    label: 'Failed'    },
];

const CampaignsTopBar: React.FC<Props> = ({
                                              searchInput,
                                              onSearchChange,
                                              statusFilter,
                                              onStatusChange,
                                              onRefresh,
                                          }) => (
    <Box
        sx={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            flexWrap:       'wrap',
            gap:            2,
            mb:             3,
        }}
    >
        {/* ── Title ─────────────────────────────────────────────── */}
        <Typography
            variant="h5"
            fontWeight={600}
            sx={{ display: 'flex', alignItems: 'center' }}
        >
            <CampaignIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            Campaigns
        </Typography>

        {/* ── Actions row ───────────────────────────────────────── */}
        <Box
            sx={{
                display:        'flex',
                flexDirection:  { xs: 'column', sm: 'row' },
                gap:            1.5,
                alignItems:     { xs: 'stretch', sm: 'center' },
                width:          { xs: '100%', sm: 'auto' },
                flex:           1,
            }}
        >
            {/* Search */}
            <TextField
                size="small"
                placeholder="Search subject…"
                value={searchInput}
                onChange={onSearchChange}
                sx={{
                    minWidth: { xs: 0, sm: 220 },
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            {/* Status filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                    labelId="status-filter-label"
                    label="Status"
                    value={statusFilter}
                    onChange={onStatusChange}
                    displayEmpty
                    renderValue={(val) => {
                        const found = STATUS_OPTS.find(o => o.value === val);
                        return found ? found.label : 'All';
                    }}
                >
                    {STATUS_OPTS.map(o => (
                        <MenuItem key={o.value} value={o.value}>
                            {o.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Refresh */}
            <Button
                variant="outlined"
                size="medium"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                sx={{ borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
            >
                Refresh
            </Button>
        </Box>
    </Box>
);

export default CampaignsTopBar;
