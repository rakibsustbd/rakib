'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Camera, 
  Layers,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: FileText, label: 'Resume & Profile', href: '/admin/resume' },
  { icon: BookOpen, label: 'Blog', href: '/admin/blog' },
  { icon: Camera, label: 'Photography', href: '/admin/photography' },
  { icon: Layers, label: 'Sections', href: '/admin/sections' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar glass-card">
      <div className="sidebar-brand">
        <div className="brand-logo">A</div>
        <div className="brand-info">
          <h3>Antigravity</h3>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon-container">
                <item.icon size={20} />
              </span>
              <span className="nav-label">{item.label}</span>
              {isActive && <ChevronRight size={14} className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-divider"></div>

      <Link href="/" className="nav-item view-site">
        <span className="nav-icon-container">
          <ExternalLink size={20} />
        </span>
        <span className="nav-label">View Live Site</span>
      </Link>

      <style jsx>{`
        .admin-sidebar {
          width: 280px;
          height: calc(100vh - 40px);
          position: sticky;
          top: 20px;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 50px;
          padding: 0 10px;
        }

        .brand-logo {
          width: 45px;
          height: 45px;
          background: var(--accent-green);
          color: #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.5rem;
          box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
        }

        .brand-info h3 {
          margin: 0;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
        }

        .brand-info span {
          font-size: 0.7rem;
          color: var(--accent-green);
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .sidebar-nav {
          flex: 1;
        }

        .nav-item {
          display: grid;
          grid-template-columns: 40px 1fr 20px;
          align-items: center;
          height: 50px;
          padding: 0 15px;
          border-radius: 14px;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-icon-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: inherit;
        }

        .nav-label {
          font-size: 0.95rem;
          font-weight: 500;
          margin-top: -1px; /* Optical adjustment for baseline */
        }

        .active-indicator {
          color: var(--accent-green);
          justify-self: end;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          transform: translateX(5px);
        }

        .nav-item.active {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .sidebar-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0.1), transparent);
          margin: 20px 0;
        }

        .view-site {
          margin-top: auto;
          color: var(--text-muted);
        }
      `}</style>
    </aside>
  );
}
