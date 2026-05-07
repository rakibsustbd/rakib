'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Code, UserCircle, Share2 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Professional Resume' },
    { href: '/blog', label: 'Thoughts & Blog' },
    { href: '/photography', label: 'Photography' },
  ];

  return (
    <nav className="top-nav">
      <div className="nav-logo">
        <Link href="/">RAKIB.</Link>
      </div>

      <ul className="nav-links">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="social-links-minimal">
        <div className="social-links" style={{ marginBottom: 0 }}>
          <a href="#" className="social-item"><Code size={18} /></a>
          <a href="#" className="social-item"><UserCircle size={18} /></a>
          <a href="#" className="social-item"><Share2 size={18} /></a>
          <a href="#" className="social-item"><Mail size={18} /></a>
        </div>
      </div>

      <style jsx>{`
        .social-links-minimal {
          display: flex;
          align-items: center;
        }
        .social-item {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: var(--text-secondary);
          margin-left: 10px;
        }
        .social-item:hover {
          color: var(--accent-green);
          background: rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </nav>
  );
}
