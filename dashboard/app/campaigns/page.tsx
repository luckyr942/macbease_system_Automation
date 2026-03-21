'use client';

import { useEffect, useState } from 'react';
import { Megaphone, Plus, Play, BarChart3, Send } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchCampaigns, createCampaign, runCampaign, type Campaign } from '@/lib/api';

const audiences = ['ALL_USERS', 'STUDENTS', 'TEACHERS', 'ALUMNI', 'ADMINS', 'SPECIFIC_UNIVERSITY', 'SPECIFIC_COMMUNITY'];
const audienceLabels: Record<string, string> = {
    ALL_USERS: 'All Users', STUDENTS: 'Students', TEACHERS: 'Teachers', ALUMNI: 'Alumni', ADMINS: 'Admins',
    SPECIFIC_UNIVERSITY: 'Specific University', SPECIFIC_COMMUNITY: 'Specific Community',
};
const types = ['push', 'email', 'announcement'];
const priorities = ['low', 'medium', 'high', 'urgent'];

const statusStyles: Record<string, { badge: string }> = {
    completed: { badge: 'badge-success' },
    scheduled: { badge: 'badge-info' },
    running: { badge: 'badge-warning' },
    draft: { badge: 'badge-purple' },
    failed: { badge: 'badge-error' },
};

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', audience: 'ALL_USERS', type: 'email', priority: 'medium', scheduledTime: '', image: '' });

    const load = async () => {
        try {
            const result = await fetchCampaigns();
            setCampaigns(result.campaigns);
            setTotal(result.total);
            setError('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        if (!form.title || !form.message) { alert('Title and message are required'); return; }
        try {
            await createCampaign({
                ...form,
                scheduledTime: form.scheduledTime ? new Date(form.scheduledTime) : undefined,
                image: form.image || undefined,
            });
            setShowForm(false);
            setForm({ title: '', message: '', audience: 'ALL_USERS', type: 'email', priority: 'medium', scheduledTime: '', image: '' });
            load();
        } catch (e: any) {
            alert(`Failed: ${e.message}`);
        }
    };

    const handleRun = async (id: string) => {
        try {
            const result = await runCampaign(id);
            alert(`Campaign started! Queued for ${(result as any).queued} users`);
            load();
        } catch (e: any) {
            alert(`Failed: ${e.message}`);
        }
    };

    const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const completed = campaigns.filter((c) => c.status === 'completed').length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const scheduled = campaigns.filter((c) => c.status === 'scheduled').length;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                        Campaign <span className="gradient-text">Automation Center</span>
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                        Create, schedule, and automate campaigns across MacBease
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Plus size={16} /> New Campaign
                </button>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Stats */}
            {loading ? <LoadingShimmer type="stats" /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                    <StatsCard icon={<Megaphone size={22} />} label="Total Campaigns" value={total} trendUp color="#8b5cf6" delay={0} />
                    <StatsCard icon={<Send size={22} />} label="Messages Sent" value={totalSent.toLocaleString()} trendUp color="#60a5fa" delay={60} />
                    <StatsCard icon={<BarChart3 size={22} />} label="Success Rate" value={`${successRate}%`} trendUp color="#34d399" delay={120} />
                    <StatsCard icon={<Play size={22} />} label="Scheduled" value={scheduled} trendUp color="#fb923c" delay={180} />
                </div>
            )}

            {/* Create Campaign Form */}
            {showForm && (
                <div className="card animate-slide-up" style={{ padding: 24, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, color: 'var(--mb-text-primary)' }}>✨ Create New Campaign</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Campaign Title</label>
                            <input className="input" placeholder="e.g. BGMI Tournament Live" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Target Audience</label>
                            <select className="select" style={{ width: '100%' }} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                                {audiences.map((a) => (<option key={a} value={a}>{audienceLabels[a] || a}</option>))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Campaign Type</label>
                            <select className="select" style={{ width: '100%' }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                {types.map((t) => (<option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Priority</label>
                            <select className="select" style={{ width: '100%' }} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                {priorities.map((p) => (<option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>))}
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Message</label>
                            <textarea className="textarea" placeholder="Write your campaign message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Schedule Time (optional)</label>
                            <input className="input" type="datetime-local" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Image URL (optional)</label>
                            <input className="input" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleCreate}>
                            <Send size={14} /> Launch Campaign
                        </button>
                    </div>
                </div>
            )}

            {/* Campaign List */}
            {loading ? <LoadingShimmer rows={5} /> : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Audience</th>
                                <th>Type</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Sent</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((c) => (
                                <tr key={c._id}>
                                    <td style={{ fontWeight: 600, color: 'var(--mb-text-primary)' }}>{c.title}</td>
                                    <td>{audienceLabels[c.audience] || c.audience}</td>
                                    <td><span className="badge badge-info">{c.type}</span></td>
                                    <td>
                                        <span className={`badge ${c.priority === 'high' || c.priority === 'urgent' ? 'badge-error' : c.priority === 'medium' ? 'badge-warning' : 'badge-purple'}`}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td><span className={`badge ${statusStyles[c.status]?.badge || 'badge-purple'}`}>{c.status}</span></td>
                                    <td>{c.sentCount.toLocaleString()}</td>
                                    <td style={{ color: 'var(--mb-text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {c.status === 'draft' && (
                                                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleRun(c._id)}>
                                                    <Play size={12} />
                                                </button>
                                            )}
                                            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>
                                                <BarChart3 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {campaigns.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No campaigns yet</div>
                    )}
                </div>
            )}
        </div>
    );
}
