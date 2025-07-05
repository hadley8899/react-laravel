export interface DnsRecord {
    name: string | null;
    type: string;
    value: string;
    priority: string | null;
    valid: boolean;
}
