import { api } from './api';
import { Campaign } from '../interfaces/Campaign';
import { PaginatedResponse } from '../interfaces/PaginatedResponse';

/* GET /campaigns */
export async function getCampaigns(
    page = 1,
    perPage = 10,
    search = '',
    status: string | null = null,
): Promise<PaginatedResponse<Campaign>> {
    const { data } = await api.get<PaginatedResponse<Campaign>>('/campaigns', {
        params: {
            page,
            per_page: perPage,
            search: search || undefined,
            status:   status || undefined,
        },
    });
    return data;
}

export async function getCampaign(uuid: string) {
    const { data } = await api.get<{ data: Campaign }>(`/campaigns/${uuid}`);
    return data.data;
}