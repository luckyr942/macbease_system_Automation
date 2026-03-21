'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, Info, ListFilter } from 'lucide-react';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchLogs, type AutomationLog } from '@/lib/api';

const statusFilters = ['All', 'success', 'error', 'warning'] as const;

const statusConfig: Record<string, { badge: string; icon: typeof CheckCircle; color: string }> = {
    success: { badge: 'badge-success', icon: CheckCircle, color: 'var(--mb-success)' },
    error: { badge: 'badge-error', icon: XCircle, color: 'var(--mb-error)' },
    warning: { badge: 'badge-warning', icon: AlertTriangle, color: 'var(--mb-warning)' },
};

const actionEmoji: Record<string, string> = {
    EMAIL_SENT: '📧', PUSH_SENT: '📢', EMAIL_FAILED: '⚠️', CAMPAIGN_CREATED: '✨',
    CAMPAIGN_STARTED: '🚀', USER_BANNED: '🚫', COMMUNITY_CREATED: '🏘️',
    EVENT_CREATED: '🎉', TICKET_SOLD: '🎟️', NOTIFICATION_SENT: '🔔',
};

export default function LogsPage() {
    const [logs, setLogs] = useState<AutomationLog[]>([]);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchLogs({
                status: statusFilter !== 'All' ? statusFilter : undefined,
                action: searchQuery || undefined,
            });
            setLogs(result.logs);
            setTotal(result.total);
            setError('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => load(), searchQuery ? 300 : 0);
        return () => clearTimeout(timer);
    }, [load, searchQuery]);

    const statusCounts = {
        success: logs.filter((l) => l.status === 'success').length,
        error: logs.filter((l) => l.status === 'error').length,
        warning: logs.filter((l) => l.status === 'warning').length,
    };

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                    Automation <span className="gradient-text">Logs</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                    Track all campaigns, emails, push notifications, and automation rule executions
                </p>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Status Summary Bar */}
            {!loading && (
                <div className="card" style={{ padding: '14px 24px', marginBottom: 20, display: 'flex', gap: 32, alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--mb-success)' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--mb-success)' }} /> {statusCounts.success} Success
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--mb-error)' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--mb-error)' }} /> {statusCounts.error} Errors
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--mb-warning)' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--mb-warning)' }} /> {statusCounts.warning} Warnings
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--mb-text-muted)' }}>{total} total entries</span>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--mb-text-muted)' }} />
                    <input
                        className="input"
                        placeholder="Search logs by action or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: 40 }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {statusFilters.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none',
                                background: statusFilter === s ? 'linear-gradient(135deg, var(--mb-gradient-start), var(--mb-gradient-end))' : 'var(--mb-bg-card)',
                                color: statusFilter === s ? 'white' : 'var(--mb-text-secondary)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}
                        >
                            {s === 'All' ? <ListFilter size={14} /> : s === 'success' ? '✅' : s === 'error' ? '❌' : '⚠️'} {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs Table */}
            {loading ? <LoadingShimmer rows={8} /> : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Timestamp</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, i) => {
                                const config = statusConfig[log.status] || statusConfig.success;
                                const StatusIcon = config.icon;
                                return (
                                    <tr key={log._id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                                        <td>
                                            <span className={`badge ${config.badge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                <StatusIcon size={12} /> {log.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--mb-text-muted)', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 12 }}>
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td>
                                            <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                {actionEmoji[log.action] || '📋'} {log.action.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--mb-text-secondary)', maxWidth: 400 }}>{log.details}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No logs found</div>
                    )}
                </div>
            )}
        </div>
    );
}
