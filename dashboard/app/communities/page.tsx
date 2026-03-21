'use client';

import { useEffect, useState } from 'react';
import { Users, Shield, Plus, Trash2 } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchCommunities, fetchCommunityStats, deleteCommunity, type Community } from '@/lib/api';

const activityColors: Record<string, string> = {
    high: 'var(--mb-success)',
    medium: 'var(--mb-warning)',
    low: 'var(--mb-text-muted)',
};

function getActivity(memberCount: number): string {
    if (memberCount > 12) return 'high';
    if (memberCount > 5) return 'medium';
    return 'low';
}

export default function CommunitiesPage() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [stats, setStats] = useState<{ total: number; totalMembers: number; activeModerators: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            const [comResult, comStats] = await Promise.all([fetchCommunities(), fetchCommunityStats()]);
            setCommunities(comResult.communities);
            setStats(comStats);
            setError('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this community?')) return;
        try {
            await deleteCommunity(id);
            load();
        } catch (e: any) {
            alert(`Failed: ${e.message}`);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                        Community <span className="gradient-text">Management</span>
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                        Manage all MacBease communities across universities
                    </p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Plus size={16} /> Create Community
                </button>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Stats */}
            {loading ? <LoadingShimmer type="stats" /> : stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                    <StatsCard icon={<Users size={22} />} label="Total Communities" value={stats.total} trendUp={true} color="#f472b6" delay={0} />
                    <StatsCard icon={<Users size={22} />} label="Total Members" value={stats.totalMembers} trendUp={true} color="#8b5cf6" delay={60} />
                    <StatsCard icon={<Shield size={22} />} label="Active Moderators" value={stats.activeModerators} trend="All roles assigned" trendUp={true} color="#34d399" delay={120} />
                </div>
            )}

            {/* Community Cards */}
            {loading ? <LoadingShimmer type="cards" rows={4} /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    {communities.map((c, i) => {
                        const activity = getActivity(c.members.length);
                        return (
                            <div key={c._id} className="card animate-slide-up" style={{ padding: '20px 22px', animationDelay: `${i * 60}ms` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                    <div>
                                        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--mb-text-primary)' }}>
                                            {c.name}
                                        </h3>
                                        <p style={{ fontSize: 12, color: 'var(--mb-text-muted)', marginTop: 2 }}>
                                            {c.university} · {c.category}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: activityColors[activity], boxShadow: `0 0 6px ${activityColors[activity]}60`, marginTop: 6 }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
                                    <div>
                                        <p style={{ fontSize: 20, fontWeight: 700 }}>{c.members.length}</p>
                                        <p style={{ fontSize: 11, color: 'var(--mb-text-muted)' }}>Members</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 20, fontWeight: 700 }}>{c.moderators.length}</p>
                                        <p style={{ fontSize: 11, color: 'var(--mb-text-muted)' }}>Moderators</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 20, fontWeight: 700, textTransform: 'capitalize' }}>{activity}</p>
                                        <p style={{ fontSize: 11, color: 'var(--mb-text-muted)' }}>Activity</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {c.moderators.slice(0, 3).map((m) => (
                                            <span key={m._id} className="badge badge-purple" style={{ fontSize: 11 }}>
                                                {m.name?.split(' ')[0] || 'Mod'}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>
                                            <Shield size={14} />
                                        </button>
                                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, color: 'var(--mb-error)' }} onClick={() => handleDelete(c._id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && communities.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No communities found</div>
            )}
        </div>
    );
}
