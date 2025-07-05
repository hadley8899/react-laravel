import { api } from './api';
export async function getFromAddresses(domainUuid: string) {
    const { data } = await api.get<{data:any[]}>(`/sending-domains/${domainUuid}/from-addresses`);
    return data.data;
}
export async function createFromAddress(domainUuid: string, local_part: string, name?: string) {
    const { data } = await api.post<{data:any}>(`/sending-domains/${domainUuid}/from-addresses`, {local_part, name});
    return data.data;
}