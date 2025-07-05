import {api} from './api';
import {EmailTemplate} from '../interfaces/EmailTemplate';
import {EmailTemplateRevision} from '../interfaces/EmailTemplateRevision';
import {PaginatedResponse} from '../interfaces/PaginatedResponse';
import {EmailSectionTemplate} from "../interfaces/EmailSectionTemplate.ts";

export type CreateTemplatePayload = Pick<
    EmailTemplate,
    'name' | 'subject' | 'preview_text' | 'layout_json'
>;
export type UpdateTemplatePayload = Partial<CreateTemplatePayload>;

export async function getTemplates(params?: {
    page?: number;
    per_page?: number;
    search?: string;
}) {
    const {data} = await api.get<PaginatedResponse<EmailTemplate>>(
        '/templates',
        {params}
    );
    return data;
}

export async function getTemplate(uuid: string) {
    const {data} = await api.get<{ data: EmailTemplate }>(`/templates/${uuid}`);
    return data.data;
}

/** POST /templates */
export async function createTemplate(p: CreateTemplatePayload) {
    const {data} = await api.post<{ data: EmailTemplate }>('/templates', p);
    return data.data;
}

export async function updateTemplate(uuid: string, p: UpdateTemplatePayload) {
    const {data} = await api.put<{ data: EmailTemplate }>(`/templates/${uuid}`, p);
    return data.data;
}

export async function deleteTemplate(uuid: string) {
    await api.delete(`/templates/${uuid}`);
}

export async function duplicateTemplate(uuid: string) {
    const {data} = await api.post<EmailTemplate>(`/templates/${uuid}/duplicate`);
    return data;
}

export async function previewTemplate(uuid: string) {
    const {data} = await api.get<{ html: string; text: string }>(`/templates/${uuid}/preview`);
    return data;
}

export async function getTemplateRevisions(uuid: string) {
    const {data} = await api.get<EmailTemplateRevision[]>(
        `/templates/${uuid}/revisions`,
    );
    return data;
}

export async function restoreTemplateRevision(
    uuid: string,
    revisionUuid: number,
) {
    const {data} = await api.post<EmailTemplate>(
        `/templates/${uuid}/revisions/${revisionUuid}/restore`,
    );
    return data;
}

export async function getSectionTemplates(): Promise<EmailSectionTemplate[]> {
    const { data } = await api.get<{data: EmailSectionTemplate[]}>('/section-templates');
    return data.data;
}

// Fetch all tags for the current company
export async function getTags() {
    const { data } = await api.get<{ data: any[] }>('/tags');
    return data.data;
}

// Get the count of customers matching a set of tag UUIDs
export async function getCustomerCountByTags(tagUuids: string[]) {
    const { data } = await api.post<{ count: number }>('/customers/count-by-tags', {
        tags: tagUuids,
    });
    return data.count;
}

interface SendCampaignResp {
    uuid: string;
}

export async function sendCampaign(payload: {
    template_uuid: string;
    subject: string;
    preheader_text: string;
    from_address_uuid: string;
    reply_to: string | null;
    tag_uuids: string[];
    scheduled_at?: string | null;
}) {
    const { data } = await api.post<{ data: SendCampaignResp }>('/campaigns', payload);
    return data.data;
}
