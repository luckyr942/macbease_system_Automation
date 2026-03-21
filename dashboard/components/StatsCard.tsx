import { ReactNode } from 'react';

interface StatsCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    color?: string;
    delay?: number;
}

export default function StatsCard({ icon, label, value, trend, trendUp, color = 'var(--mb-gradient-start)', delay = 0 }: StatsCardProps) {
    return (
        <div
            className="card animate-slide-up"
            style={{
                padding: '20px 22px',
                animationDelay: `${delay}ms`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Gradient accent line */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${color}, transparent)`,
                    borderRadius: '16px 16px 0 0',
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontSize: 12, color: 'var(--mb-text-muted)', fontWeight: 500, marginBottom: 8 }}>
                        {label}
                    </p>
                    <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--mb-text-primary)' }}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trend && (
                        <p
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                marginTop: 6,
                                color: trendUp ? 'var(--mb-success)' : 'var(--mb-error)',
                            }}
                        >
                            {trendUp ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
