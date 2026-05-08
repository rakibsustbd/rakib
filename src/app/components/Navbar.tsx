'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Code, UserCircle, Share2, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <a href="#" className="social-item"><Mail size={18} /></a>
        </div>
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay animate-fade-in">
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.href} onClick={() => setIsMenuOpen(false)}>
                <Link 
                  href={item.href} 
                  className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .social-links-minimal { display: flex; align-items: center; }
        .social-item { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; color: var(--text-secondary); margin-left: 10px; }
        .social-item:hover { color: var(--accent-green); background: rgba(16, 185, 129, 0.1); }
        .mobile-menu-btn { display: none; background: none; border: none; color: #fff; cursor: pointer; margin-left: 15px; }
        
        .mobile-overlay { position: fixed; top: var(--nav-height); left: 0; right: 0; bottom: 0; background: #000; z-index: 2000; display: flex; flex-direction: column; padding: 40px; }
        .mobile-nav-list { list-style: none; padding: 0; }
        .mobile-nav-link { display: block; font-size: 2rem; font-weight: 800; margin-bottom: 25px; color: #fff; text-decoration: none; }
        .mobile-nav-link.active { color: var(--accent-green); }

        @media (max-width: 768px) {
          .nav-links, .social-links { display: none; }
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </nav>
  );
}
