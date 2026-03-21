'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Globe, Users, BarChart3 } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchOverview, fetchUserGrowth, fetchEngagement, type OverviewStats } from '@/lib/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, Legend,
    ResponsiveContainer,
} from 'recharts';

const DONUT_COLORS = ['#f87171', '#34d399', '#fbbf24', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--mb-bg-card)', border: '1px solid var(--mb-border)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
            <p style={{ color: 'var(--mb-text-primary)', fontWeight: 600, marginBottom: 4 }}>{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color, fontSize: 12 }}>{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

export default function AnalyticsPage() {
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [growth, setGrowth] = useState<{ date: string; count: number }[]>([]);
    const [engagement, setEngagement] = useState<{ total: number; sent: number; failed: number; successRate: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([fetchOverview(), fetchUserGrowth(7), fetchEngagement()])
            .then(([ov, gr, eng]) => {
                setOverview(ov);
                setGrowth(gr.map((g) => ({ ...g, date: new Date(g.date).toLocaleDateString('en', { weekday: 'short' }) })));
                setEngagement(eng);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const engagementData = engagement
        ? [
            { name: 'Failed', value: engagement.failed },
            { name: 'Sent', value: engagement.sent },
            { name: 'Pending', value: engagement.total - engagement.sent - engagement.failed },
        ].filter((d) => d.value > 0)
        : [];

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                    Analytics <span className="gradient-text">Dashboard</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                    Track MacBease growth, engagement, and performance metrics
                </p>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Stats Row */}
            {loading ? <LoadingShimmer type="stats" /> : overview && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                    <StatsCard icon={<UserPlus size={22} />} label="Total Users" value={overview.totalUsers} trendUp color="#8b5cf6" delay={0} />
                    <StatsCard icon={<Globe size={22} />} label="Communities" value={overview.communities} trendUp color="#34d399" delay={60} />
                    <StatsCard icon={<Users size={22} />} label="Events" value={overview.events} trendUp color="#60a5fa" delay={120} />
                    <StatsCard icon={<BarChart3 size={22} />} label="Notification Click Rate" value={`${engagement?.successRate || 0}%`} trendUp color="#f472b6" delay={180} />
                </div>
            )}

            {/* Charts */}
            {loading ? <LoadingShimmer rows={4} type="cards" /> : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 24 }}>
                    {/* User Growth Chart */}
                    <div className="card" style={{ padding: '20px 24px' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--mb-text-primary)' }}>📈 User Growth (Last 7 Days)</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={growth}>
                                <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,42,69,0.5)" />
                                <XAxis dataKey="date" tick={{ fill: 'var(--mb-text-muted)', fontSize: 12 }} axisLine={false} />
                                <YAxis tick={{ fill: 'var(--mb-text-muted)', fontSize: 12 }} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="count" name="Users" stroke="#8b5cf6" fill="url(#growthGradient)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Notification Engagement Donut */}
                    <div className="card" style={{ padding: '20px 24px' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--mb-text-primary)' }}>🔔 Notification Engagement</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={engagementData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3} stroke="none">
                                    {engagementData.map((_, i) => (
                                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            {!loading && overview && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    <div className="card" style={{ padding: '18px 22px', textAlign: 'center' }}>
                        <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--mb-text-primary)' }}>{overview.students}</p>
                        <p style={{ fontSize: 12, color: 'var(--mb-text-muted)', marginTop: 4 }}>Students</p>
                    </div>
                    <div className="card" style={{ padding: '18px 22px', textAlign: 'center' }}>
                        <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--mb-text-primary)' }}>{overview.teachers}</p>
                        <p style={{ fontSize: 12, color: 'var(--mb-text-muted)', marginTop: 4 }}>Teachers</p>
                    </div>
                    <div className="card" style={{ padding: '18px 22px', textAlign: 'center' }}>
                        <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--mb-text-primary)' }}>{overview.alumni}</p>
                        <p style={{ fontSize: 12, color: 'var(--mb-text-muted)', marginTop: 4 }}>Alumni</p>
                    </div>
                    <div className="card" style={{ padding: '18px 22px', textAlign: 'center' }}>
                        <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--mb-text-primary)' }}>{overview.ticketsSold}</p>
                        <p style={{ fontSize: 12, color: 'var(--mb-text-muted)', marginTop: 4 }}>Tickets Sold</p>
                    </div>
                </div>
            )}
        </div>
    );
}
