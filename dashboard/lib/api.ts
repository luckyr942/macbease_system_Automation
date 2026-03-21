const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'dev-key-macbease-2024';

export async function api<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

// Convenience methods
export const apiGet = <T = any>(endpoint: string) => api<T>(endpoint);
export const apiPost = <T = any>(endpoint: string, body: any) =>
    api<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = <T = any>(endpoint: string, body: any) =>
    api<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
export const apiPatch = <T = any>(endpoint: string, body?: any) =>
    api<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
export const apiDelete = <T = any>(endpoint: string) =>
    api<T>(endpoint, { method: 'DELETE' });

// ─── Type Definitions ────────────────────────────────────────

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin' | 'alumni';
    university: string;
    active: boolean;
    banned: boolean;
    lastActive?: string;
    createdAt: string;
}

export interface Community {
    _id: string;
    name: string;
    description: string;
    university: string;
    members: string[];
    moderators: { _id: string; name: string; email: string }[];
    category: string;
    active: boolean;
    createdAt: string;
}

export interface Campaign {
    _id: string;
    title: string;
    message: string;
    image?: string;
    audience: string;
    audienceFilter?: string;
    type: string;
    scheduledTime?: string;
    priority: string;
    status: string;
    sentCount: number;
    failedCount: number;
    createdAt: string;
}

export interface Event {
    _id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    maxParticipants: number;
    currentParticipants: number;
    ticketPrice: number;
    communityId?: string;
    status: string;
    createdAt: string;
}

export interface Notification {
    _id: string;
    title: string;
    message: string;
    userId: { _id: string; name: string; email: string } | string;
    type: string;
    status: string;
    sentAt?: string;
    createdAt: string;
}

export interface AutomationLog {
    _id: string;
    action: string;
    status: 'success' | 'error' | 'warning';
    details: string;
    meta?: Record<string, any>;
    timestamp: string;
}

export interface AdminRole {
    _id: string;
    userId: { _id: string; name: string; email: string };
    role: string;
    permissions: string[];
}

export interface TicketByEvent {
    _id: string;
    event: string;
    sold: number;
    total: number;
    price: number;
    revenue: number;
    remaining: number;
}

// ─── Analytics Overview ──────────────────────────────────────

export interface OverviewStats {
    totalUsers: number;
    students: number;
    teachers: number;
    alumni: number;
    communities: number;
    events: number;
    ticketsSold: number;
    notificationsSentToday: number;
    totalCampaigns: number;
}

export const fetchOverview = () => apiGet<OverviewStats>('/analytics/overview');

// ─── Users ───────────────────────────────────────────────────

export const fetchUsers = (params?: { role?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.role && params.role !== 'All') q.set('role', params.role);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', String(params.page));
    return apiGet<{ users: User[]; total: number; page: number; totalPages: number }>(`/users?${q}`);
};

export const fetchUserStats = () =>
    apiGet<{ total: number; students: number; teachers: number; alumni: number; admins: number; active: number; banned: number }>('/users/stats');

export const banUser = (id: string) => apiPatch(`/users/${id}/ban`);
export const unbanUser = (id: string) => apiPatch(`/users/${id}/unban`);

// ─── Communities ─────────────────────────────────────────────

export const fetchCommunities = (page = 1) =>
    apiGet<{ communities: Community[]; total: number }>(`/communities?page=${page}&limit=50`);

export const fetchCommunityStats = () =>
    apiGet<{ total: number; totalMembers: number; activeModerators: number }>('/communities/stats');

export const createCommunity = (data: any) => apiPost('/communities', data);
export const deleteCommunity = (id: string) => apiDelete(`/communities/${id}`);

// ─── Events ──────────────────────────────────────────────────

export const fetchEvents = (page = 1) =>
    apiGet<{ events: Event[]; total: number }>(`/events?page=${page}&limit=50`);

export const fetchEventStats = () =>
    apiGet<{ total: number; upcoming: number; live: number; completed: number }>('/events/stats/overview');

export const createEvent = (data: any) => apiPost('/events', data);
export const deleteEvent = (id: string) => apiDelete(`/events/${id}`);

// ─── Tickets ─────────────────────────────────────────────────

export const fetchTicketStats = () =>
    apiGet<{ totalTickets: number; totalRevenue: number; eventBreakdown: any[] }>('/tickets/stats');

export const fetchTicketsByEvent = () => apiGet<TicketByEvent[]>('/tickets/by-event');

// ─── Campaigns ───────────────────────────────────────────────

export const fetchCampaigns = (page = 1) =>
    apiGet<{ campaigns: Campaign[]; total: number }>(`/campaigns?page=${page}&limit=50`);

export const createCampaign = (data: any) => apiPost('/campaigns', data);
export const runCampaign = (id: string) => apiPost(`/campaigns/${id}/run`, {});

// ─── Notifications ───────────────────────────────────────────

export const fetchNotifications = (params?: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.page) q.set('page', String(params.page));
    return apiGet<{ notifications: Notification[]; total: number }>(`/notifications?${q}`);
};

export const fetchNotificationStats = () =>
    apiGet<{ sentToday: number; failedToday: number; pendingToday: number; deliveryRate: number }>('/notifications/stats');

export const sendNotification = (data: { title: string; message: string; audience: string; type?: string }) =>
    apiPost<{ sent: number }>('/notifications/send', data);

// ─── Analytics ───────────────────────────────────────────────

export const fetchUserGrowth = (days = 7) =>
    apiGet<{ date: string; count: number }[]>(`/analytics/growth?days=${days}`);

export const fetchEngagement = () =>
    apiGet<{ total: number; sent: number; failed: number; successRate: number }>('/analytics/engagement');

export const fetchRevenue = () =>
    apiGet<{ totalRevenue: number }>('/analytics/revenue');

// ─── Automation Logs ─────────────────────────────────────────

export const fetchLogs = (params?: { status?: string; action?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.action) q.set('action', params.action);
    if (params?.page) q.set('page', String(params.page));
    return apiGet<{ logs: AutomationLog[]; total: number }>(`/automation-logs?${q}`);
};

// ─── Admin Roles ─────────────────────────────────────────────

export const fetchAdminRoles = () => apiGet<AdminRole[]>('/admins');

export const updateAdminRole = (userId: string, role: string, permissions: string[]) =>
    apiPost('/admins/roles', { userId, role, permissions });

export const removeAdminRole = (userId: string) => apiDelete(`/admins/roles/${userId}`);
