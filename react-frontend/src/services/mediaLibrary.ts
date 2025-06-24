import {api} from './api';
import {PaginatedResponse} from '../interfaces/PaginatedResponse.ts';
import {MediaDirectory} from "../interfaces/MediaDirectory.ts";
import {MediaAsset} from "../interfaces/MediaAsset.ts";

export type CreateDirectoryPayload = {
    name: string;
    parent_uuid?: string | null;
};

export type UpdateDirectoryPayload = Partial<CreateDirectoryPayload>;

export type UploadAssetPayload = {
    file: File;
    directory_uuid?: string | null;
    alt?: string | null;
};

export type UpdateAssetPayload = {
    alt?: string | null;
    directory_uuid?: string | null;
};

export async function getDirectories() {
    const {data} = await api.get<{ data: MediaDirectory[] }>('/media/directories');
    return data.data;
}

export async function createDirectory(p: CreateDirectoryPayload): Promise<MediaDirectory> {
    const {data} = await api.post<{ data: MediaDirectory }>('/media/directories', p);
    return data.data;
}

export async function updateDirectory(uuid: string, p: UpdateDirectoryPayload) {
    const {data} = await api.patch<MediaDirectory>(
        `/media/directories/${uuid}`,
        p,
    );
    return data;
}

export async function deleteDirectory(uuid: string) {
    await api.delete(`/media/directories/${uuid}`);
}

export async function getAssets(params: {
    directory_uuid?: string | null;
    search?: string;
    page?: number;
    per_page?: number;
}) {
    const {data} = await api.get<PaginatedResponse<MediaAsset>>(
        '/media/assets',
        {
            params: {
                directory_uuid: params.directory_uuid ?? undefined,
                search: params.search ?? undefined,
                page: params.page ?? 1,
                per_page: params.per_page ?? 40,
            },
        },
    );
    return data;
}

export async function uploadAsset(p: UploadAssetPayload): Promise<MediaAsset> {
    const form = new FormData();
    form.append('file', p.file);
    form.append('directory_uuid', p.directory_uuid ? p.directory_uuid : '');
    if (p.alt) form.append('alt', p.alt);

    const {data} = await api.post<{ data: MediaAsset }>('/media/assets', form, {
        headers: {'Content-Type': 'multipart/form-data'},
    });

    return data.data;
}

export async function updateAsset(uuid: string, p: UpdateAssetPayload) {
    const {data} = await api.patch<MediaAsset>(`/media/assets/${uuid}`, p);
    return data;
}

export async function deleteAsset(uuid: string) {
    await api.delete(`/media/assets/${uuid}`);
}

export async function restoreAsset(uuid: string) {
    const {data} = await api.post<MediaAsset>(
        `/media/assets/${uuid}/restore`,
    );
    return data;
}
