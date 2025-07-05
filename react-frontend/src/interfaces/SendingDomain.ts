import { DnsRecord } from './DnsRecord';

export type SendingDomainState = 'pending' | 'active' | 'failed';

export interface SendingDomain {
    uuid: string;
    domain: string;
    state: SendingDomainState;
    dns_records: DnsRecord[];
    created_at: string;
}
