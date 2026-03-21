'use client';

import { useEffect, useState } from 'react';
import { Bell, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchNotifications, fetchNotificationStats, sendNotification, type Notification } from '@/lib/api';

const audiences = ['ALL_USERS', 'STUDENTS', 'TEACHERS', 'ALUMNI'];
const audienceLabels: Record<string, string> = { ALL_USERS: 'All Users', STUDENTS: 'Students', TEACHERS: 'Teachers', ALUMNI: 'Alumni' };

const statusConfig: Record<string, { badge: string; icon: typeof CheckCircle; label: string }> = {
    sent: { badge: 'badge-success', icon: CheckCircle, label: 'Sent' },
    pending: { badge: 'badge-warning', icon: Clock, label: 'Pending' },
    failed: { badge: 'badge-error', icon: XCircle, label: 'Failed' },
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState<{ sentToday: number; failedToday: number; pendingToday: number; deliveryRate: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', audience: 'ALL_USERS' });
    const [sending, setSending] = useState(false);

    const load = async () => {
        try {
            const [notifResult, notifStats] = await Promise.all([fetchNotifications(), fetchNotificationStats()]);
            setNotifications(notifResult.notifications);
            setStats(notifStats);
            setError('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSend = async () => {
        if (!form.title || !form.message) { alert('Title and message are required'); return; }
        setSending(true);
        try {
            const result = await sendNotification(form);
            alert(`✅ Notification sent to ${result.sent} users!`);
            setShowForm(false);
            setForm({ title: '', message: '', audience: 'ALL_USERS' });
            load();
        } catch (e: any) {
            alert(`Failed: ${e.message}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                        Notification <span className="gradient-text">Center</span>
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                        Send instant alerts and track delivery across MacBease
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bell size={16} /> Send Notification
                </button>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Stats */}
            {loading ? <LoadingShimmer type="stats" /> : stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                    <StatsCard icon={<Send size={22} />} label="Sent Today" value={stats.sentToday} trend={`${stats.deliveryRate}% delivered`} trendUp color="#2dd4bf" delay={0} />
                    <StatsCard icon={<CheckCircle size={22} />} label="Delivery Rate" value={`${stats.deliveryRate}%`} trendUp color="#34d399" delay={60} />
                    <StatsCard icon={<Clock size={22} />} label="Pending" value={stats.pendingToday} trendUp color="#fbbf24" delay={120} />
                    <StatsCard icon={<XCircle size={22} />} label="Failed" value={stats.failedToday} trendUp={false} color="#f87171" delay={180} />
                </div>
            )}

            {/* Quick Send Form */}
            {showForm && (
                <div className="card animate-slide-up" style={{ padding: 24, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, color: 'var(--mb-text-primary)' }}>⚡ Quick Send Notification</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Title</label>
                            <input className="input" placeholder="e.g. BGMI Tournament starts tonight" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Target Audience</label>
                            <select className="select" style={{ width: '100%' }} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                                {audiences.map((a) => (<option key={a} value={a}>{audienceLabels[a]}</option>))}
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Message</label>
                            <textarea className="textarea" placeholder="Write your notification message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: sending ? 0.6 : 1 }} onClick={handleSend} disabled={sending}>
                            <Send size={14} /> {sending ? 'Sending...' : 'Send Now'}
                        </button>
                    </div>
                </div>
            )}

            {/* Notifications Table */}
            {loading ? <LoadingShimmer rows={8} /> : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Notification</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((n) => {
                                const config = statusConfig[n.status] || statusConfig.pending;
                                const StatusIcon = config.icon;
                                return (
                                    <tr key={n._id}>
                                        <td style={{ fontWeight: 600, color: 'var(--mb-text-primary)', maxWidth: 400 }}>{n.title}</td>
                                        <td><span className="badge badge-info">{n.type}</span></td>
                                        <td>
                                            <span className={`badge ${config.badge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                <StatusIcon size={12} /> {config.label}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--mb-text-muted)', whiteSpace: 'nowrap' }}>
                                            {n.sentAt ? new Date(n.sentAt).toLocaleString() : new Date(n.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {notifications.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No notifications yet</div>
                    )}
                </div>
            )}
        </div>
    );
}
