'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, Camera, Mail, Code, UserCircle, Share2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Resume', icon: LayoutDashboard },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/photography', label: 'Photography', icon: Camera },
  ];

  return (
    <aside className="sidebar">
      <div className="profile-section">
        <div className="avatar-container">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300" 
            alt="Ahmed Rakib" 
            className="avatar"
          />
          <div className="status-indicator"></div>
        </div>
        <h1 className="name">Ahmed Rakib</h1>
        <p className="title">Creative Developer & Photographer</p>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="social-links">
        <a href="#" className="social-item"><Code size={20} /></a>
        <a href="#" className="social-item"><UserCircle size={20} /></a>
        <a href="#" className="social-item"><Share2 size={20} /></a>
        <a href="#" className="social-item"><Mail size={20} /></a>
      </div>

      <div className="sidebar-footer">
        <p>© 2024 Ahmed Rakib</p>
      </div>
    </aside>
  );
}
