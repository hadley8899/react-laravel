import {api} from './api';

export interface TemplateVariable {
    friendly_name: string;
    key: string;      // e.g. COMPANY_NAME / CUSTOMER.COUNT_OF_GOATS
    type: 'text' | 'image';
    scope: 'company' | 'customer';
}

export async function getTemplateVariables(): Promise<TemplateVariable[]> {
    const {data} = await api.get<{ data: TemplateVariable[] }>('/template-variables');
    return data.data;
}
