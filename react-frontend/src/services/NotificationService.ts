export interface Notification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        message: string;
        link?: string; // Optional link
        action_text?: string; // Optional action text
        // Add other relevant data fields you expect from the backend
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedNotifications {
    current_page: number;
    data: Notification[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

const NotificationService = {
    getNotifications: async (page: number = 1): Promise<PaginatedNotifications> => {
        const response = await api.get<PaginatedNotifications>(`/notifications?page=${page}`);
        return response.data;
    },

    markAsRead: async (id: string): Promise<{ message: string }> => {
        const response = await api.patch<{ message: string }>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async (): Promise<{ message: string }> => {
        const response = await api.patch<{ message: string }>(`/notifications/read-all`);
        return response.data;
    },

    deleteNotification: async (id: string): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/notifications/${id}`);
        return response.data;
    }
};

export default NotificationService;

