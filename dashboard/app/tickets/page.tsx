'use client';

import { useEffect, useState } from 'react';
import { Ticket, IndianRupee, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchTicketStats, fetchTicketsByEvent, type TicketByEvent } from '@/lib/api';

export default function TicketsPage() {
    const [stats, setStats] = useState<{ totalTickets: number; totalRevenue: number } | null>(null);
    const [ticketData, setTicketData] = useState<TicketByEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([fetchTicketStats(), fetchTicketsByEvent()])
            .then(([s, byEvent]) => {
                setStats(s);
                setTicketData(byEvent);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const avgPrice = stats && stats.totalTickets > 0 ? Math.round(stats.totalRevenue / stats.totalTickets) : 0;

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                    Ticket <span className="gradient-text">System</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                    Track ticket sales, revenue, and availability across events
                </p>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {loading ? <LoadingShimmer type="stats" /> : stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                    <StatsCard icon={<Ticket size={22} />} label="Total Tickets Sold" value={stats.totalTickets} trendUp color="#a78bfa" delay={0} />
                    <StatsCard icon={<IndianRupee size={22} />} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} trendUp color="#34d399" delay={60} />
                    <StatsCard icon={<TrendingUp size={22} />} label="Avg Ticket Price" value={`₹${avgPrice}`} trend="Across all events" trendUp color="#fb923c" delay={120} />
                </div>
            )}

            {loading ? <LoadingShimmer rows={5} /> : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Tickets Sold</th>
                                <th>Total Capacity</th>
                                <th>Price</th>
                                <th>Revenue</th>
                                <th>Remaining</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ticketData.map((t) => {
                                const progress = t.total > 0 ? (t.sold / t.total) * 100 : 0;
                                return (
                                    <tr key={t._id}>
                                        <td style={{ fontWeight: 600, color: 'var(--mb-text-primary)' }}>{t.event}</td>
                                        <td>{t.sold}</td>
                                        <td>{t.total}</td>
                                        <td>{t.price === 0 ? 'Free' : `₹${t.price}`}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--mb-success)' }}>₹{t.revenue.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${t.remaining < 20 ? 'badge-error' : 'badge-info'}`}>
                                                {t.remaining} left
                                            </span>
                                        </td>
                                        <td style={{ width: 140 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--mb-bg-secondary)', overflow: 'hidden' }}>
                                                    <div style={{ width: `${progress}%`, height: '100%', borderRadius: 3, background: progress > 80 ? 'var(--mb-success)' : progress > 40 ? 'var(--mb-warning)' : 'var(--mb-gradient-start)', transition: 'width 1s ease' }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--mb-text-muted)', minWidth: 32 }}>{Math.round(progress)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {ticketData.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No ticket data yet</div>
                    )}
                </div>
            )}
        </div>
    );
}
