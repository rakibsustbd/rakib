'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Briefcase, 
  Activity, 
  BookOpen, 
  Camera, 
  TrendingUp, 
  Target, 
  Zap, 
  Users,
  ChevronRight,
  Loader2,
  Download,
  Mail,
  Share2,
  ArrowUpRight,
  Clock,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [featuredPhotos, setFeaturedPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCompIdx, setActiveCompIdx] = useState(0);

  useEffect(() => {
    fetchLandingData();
  }, []);

  async function fetchLandingData() {
    setIsLoading(true);
    try {
      const [profileRes, skillsRes, expRes, blogRes, photoRes] = await Promise.all([
        supabase.from('skills').select('*').eq('category', 'profile_config'),
        supabase.from('skills').select('*').eq('category', 'competency').order('order_index', { ascending: true }),
        supabase.from('experiences').select('*').order('order_index', { ascending: true }),
        supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('photos').select('*').order('publish_date', { ascending: false }).limit(6)
      ]);

      if (profileRes.data) {
        const config: any = {};
        profileRes.data.forEach(item => {
          config[item.name] = item.evidence;
        });
        setProfile(config);
      }

      if (skillsRes.data) setCompetencies(skillsRes.data);
      if (expRes.data) setExperiences(expRes.data);
      if (blogRes.data) setLatestBlogs(blogRes.data);
      if (photoRes.data) setFeaturedPhotos(photoRes.data);

    } catch (e) {
      console.error("Error fetching landing data:", e);
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className="loader-overlay">
        <Loader2 className="animate-spin" size={48} color="#10b981" />
        <style jsx>{`
          .loader-overlay { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; }
        `}</style>
      </div>
    );
  }

  const displayProfile = profile || {
    name: 'Ahmed Rakib Uddin',
    title: 'Strategic Leader & Product Architect',
    bio: 'Dynamic strategic professional with 18 years of leadership experience, specializing in the development of complex technological products and scalable business operations.',
    gtv_growth: '10x',
    tech_cost_cut: '75%',
    years_experience: '18+'
  };

  // Helper to find experiences relating to a competency
  const getRelatedExperience = (compName: string) => {
    // This is a simple heuristic; in a real app, you might have a mapping table
    // For now, we'll show the top 2 experiences
    return experiences.slice(0, 2);
  };

  return (
    <div className="landing-page animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section container">
        <div className="hero-content">
          <div className="hero-badge animate-slide-up">
            <span className="badge-dot"></span>
            Available for Strategic Consultation
          </div>
          <h1 className="hero-title animate-slide-up">
            Architecting <span className="text-gradient">Growth</span> <br />
            Through Strategic <span className="text-accent">Innovation.</span>
          </h1>
          <p className="hero-description animate-slide-up delay-100">
            {displayProfile.bio}
          </p>
          <div className="hero-actions animate-slide-up delay-200">
            <Link href="/resume" className="btn-primary">
              Explore Professional Journey <ArrowRight size={18} />
            </Link>
            <Link href="/blog" className="btn-secondary">
              Read My Thoughts
            </Link>
          </div>
        </div>

        <div className="hero-visual animate-fade-in delay-300">
           <div className="visual-orb"></div>
           <div className="stats-cards-grid">
              <div className="stat-card glass-card">
                 <span className="stat-value">{displayProfile.gtv_growth}</span>
                 <span className="stat-label">GTV Growth</span>
              </div>
              <div className="stat-card glass-card">
                 <span className="stat-value">{displayProfile.tech_cost_cut}</span>
                 <span className="stat-label">Cost Optimization</span>
              </div>
              <div className="stat-card glass-card accent">
                 <span className="stat-value">{displayProfile.years_experience}</span>
                 <span className="stat-label">Years of Mastery</span>
              </div>
           </div>
        </div>
      </section>

      {/* 2. BRANDS TAPE */}
      <div className="brands-tape">
         <div className="tape-content">
            <div className="brand-logo">SHEBA.XYZ</div>
            <div className="brand-logo">QUBEE</div>
            <div className="brand-logo">ADN TELECOM</div>
            <div className="brand-logo">ERICSSON</div>
            <div className="brand-logo">IMAGINE RADIO</div>
            {/* Duplicate for infinite feel if we add animation */}
            <div className="brand-logo">SHEBA.XYZ</div>
            <div className="brand-logo">QUBEE</div>
         </div>
      </div>

      {/* 3. COMPETENCE x EXPERIENCE BRIDGE */}
      <section className="bridge-section container section-padding">
        <div className="section-header">
           <div className="section-tag">THE ARCHITECTURE</div>
           <h2>Core Competence & Impact</h2>
           <p>How strategic skills translate into real-world business results.</p>
        </div>

        <div className="bridge-grid">
           <div className="competence-list">
              {competencies.map((comp, idx) => (
                <div 
                  key={comp.id} 
                  className={`comp-item glass-card ${activeCompIdx === idx ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCompIdx(idx)}
                >
                  <div className="comp-icon">
                    {idx % 3 === 0 ? <TrendingUp size={20} /> : idx % 3 === 1 ? <Target size={20} /> : <Zap size={20} />}
                  </div>
                  <div className="comp-info">
                    <h3>{comp.name}</h3>
                    <p>{comp.evidence}</p>
                  </div>
                  <ChevronRight className="comp-arrow" size={18} />
                </div>
              ))}
           </div>

           <div className="experience-highlight">
              <div className="highlight-card glass-card animate-scale-in" key={activeCompIdx}>
                 <div className="card-header">
                    <Briefcase size={20} className="text-accent" />
                    <span>Experience Context</span>
                 </div>
                 <div className="highlight-content">
                    <h4>Validating {competencies[activeCompIdx]?.name}</h4>
                    <div className="related-exp-list">
                       {getRelatedExperience(competencies[activeCompIdx]?.name).map(exp => (
                         <div key={exp.id} className="mini-exp">
                            <div className="mini-exp-header">
                               <span className="company-name">{exp.company}</span>
                               <span className="role-title">{exp.role}</span>
                            </div>
                            <p className="exp-snippet">{exp.contribution?.substring(0, 150)}...</p>
                         </div>
                       ))}
                    </div>
                    <Link href="/resume" className="view-more-link">
                       View Full Professional Experience <ArrowUpRight size={16} />
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. CREATIVE PULSE (BLOG & PHOTOGRAPHY) */}
      <section className="creative-pulse section-padding bg-darker">
        <div className="container">
           <div className="section-header flex-header">
              <div>
                <div className="section-tag">CREATIVE PULSE</div>
                <h2>Vision Beyond Business</h2>
              </div>
              <div className="header-links">
                 <Link href="/blog" className="text-link">Explore Journal</Link>
                 <Link href="/photography" className="text-link">View Gallery</Link>
              </div>
           </div>

           <div className="creative-grid">
              {/* Blog Side */}
              <div className="blog-pulse">
                 {latestBlogs.length > 0 && (
                   <Link href={`/blog/${latestBlogs[0].slug}`} className="featured-blog-card glass-card group">
                      <div className="card-image">
                         <img src={latestBlogs[0].image_url || '/default_blog_cover.png'} alt="" />
                         <div className="card-category">{latestBlogs[0].category}</div>
                      </div>
                      <div className="card-text">
                         <h3 className="bengali" dangerouslySetInnerHTML={{ __html: latestBlogs[0].title }}></h3>
                         <p>{latestBlogs[0].excerpt?.substring(0, 100)}...</p>
                         <div className="card-footer">
                            <span><Clock size={14} /> {latestBlogs[0].read_time || '5 min'} read</span>
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                         </div>
                      </div>
                   </Link>
                 )}
                 <div className="mini-blogs-list">
                    {latestBlogs.slice(1, 3).map(blog => (
                      <Link key={blog.id} href={`/blog/${blog.slug}`} className="mini-blog-item">
                         <h4 className="bengali" dangerouslySetInnerHTML={{ __html: blog.title }}></h4>
                         <ArrowUpRight size={16} />
                      </Link>
                    ))}
                 </div>
              </div>

              {/* Photography Side */}
              <div className="photo-pulse">
                 <div className="photo-masonry">
                    {featuredPhotos.map((photo, idx) => (
                      <div key={photo.id} className={`masonry-item item-${idx}`}>
                         <img src={photo.url} alt={photo.title} />
                      </div>
                    ))}
                    <div className="photo-overlay-card glass-card">
                       <Camera size={24} />
                       <h3>Visual Storytelling</h3>
                       <p>Capturing the essence of travel and existence through my lens.</p>
                       <Link href="/photography" className="btn-outline">View Collection</Link>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. FOOTER CTA */}
      <section className="footer-cta container section-padding">
         <div className="cta-box glass-card">
            <h2>Let's Architect <br /> Something <span className="text-accent">Exceptional.</span></h2>
            <div className="cta-actions">
               <a href={`mailto:${displayProfile.email}`} className="btn-primary">
                  <Mail size={18} /> Get In Touch
               </a>
               <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-secondary">
                  <Share2 size={18} /> LinkedIn
               </a>
            </div>
         </div>
      </section>

      <style jsx>{`
        .landing-page { color: #fff; }
        .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .section-padding { padding: 120px 0; }
        .bg-darker { background: #020202; }

        /* HERO */
        .hero-section { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 100px; 
          align-items: center; 
          padding-top: 100px;
          min-height: 90vh;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-green);
          margin-bottom: 30px;
        }
        .badge-dot { width: 6px; height: 6px; background: var(--accent-green); border-radius: 50%; box-shadow: 0 0 10px var(--accent-green); }
        .hero-title { font-size: 4.8rem; font-weight: 900; line-height: 1; letter-spacing: -0.05em; margin-bottom: 40px; }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #10b981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .text-accent { color: var(--accent-green); }
        .hero-description { font-size: 1.25rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 50px; max-width: 600px; }
        .hero-actions { display: flex; gap: 20px; }
        
        .hero-visual { position: relative; display: flex; justify-content: center; }
        .visual-orb { 
          position: absolute; 
          width: 500px; height: 500px; 
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%); 
          filter: blur(40px);
          z-index: -1;
        }
        .stats-cards-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 20px; 
          width: 100%;
          max-width: 500px;
        }
        .stat-card { padding: 40px 30px; text-align: center; display: flex; flex-direction: column; gap: 10px; }
        .stat-card.accent { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); }
        .stat-value { font-size: 2.8rem; font-weight: 900; color: #fff; }
        .stat-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 700; }

        /* BRANDS */
        .brands-tape { 
          background: rgba(255,255,255,0.02); 
          padding: 40px 0; 
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
        }
        .tape-content { display: flex; justify-content: space-between; gap: 60px; }
        .brand-logo { font-size: 1.2rem; font-weight: 900; opacity: 0.3; letter-spacing: 0.2em; color: #fff; }

        /* BRIDGE SECTION */
        .section-header { margin-bottom: 60px; }
        .section-tag { font-size: 0.8rem; font-weight: 800; color: var(--accent-green); letter-spacing: 0.2em; margin-bottom: 15px; }
        .section-header h2 { font-size: 3rem; font-weight: 900; margin-bottom: 15px; }
        .section-header p { color: var(--text-muted); font-size: 1.1rem; }
        .flex-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .header-links { display: flex; gap: 30px; }
        .text-link { color: var(--accent-green); font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }
        .text-link:hover { text-decoration: underline; }

        .bridge-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; }
        .competence-list { display: flex; flex-direction: column; gap: 20px; }
        .comp-item { 
          padding: 30px; 
          display: flex; gap: 25px; align-items: center; 
          cursor: pointer; transition: all 0.4s;
          border-color: transparent;
        }
        .comp-item.active { background: rgba(255,255,255,0.05); border-color: rgba(16, 185, 129, 0.4); transform: translateX(10px); }
        .comp-icon { width: 50px; height: 50px; border-radius: 14px; background: rgba(16, 185, 129, 0.1); color: var(--accent-green); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .comp-info h3 { font-size: 1.2rem; margin-bottom: 8px; color: #fff; }
        .comp-info p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; }
        .comp-arrow { margin-left: auto; color: var(--text-muted); opacity: 0; transition: all 0.3s; }
        .comp-item:hover .comp-arrow, .comp-item.active .comp-arrow { opacity: 1; }

        .experience-highlight { position: sticky; top: 120px; height: fit-content; }
        .highlight-card { padding: 50px; border-radius: 32px; background: rgba(255,255,255,0.02); }
        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .highlight-content h4 { font-size: 2rem; margin-bottom: 40px; color: #fff; }
        .related-exp-list { display: flex; flex-direction: column; gap: 40px; margin-bottom: 40px; }
        .mini-exp { border-left: 2px solid rgba(16, 185, 129, 0.3); padding-left: 25px; }
        .company-name { display: block; font-size: 1.1rem; font-weight: 800; color: var(--accent-green); margin-bottom: 4px; }
        .role-title { display: block; font-size: 0.9rem; color: #fff; font-weight: 600; margin-bottom: 12px; }
        .exp-snippet { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; }
        .view-more-link { display: inline-flex; align-items: center; gap: 10px; color: #fff; font-weight: 700; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; font-size: 0.9rem; }

        /* CREATIVE GRID */
        .creative-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
        .featured-blog-card { display: block; text-decoration: none; overflow: hidden; border-radius: 24px; transition: all 0.3s; }
        .featured-blog-card:hover { transform: translateY(-5px); }
        .card-image { position: relative; width: 100%; aspect-ratio: 16/9; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .featured-blog-card:hover .card-image img { transform: scale(1.05); }
        .card-category { position: absolute; top: 20px; left: 20px; padding: 6px 14px; background: var(--accent-green); color: #000; font-weight: 800; font-size: 0.75rem; border-radius: 8px; }
        .card-text { padding: 30px; }
        .card-text h3 { font-size: 1.8rem; margin-bottom: 15px; color: #fff; }
        .card-text p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 25px; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }
        
        .mini-blogs-list { margin-top: 30px; display: flex; flex-direction: column; gap: 15px; }
        .mini-blog-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 16px; text-decoration: none; color: #fff; transition: all 0.3s; }
        .mini-blog-item:hover { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); }
        .mini-blog-item h4 { font-size: 1rem; font-weight: 500; }

        .photo-masonry { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 180px); gap: 15px; position: relative; }
        .masonry-item { overflow: hidden; border-radius: 20px; }
        .masonry-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
        .item-0 { grid-row: span 2; }
        .item-1 { grid-row: span 1; }
        .item-2 { grid-row: span 2; }
        .photo-overlay-card { 
          position: absolute; 
          inset: 40px; 
          display: flex; flex-direction: column; 
          justify-content: center; align-items: center; 
          text-align: center; padding: 40px;
          border-radius: 24px;
        }
        .photo-overlay-card h3 { font-size: 1.5rem; margin: 20px 0 10px; }
        .photo-overlay-card p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 30px; }
        .btn-outline { padding: 12px 24px; border: 1px solid var(--accent-green); color: var(--accent-green); border-radius: 100px; font-weight: 700; text-decoration: none; transition: all 0.3s; }
        .btn-outline:hover { background: var(--accent-green); color: #000; }

        /* FOOTER CTA */
        .cta-box { padding: 80px; border-radius: 48px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.2); background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent); }
        .cta-box h2 { font-size: 4rem; font-weight: 900; margin-bottom: 50px; line-height: 1; letter-spacing: -0.04em; }
        .cta-actions { display: flex; justify-content: center; gap: 20px; }

        .btn-primary { background: var(--accent-green); color: #000; border: none; padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; transition: all 0.3s; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; transition: all 0.3s; }
        .btn-primary:hover { background: #0ea5e9; transform: translateY(-5px); }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-5px); }

        /* BENGALI FONT */
        .bengali { font-family: inherit; line-height: 1.6; }

        @media (max-width: 1200px) {
          .hero-section { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .hero-content { display: flex; flex-direction: column; align-items: center; }
          .hero-title { font-size: 3.5rem; }
          .hero-actions { justify-content: center; }
          .stats-cards-grid { margin: 0 auto; }
          .bridge-grid { grid-template-columns: 1fr; }
          .creative-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .container { padding: 0 20px; }
          .hero-title { font-size: 2.8rem; }
          .section-header h2 { font-size: 2.2rem; }
          .highlight-card { padding: 30px; }
          .highlight-content h4 { font-size: 1.5rem; }
          .cta-box { padding: 40px 20px; }
          .cta-box h2 { font-size: 2.5rem; }
          .cta-actions { flex-direction: column; width: 100%; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
          .photo-masonry { grid-template-rows: repeat(3, 140px); }
        }

        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
