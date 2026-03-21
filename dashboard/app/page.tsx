'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/StatsCard';
import ActivityFeed from '@/components/ActivityFeed';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchOverview, fetchLogs, type OverviewStats, type AutomationLog } from '@/lib/api';
import { Users, GraduationCap, BookOpen, Award, Globe, Calendar, Ticket, Bell } from 'lucide-react';

const iconMap = [
    { key: 'totalUsers', icon: <Users size={22} />, label: 'Total Users', color: '#8b5cf6' },
    { key: 'students', icon: <GraduationCap size={22} />, label: 'Students', color: '#60a5fa' },
    { key: 'teachers', icon: <BookOpen size={22} />, label: 'Teachers', color: '#34d399' },
    { key: 'alumni', icon: <Award size={22} />, label: 'Alumni', color: '#fbbf24' },
    { key: 'communities', icon: <Globe size={22} />, label: 'Communities', color: '#f472b6' },
    { key: 'events', icon: <Calendar size={22} />, label: 'Events Running', color: '#fb923c' },
    { key: 'ticketsSold', icon: <Ticket size={22} />, label: 'Tickets Sold', color: '#a78bfa' },
    { key: 'notificationsSentToday', icon: <Bell size={22} />, label: 'Notifications Today', color: '#2dd4bf' },
];

const actionEmoji: Record<string, string> = {
    EMAIL_SENT: '📧', PUSH_SENT: '📢', EMAIL_FAILED: '⚠️', CAMPAIGN_CREATED: '✨',
    CAMPAIGN_STARTED: '🚀', USER_BANNED: '🚫', COMMUNITY_CREATED: '🏘️',
    EVENT_CREATED: '🎉', TICKET_SOLD: '🎟️', NOTIFICATION_SENT: '🔔',
};

const statusTypeMap: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
    success: 'success', error: 'error', warning: 'warning',
};

export default function DashboardPage() {
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [logs, setLogs] = useState<AutomationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([fetchOverview(), fetchLogs({ page: 1 })])
            .then(([ov, logResult]) => {
                setOverview(ov);
                setLogs(logResult.logs.slice(0, 8));
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const activities = logs.map((log) => ({
        icon: actionEmoji[log.action] || '📋',
        text: log.details,
        time: new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        type: statusTypeMap[log.status] || ('info' as const),
    }));

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Dashboard <span className="gradient-text">Overview</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                    Welcome back, Lucky! Here&apos;s what&apos;s happening with MacBease today.
                </p>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 20, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ Failed to load data: {error}. Make sure the backend is running on port 5000.</p>
                </div>
            )}

            {loading ? (
                <LoadingShimmer type="stats" />
            ) : overview ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                    {iconMap.map((item, i) => (
                        <StatsCard
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            value={(overview as any)[item.key] ?? 0}
                            trendUp={true}
                            color={item.color}
                            delay={i * 60}
                        />
                    ))}
                </div>
            ) : null}

            {loading ? <LoadingShimmer rows={6} /> : <ActivityFeed items={activities} />}
        </div>
    );
}
