'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Briefcase, 
  BookOpen, 
  Camera, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  Loader2,
  Activity,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    experiences: 0,
    blogs: 0,
    photos: 0,
    competencies: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setIsLoading(true);
    try {
      const [exp, blog, photo, skill] = await Promise.all([
        supabase.from('experiences').select('id', { count: 'exact' }),
        supabase.from('posts').select('id', { count: 'exact' }),
        supabase.from('photos').select('id', { count: 'exact' }),
        supabase.from('skills').select('category', { count: 'exact' })
      ]);

      const skillsData = await supabase.from('skills').select('category');
      const compCount = skillsData.data?.filter(s => s.category === 'competency').length || 0;

      setStats({
        experiences: exp.count || 0,
        blogs: blog.count || 0,
        photos: photo.count || 0,
        competencies: compCount
      });
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  }

  if (isLoading) return (
    <div className="loading-container">
      <Loader2 className="animate-spin" size={48} />
      <style jsx>{`
        .loading-container { display: flex; align-items: center; justify-content: center; height: 60vh; color: var(--accent-green); }
      `}</style>
    </div>
  );

  const statCards = [
    { label: 'Experiences', value: stats.experiences, icon: Briefcase, color: '#3b82f6', href: '/admin/resume' },
    { label: 'Blog Posts', value: stats.blogs, icon: BookOpen, color: '#ec4899', href: '/admin/blog' },
    { label: 'Photography', value: stats.photos, icon: Camera, color: '#8b5cf6', href: '/admin/photography' },
    { label: 'Competencies', value: stats.competencies, icon: Activity, color: '#10b981', href: '/admin/resume' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-page-header">
        <div className="admin-page-title">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Ahmed. Here is what's happening across your site.</p>
        </div>
      </header>

      <div className="stats-grid">
        {statCards.map((card, i) => (
          <Link href={card.href} key={i} className="stat-card glass-card">
            <div className="stat-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{card.value}</h3>
              <span>{card.label}</span>
            </div>
            <ArrowUpRight size={18} className="stat-arrow" />
          </Link>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-main">
          <div className="recent-activity glass-card">
            <div className="section-header">
              <Clock size={20} />
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
               <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p>Modified <strong>Competencies</strong> in Resume Section</p>
                    <span>Just now</span>
                  </div>
               </div>
               <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p>Updated <strong>Photography</strong> Archive</p>
                    <span>2 hours ago</span>
                  </div>
               </div>
               <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p>Published new <strong>Blog Post</strong></p>
                    <span>Yesterday</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="dashboard-sidebar">
           <div className="quick-actions glass-card">
              <h3>Quick Actions</h3>
              <div className="action-links">
                 <Link href="/admin/blog/new" className="action-link">Write New Post</Link>
                 <Link href="/admin/photography" className="action-link">Upload Photos</Link>
                 <Link href="/admin/resume" className="action-link">Update Resume</Link>
              </div>
           </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard { animation: fade-in 0.5s ease-out; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.05); }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-info h3 { font-size: 1.8rem; margin: 0; line-height: 1.2; }
        .stat-info span { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
        .stat-arrow { position: absolute; top: 20px; right: 20px; color: var(--text-muted); opacity: 0; transition: all 0.3s; }
        .stat-card:hover .stat-arrow { opacity: 1; transform: translate(2px, -2px); }

        .dashboard-sections {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; color: var(--accent-green); }
        .section-header h2 { font-size: 1.2rem; color: #fff; margin: 0; }
        .recent-activity { padding: 30px; border-radius: 24px; }
        .activity-list { display: flex; flex-direction: column; gap: 24px; }
        .activity-item { display: flex; gap: 20px; }
        .activity-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-green); margin-top: 6px; box-shadow: 0 0 10px var(--accent-green); }
        .activity-content p { margin: 0 0 4px 0; font-size: 0.95rem; }
        .activity-content span { font-size: 0.8rem; color: var(--text-muted); }

        .quick-actions { padding: 25px; border-radius: 20px; }
        .quick-actions h3 { margin: 0 0 20px 0; font-size: 1rem; }
        .action-links { display: flex; flex-direction: column; gap: 10px; }
        .action-link {
          padding: 12px 15px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s;
        }
        .action-link:hover { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); }

        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 1000px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .dashboard-sections { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
