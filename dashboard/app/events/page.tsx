'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Plus, Ticket, Edit, Trash2 } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchEvents, fetchEventStats, deleteEvent, type Event } from '@/lib/api';

const statusStyles: Record<string, { bg: string; color: string }> = {
    live: { bg: 'rgba(52,211,153,0.15)', color: 'var(--mb-success)' },
    upcoming: { bg: 'rgba(96,165,250,0.15)', color: 'var(--mb-info)' },
    completed: { bg: 'rgba(106,106,138,0.15)', color: 'var(--mb-text-muted)' },
    cancelled: { bg: 'rgba(248,113,113,0.15)', color: 'var(--mb-error)' },
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<{ total: number; upcoming: number; live: number; completed: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            const [evResult, evStats] = await Promise.all([fetchEvents(), fetchEventStats()]);
            setEvents(evResult.events);
            setStats(evStats);
            setError('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        try {
            await deleteEvent(id);
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
                        Event <span className="gradient-text">Management</span>
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                        Create and manage all MacBease events
                    </p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Plus size={16} /> Create Event
                </button>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {loading ? <LoadingShimmer type="stats" /> : stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                    <StatsCard icon={<Calendar size={22} />} label="Total Events" value={stats.total} trendUp color="#fb923c" delay={0} />
                    <StatsCard icon={<Calendar size={22} />} label="Upcoming" value={stats.upcoming} trendUp color="#60a5fa" delay={60} />
                    <StatsCard icon={<Calendar size={22} />} label="Live Now" value={stats.live} trendUp color="#34d399" delay={120} />
                    <StatsCard icon={<Calendar size={22} />} label="Completed" value={stats.completed} trendUp color="#a78bfa" delay={180} />
                </div>
            )}

            {loading ? <LoadingShimmer rows={5} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {events.map((event, i) => (
                        <div key={event._id} className="card animate-slide-up" style={{ padding: '20px 24px', animationDelay: `${i * 60}ms` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--mb-text-primary)' }}>{event.name}</h3>
                                        <span
                                            style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                                background: (statusStyles[event.status] || statusStyles.upcoming).bg,
                                                color: (statusStyles[event.status] || statusStyles.upcoming).color,
                                            }}
                                        >
                                            {event.status === 'live' ? '● ' : ''}{event.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--mb-text-secondary)', marginBottom: 12 }}>{event.description}</p>
                                    <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--mb-text-muted)' }}>
                                            <Calendar size={14} /> {new Date(event.date).toLocaleDateString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--mb-text-muted)' }}>
                                            <MapPin size={14} /> {event.location}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--mb-text-muted)' }}>
                                            <Users size={14} /> {event.currentParticipants}/{event.maxParticipants}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--mb-text-muted)' }}>
                                            <Ticket size={14} /> {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                                    <button className="btn-secondary" style={{ padding: '8px 12px' }}><Edit size={14} /></button>
                                    <button className="btn-secondary" style={{ padding: '8px 12px', color: 'var(--mb-error)' }} onClick={() => handleDelete(event._id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No events found</div>
                    )}
                </div>
            )}
        </div>
    );
}
