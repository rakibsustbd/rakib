'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Code, UserCircle, Share2, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/resume', label: 'Professional Resume' },
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
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay animate-fade-in">
          <div className="mobile-menu-header">
            <div className="nav-logo">RAKIB.</div>
            <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
              <X size={28} />
            </button>
          </div>
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.href} onClick={() => setIsMenuOpen(false)}>
                <Link 
                  href={item.href} 
                  className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  <span className="link-text">{item.label}</span>
                  <ArrowRight size={24} className="link-arrow" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu-footer">
            <p>© {new Date().getFullYear()} Ahmed Rakib Uddin</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .social-links-minimal { display: flex; align-items: center; z-index: 3000; }
        .mobile-menu-btn { background: none; border: none; color: #fff; cursor: pointer; display: none; padding: 8px; border-radius: 12px; }
        .mobile-menu-btn:hover { background: rgba(255,255,255,0.05); }
        
        .mobile-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 5000; display: flex; flex-direction: column; padding: 30px; }
        .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .close-btn { background: none; border: none; color: #fff; cursor: pointer; }
        .mobile-nav-list { list-style: none; padding: 0; flex: 1; }
        .mobile-nav-link { display: flex; justify-content: space-between; align-items: center; font-size: 1.5rem; font-weight: 800; padding: 18px 0; color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .mobile-nav-link.active { color: var(--accent-green); }
        .link-arrow { opacity: 0.6; transform: translateX(-10px); transition: all 0.3s; color: var(--accent-green); }
        .mobile-nav-link:hover .link-arrow { opacity: 1; transform: translateX(0); }
        
        .mobile-menu-footer { margin-top: auto; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
        .mobile-menu-footer p { font-size: 0.65rem; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 15px; font-weight: 700; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </nav>
  );
}
