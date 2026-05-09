'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/app/components/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we are on the login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  }, [pathname, router]);

  if (isAuthenticated === null && pathname !== '/admin/login') {
    return (
      <div className="auth-loading">
        <Loader2 className="animate-spin" size={48} color="#10b981" />
        <style jsx>{`
          .auth-loading {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
          }
        `}</style>
      </div>
    );
  }

  // If on login page, just render children without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout-wrapper">
      <AdminSidebar />
      <main className="admin-main-content">
        {children}
      </main>


      <style jsx global>{`
        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(15px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fade-in 0.3s ease-out;
        }
        .admin-modal {
          width: 90%;
          max-width: 800px;
          max-height: 85vh;
          overflow-y: auto;
          background: #050505;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 32px;
          padding: 40px;
          position: relative;
          box-shadow: 0 0 100px rgba(0, 0, 0, 1), 0 0 40px rgba(16, 185, 129, 0.1);
        }

        .admin-layout-wrapper {
          display: flex;
          gap: 40px;
          padding: 20px;
          max-width: 1600px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .admin-main-content {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .admin-page-header {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 24px;
        }

        .admin-page-title h1 {
          font-size: 2.2rem;
          margin: 0 0 8px 0;
          letter-spacing: -0.03em;
        }

        .admin-page-title p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .admin-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .admin-btn-primary {
          background: var(--accent-green);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .admin-btn-primary:hover {
          background: #0ea5e9;
          transform: translateY(-2px);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          text-align: left;
          padding: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .admin-table td {
          padding: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          color: var(--text-secondary);
        }

        .admin-form-group {
          margin-bottom: 20px;
        }

        .admin-form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .admin-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .admin-input:focus {
          border-color: var(--accent-green);
          outline: none;
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
