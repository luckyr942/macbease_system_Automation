'use client';

import { useEffect, useState } from 'react';
import { Shield, Trash2, Plus, Save } from 'lucide-react';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchAdminRoles, updateAdminRole, removeAdminRole, type AdminRole } from '@/lib/api';

const roleOptions = ['superAdmin', 'communityManager', 'eventManager', 'supportAdmin', 'marketingAdmin'];
const roleLabels: Record<string, string> = {
    superAdmin: 'Super Admin', communityManager: 'Community Manager', eventManager: 'Event Manager',
    supportAdmin: 'Support Admin', marketingAdmin: 'Marketing Admin',
};
const roleBadges: Record<string, string> = {
    superAdmin: 'badge-error', communityManager: 'badge-info', eventManager: 'badge-success',
    supportAdmin: 'badge-warning', marketingAdmin: 'badge-purple',
};

const allPermissions = [
    'all', 'manage_communities', 'manage_events', 'manage_campaigns', 'manage_users',
    'send_notifications', 'view_users', 'view_analytics', 'view_tickets',
];

export default function SettingsPage() {
    const [admins, setAdmins] = useState<AdminRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            const roles = await fetchAdminRoles();
            setAdmins(roles);
            setError('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleRoleChange = async (admin: AdminRole, newRole: string) => {
        try {
            await updateAdminRole(admin.userId._id, newRole, admin.permissions);
            load();
        } catch (e: any) {
            alert(`Failed: ${e.message}`);
        }
    };

    const handleRemove = async (userId: string) => {
        if (!confirm('Remove this admin role?')) return;
        try {
            await removeAdminRole(userId);
            load();
        } catch (e: any) {
            alert(`Failed: ${e.message}`);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                    Admin <span className="gradient-text">Settings</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                    Manage admin roles, permissions, and platform configuration
                </p>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Admin Roles Section */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Shield size={20} style={{ color: 'var(--mb-gradient-start)' }} /> Admin Roles & Permissions
                    </h2>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <Plus size={14} /> Add Admin
                    </button>
                </div>

                {loading ? <LoadingShimmer rows={4} /> : (
                    <div className="card" style={{ overflow: 'hidden' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Admin</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Permissions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin._id}>
                                        <td style={{ fontWeight: 600, color: 'var(--mb-text-primary)' }}>{admin.userId?.name || 'Unknown'}</td>
                                        <td>{admin.userId?.email || '—'}</td>
                                        <td>
                                            <select
                                                className="select"
                                                value={admin.role}
                                                onChange={(e) => handleRoleChange(admin, e.target.value)}
                                                style={{ padding: '6px 12px', fontSize: 12, minWidth: 160 }}
                                            >
                                                {roleOptions.map((r) => (
                                                    <option key={r} value={r}>{roleLabels[r]}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                {admin.permissions.slice(0, 3).map((p) => (
                                                    <span key={p} className="badge badge-purple" style={{ fontSize: 10 }}>{p.replace(/_/g, ' ')}</span>
                                                ))}
                                                {admin.permissions.length > 3 && (
                                                    <span className="badge badge-info" style={{ fontSize: 10 }}>+{admin.permissions.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn-secondary" style={{ padding: '6px 10px', color: 'var(--mb-error)' }} onClick={() => handleRemove(admin.userId._id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {admins.length === 0 && (
                            <div style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No admin roles configured</div>
                        )}
                    </div>
                )}
            </div>

            {/* General Settings */}
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⚙️ General Settings
                </h2>
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Platform Name</label>
                            <input className="input" defaultValue="MacBease" />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Default Notification Audience</label>
                            <select className="select" style={{ width: '100%' }} defaultValue="ALL_USERS">
                                <option value="ALL_USERS">All Users</option>
                                <option value="STUDENTS">Students Only</option>
                                <option value="TEACHERS">Teachers Only</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Support Email</label>
                            <input className="input" defaultValue="support@macbease.com" />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-text-muted)', display: 'block', marginBottom: 6 }}>Max Campaign Retries</label>
                            <input className="input" type="number" defaultValue={3} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Save size={14} /> Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
