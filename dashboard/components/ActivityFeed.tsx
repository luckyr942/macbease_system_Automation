'use client';

interface ActivityItem {
    icon: string;
    text: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error';
}

interface ActivityFeedProps {
    items: ActivityItem[];
}

const typeColors = {
    success: 'var(--mb-success)',
    info: 'var(--mb-info)',
    warning: 'var(--mb-warning)',
    error: 'var(--mb-error)',
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
    return (
        <div className="card" style={{ padding: '20px 22px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--mb-text-primary)' }}>
                Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="animate-fade-in"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 0',
                            borderBottom: i < items.length - 1 ? '1px solid rgba(42,42,69,0.5)' : 'none',
                            animationDelay: `${i * 80}ms`,
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: typeColors[item.type],
                                boxShadow: `0 0 8px ${typeColors[item.type]}60`,
                                flexShrink: 0,
                            }}
                        />
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                        <p style={{ fontSize: 13, color: 'var(--mb-text-secondary)', flex: 1 }}>
                            {item.text}
                        </p>
                        <span style={{ fontSize: 11, color: 'var(--mb-text-muted)', whiteSpace: 'nowrap' }}>
                            {item.time}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
