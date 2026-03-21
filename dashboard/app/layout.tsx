import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'MacBease — Admin Dashboard',
  description: 'MacBease Automation Command Center — manage users, campaigns, communities, events, and analytics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              marginLeft: 260,
              padding: '28px 32px',
              background: 'var(--mb-bg-primary)',
              minHeight: '100vh',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
