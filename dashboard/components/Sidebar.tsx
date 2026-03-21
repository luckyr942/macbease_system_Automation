'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Globe,
    Calendar,
    Ticket,
    Megaphone,
    Bell,
    BarChart3,
    ScrollText,
    Settings,
    Zap,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/communities', label: 'Communities', icon: Globe },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/tickets', label: 'Tickets', icon: Ticket },
    { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/logs', label: 'Automation Logs', icon: ScrollText },
    { href: '/settings', label: 'Admin Settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            style={{
                width: 260,
                minHeight: '100vh',
                background: 'var(--mb-bg-sidebar)',
                borderRight: '1px solid var(--mb-border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 50,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid var(--mb-border)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, var(--mb-gradient-start), var(--mb-gradient-end))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Zap size={22} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
                            <span className="gradient-text">MacBease</span>
                        </h1>
                        <p style={{ fontSize: 11, color: 'var(--mb-text-muted)', fontWeight: 500 }}>
                            Automation Center
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? 'var(--mb-text-primary)' : 'var(--mb-text-secondary)',
                                background: isActive
                                    ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))'
                                    : 'transparent',
                                borderLeft: isActive ? '3px solid var(--mb-gradient-start)' : '3px solid transparent',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                                    e.currentTarget.style.color = 'var(--mb-text-primary)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--mb-text-secondary)';
                                }
                            }}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div
                style={{
                    padding: '16px 16px 20px',
                    borderTop: '1px solid var(--mb-border)',
                }}
            >
                <div
                    style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.05))',
                        border: '1px solid rgba(124,58,237,0.2)',
                    }}
                >
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--mb-gradient-accent)' }}>
                        🚀 MacBease Pro
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--mb-text-muted)', marginTop: 4 }}>
                        Automation Engine Active
                    </p>
                </div>
            </div>
        </aside>
    );
}
