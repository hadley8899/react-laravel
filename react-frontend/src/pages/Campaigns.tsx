import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
    Container,
    Paper,
    CircularProgress,
} from '@mui/material';
import CampaignsTopBar from '../components/campaigns/CampaignsTopBar';
import CampaignsTable from '../components/campaigns/CampaignsTable';
import { Campaign } from '../interfaces/Campaign';
import { getCampaigns } from '../services/CampaignService';

/* simple debounce */
function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

const Campaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* fetch */
    const fetchCampaigns = useCallback(async (showSpinner = true) => {
        if (showSpinner) setLoading(true);
        setError(null);
        try {
            const res = await getCampaigns(page + 1, rowsPerPage, debouncedSearch, statusFilter);
            setCampaigns(res.data);
            setTotal(res.meta.total);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load campaigns');
        } finally {
            if (showSpinner) setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearch, statusFilter]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    /* render */
    return (
        <MainLayout title="Campaigns">
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
                    <CampaignsTopBar
                        searchInput={search}
                        onSearchChange={e => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        statusFilter={statusFilter}
                        onStatusChange={e => {
                            setStatusFilter(e.target.value);
                            setPage(0);
                        }}
                        onRefresh={() => fetchCampaigns(false)}
                    />

                    {loading && campaigns.length === 0 ? (
                        <CircularProgress />
                    ) : (
                        <CampaignsTable
                            campaigns={campaigns}
                            loading={loading}
                            error={error}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            total={total}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            onRowsPerPageChange={e => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default Campaigns;
