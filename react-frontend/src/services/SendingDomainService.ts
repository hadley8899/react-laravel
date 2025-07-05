// services/SendingDomainService.ts
import { api } from './api';
import { SendingDomain } from '../interfaces/SendingDomain';

/* ---------- list all ---------- */
export async function getSendingDomains(): Promise<SendingDomain[]> {
    const { data } = await api.get<{ data: SendingDomain[] }>('/sending-domains');
    return data.data;
}

/* ---------- add ---------- */
export async function createSendingDomain(domain: string): Promise<SendingDomain> {
    const { data } = await api.post<{ data: SendingDomain }>('/sending-domains', { domain });
    return data.data;
}

/* ---------- verify ---------- */
export async function verifySendingDomain(uuid: string): Promise<SendingDomain> {
    const { data } = await api.post<{ data: SendingDomain }>(`/sending-domains/${uuid}/verify`);
    return data.data;
}

/* ---------- list only verified ---------- */
export async function getVerifiedSendingDomains(): Promise<SendingDomain[]> {
    const { data } = await api.get<{ data: SendingDomain[] }>('/sending-domains/verified');
    return data.data;
}

export async function getVerifiedFromAddresses() {
    const { data } = await api.get<{data:{uuid:string,email:string}[]}>('/from-addresses/verified');
    return data.data;
}
