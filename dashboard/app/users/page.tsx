'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Ban, MailPlus, Eye, ShieldCheck } from 'lucide-react';
import LoadingShimmer from '@/components/LoadingShimmer';
import { fetchUsers, banUser, unbanUser, type User } from '@/lib/api';

const roles = ['All', 'student', 'teacher', 'admin', 'alumni'];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchUsers({ role: roleFilter, search });
            setUsers(result.users);
            setTotal(result.total);
            setError('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [roleFilter, search]);

    useEffect(() => {
        const timer = setTimeout(() => loadUsers(), search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [loadUsers, search]);

    const handleBan = async (user: User) => {
        try {
            if (user.banned) {
                await unbanUser(user._id);
            } else {
                await banUser(user._id);
            }
            loadUsers();
        } catch (e: any) {
            alert(`Failed: ${e.message}`);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>
                    User <span className="gradient-text">Management</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--mb-text-muted)', marginTop: 6 }}>
                    Manage all MacBease users across universities — {total} total
                </p>
            </div>

            {error && (
                <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--mb-error)' }}>
                    <p style={{ color: 'var(--mb-error)', fontSize: 14 }}>⚠️ {error}</p>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--mb-text-muted)' }} />
                    <input
                        className="input"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: 40 }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {roles.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none',
                                background: roleFilter === r ? 'linear-gradient(135deg, var(--mb-gradient-start), var(--mb-gradient-end))' : 'var(--mb-bg-card)',
                                color: roleFilter === r ? 'white' : 'var(--mb-text-secondary)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {r === 'All' ? '👥 All' : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <LoadingShimmer rows={8} />
            ) : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>University</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td style={{ fontWeight: 600, color: 'var(--mb-text-primary)' }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-purple' : user.role === 'teacher' ? 'badge-info' : user.role === 'alumni' ? 'badge-warning' : 'badge-success'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user.university}</td>
                                    <td>
                                        <span className={`badge ${user.banned ? 'badge-error' : user.active ? 'badge-success' : 'badge-warning'}`}>
                                            {user.banned ? 'Banned' : user.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--mb-text-muted)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} title="View">
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '6px 10px', fontSize: 12, color: user.banned ? 'var(--mb-success)' : 'var(--mb-error)' }}
                                                title={user.banned ? 'Unban' : 'Ban'}
                                                onClick={() => handleBan(user)}
                                            >
                                                {user.banned ? <ShieldCheck size={14} /> : <Ban size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--mb-text-muted)' }}>No users found</div>
                    )}
                </div>
            )}
        </div>
    );
}
