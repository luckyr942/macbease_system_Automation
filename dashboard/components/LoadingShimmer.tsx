export default function LoadingShimmer({ rows = 5, type = 'table' }: { rows?: number; type?: 'table' | 'cards' | 'stats' }) {
    if (type === 'stats') {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card animate-shimmer" style={{ padding: '20px 22px', height: 110 }}>
                        <div style={{ width: '60%', height: 12, background: 'var(--mb-border)', borderRadius: 6, marginBottom: 12 }} />
                        <div style={{ width: '40%', height: 28, background: 'var(--mb-border)', borderRadius: 6, marginBottom: 8 }} />
                        <div style={{ width: '50%', height: 10, background: 'var(--mb-border)', borderRadius: 6 }} />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'cards') {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="card animate-shimmer" style={{ padding: '20px 22px', height: 160 }}>
                        <div style={{ width: '50%', height: 16, background: 'var(--mb-border)', borderRadius: 6, marginBottom: 12 }} />
                        <div style={{ width: '30%', height: 12, background: 'var(--mb-border)', borderRadius: 6, marginBottom: 20 }} />
                        <div style={{ display: 'flex', gap: 20 }}>
                            <div style={{ width: 60, height: 40, background: 'var(--mb-border)', borderRadius: 6 }} />
                            <div style={{ width: 60, height: 40, background: 'var(--mb-border)', borderRadius: 6 }} />
                            <div style={{ width: 60, height: 40, background: 'var(--mb-border)', borderRadius: 6 }} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--mb-border)' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{ width: 80, height: 12, background: 'var(--mb-border)', borderRadius: 6 }} />
                    ))}
                </div>
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="animate-shimmer" style={{ display: 'flex', gap: 16, padding: '14px 16px', borderBottom: '1px solid rgba(42,42,69,0.5)', animationDelay: `${i * 100}ms` }}>
                    <div style={{ width: '25%', height: 14, background: 'var(--mb-border)', borderRadius: 6 }} />
                    <div style={{ width: '20%', height: 14, background: 'var(--mb-border)', borderRadius: 6 }} />
                    <div style={{ width: '15%', height: 14, background: 'var(--mb-border)', borderRadius: 6 }} />
                    <div style={{ width: '15%', height: 14, background: 'var(--mb-border)', borderRadius: 6 }} />
                    <div style={{ width: '10%', height: 14, background: 'var(--mb-border)', borderRadius: 6 }} />
                </div>
            ))}
        </div>
    );
}
