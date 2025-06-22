import {api} from './api';
import {Tag} from '../interfaces/Tag';
import {Customer} from '../interfaces/Customer';   // assuming you already have this

/* ---------- payload types ---------- */
export type CreateTagPayload = {
    name: string;
    color?: string | null;
};

export type UpdateTagPayload = Partial<CreateTagPayload>;

/* ---------- API calls ---------- */

/** Return **all** tags belonging to the authenticated user’s company */
export async function getTags() {
    const {data} = await api.get<{ data: Tag[] }>('/tags');
    return data.data; // ← just the array
}

/** Create a new tag */
export async function createTag(payload: CreateTagPayload) {
    const {data} = await api.post<{ data: Tag }>('/tags', payload);
    return data.data;
}

/** Update an existing tag */
export async function updateTag(uuid: string, payload: UpdateTagPayload) {
    const {data} = await api.put<{ data: Tag }>(`/tags/${uuid}`, payload);
    return data.data;
}

/** Delete a tag */
export async function deleteTag(uuid: string) {
    await api.delete(`/tags/${uuid}`);
}

/** Get a list of customers who have **one specific tag** */
export async function getCustomersByTag(tagUuid: string) {
    const {data} = await api.get<{ data: Customer[] }>(`/tags/${tagUuid}/customers`);
    return data.data;
}

/**
 * Attach / detatch tags in one go.
 * Pass the *entire* array of tag IDs that should remain on the customer.
 * The backend will sync them.
 */
export async function syncCustomerTags(customerUuid: string, tagIds: string[]) {
    const {data} = await api.post<{ customer: Customer }>(
        `/customers/${customerUuid}/tags`,
        {tag_ids: tagIds},
    );
    return data.customer;
}
