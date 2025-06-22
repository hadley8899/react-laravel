import { api } from './api';

export interface DashboardOverview {
    total_users: number;
    active_users: number;
    revenue: number;
    completed_tasks: number;
    deltas: {
        total_users: number;
        active_users: number;
        revenue: number;
        completed_tasks: number;
    };
}

export interface Activity {
    id: string;
    type: string;
    description: string;
    amount: number | null;
    status: string;
    date_diff: string;        // "3 hours ago"
    user: { name: string; avatar: string | null };
}

export interface DashboardChartData {
    labels: string[];
    active_users: number[];
    new_signups: number[];
    revenue_by_source: Record<string, number>;
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
    const { data } = await api.get<{ data: DashboardOverview }>('/dashboard/overview');
    return data.data;
}

export async function getDashboardCharts(): Promise<DashboardChartData> {
    const { data } = await api.get<{ data: DashboardChartData }>('/dashboard/charts');
    return data.data;
}

export async function getDashboardActivities(): Promise<Activity[]> {
    const { data } = await api.get<{ data: Activity[] }>('/dashboard/activity');
    return data.data;
}