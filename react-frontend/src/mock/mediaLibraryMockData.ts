import dayjs from 'dayjs';
import type { Directory, MediaItem } from '../pages/MediaLibrary.tsx';

/** ─────────────────────────────────────────────────────────────────────────
 *  DIRECTORY MOCK (infinite depth via parentId)
 *  parentId === null ➜ root level
 *  ──────────────────────────────────────────────────────────────────────── */
export const directoriesMock: Directory[] = [
    { id: 'root', name: 'Root', parentId: null },
    { id: 'marketing', name: 'Marketing', parentId: 'root' },
    { id: 'social', name: 'Social', parentId: 'marketing' },
    { id: 'vehicles', name: 'Vehicles', parentId: 'root' },
    { id: 'vehicles2025', name: '2025', parentId: 'vehicles' },
    { id: 'staff', name: 'Staff', parentId: 'root' },
];

/** ─── ORIGINAL SEED ───────────────────────────────────────────────────── */
const originalItems: MediaItem[] = [
    {
        id: '1',
        directoryId: 'root',
        url: 'https://picsum.photos/id/1011/600/400',
        filename: 'mountain.jpg',
        name: 'Mountain',
        sizeKb: 320,
        createdAt: dayjs().subtract(1, 'day').toISOString(),
    },
    {
        id: '2',
        directoryId: 'marketing',
        url: 'https://picsum.photos/id/1025/600/400',
        filename: 'doggo.jpg',
        name: 'Doggo',
        sizeKb: 280,
        createdAt: dayjs().subtract(2, 'day').toISOString(),
    },
    {
        id: '3',
        directoryId: 'root',
        url: 'https://picsum.photos/id/1005/600/400',
        filename: 'forest.jpg',
        name: 'Forest',
        sizeKb: 410,
        createdAt: dayjs().subtract(7, 'day').toISOString(),
    },
];

/** ─── MASS GENERATOR ──────────────────────────────────────────────────── */
const generateRandomItems = (count: number): MediaItem[] => {
    const items: MediaItem[] = [];
    const fileTypes = ['jpg', 'png', 'gif'];
    const adjectives = [
        'Beautiful',
        'Amazing',
        'Stunning',
        'Gorgeous',
        'Professional',
        'Excellent',
    ];
    const nouns = [
        'Sunset',
        'Mountain',
        'Car',
        'Workshop',
        'Team',
        'Office',
        'Logo',
        'Brochure',
        'Vehicle',
    ];

    for (let i = 0; i < count; i++) {
        const id = (i + 4).toString();
        const dir = directoriesMock[Math.floor(Math.random() * directoriesMock.length)];
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
            nouns[Math.floor(Math.random() * nouns.length)]
        }`;
        const filename = `file_${id}.${fileType}`;
        const picsumId = Math.floor(Math.random() * 1000) + 1;

        items.push({
            id,
            directoryId: dir.id,
            url: `https://picsum.photos/id/${picsumId}/600/400`,
            filename,
            name,
            sizeKb: Math.floor(Math.random() * 5000) + 100,
            createdAt: dayjs()
                .subtract(Math.floor(Math.random() * 30) + 1, 'day')
                .toISOString(),
        });
    }

    return items;
};

/** ─── EXPORT ALL ITEMS ────────────────────────────────────────────────── */
export const itemsMock: MediaItem[] = [...originalItems, ...generateRandomItems(197)];
