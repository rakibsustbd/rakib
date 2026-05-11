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
  Star,
  Layers,
  Globe,
  Cpu,
  PenTool
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [profile, setProfile] = useState<any>(null);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<'strategy' | 'innovation'>('strategy');

  useEffect(() => {
    fetchLandingData();
  }, []);

  async function fetchLandingData() {
    setIsLoading(true);
    try {
      const [profileRes, blogRes] = await Promise.all([
        supabase.from('skills').select('*').eq('category', 'profile_config'),
        supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(3)
      ]);

      if (profileRes.data) {
        const config: any = {};
        profileRes.data.forEach(item => {
          config[item.name] = item.evidence;
        });
        setProfile(config);
      }

      if (blogRes.data) setLatestBlogs(blogRes.data);

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

  const heroStatement = "Build. Solve. Scale. Architecting Growth in Emerging Markets.";
  const subHero = "Strategic leader with 18+ years of expertise in bridging Fintech systems, AI Innovation, and Operational Excellence.";

  return (
    <div className="landing-page animate-fade-in">
      
      {/* 1. THE AUTHORITY HERO */}
      <section className="hero-section container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge animate-slide-up">
              <span className="badge-dot"></span>
              Strategic Thinker & Product Architect
            </div>
            <h1 className="hero-title animate-slide-up">
              {heroStatement.split('.').map((part, i) => (
                <span key={i} className={i < 3 ? "text-accent" : ""}>
                  {part}{i < 2 ? '. ' : ''}
                  {i === 2 && <br />}
                </span>
              ))}
            </h1>
            <p className="hero-description animate-slide-up delay-100">
              {subHero}
            </p>
            <div className="hero-actions animate-slide-up delay-200">
              <Link href="/resume" className="btn-primary">
                View Strategic Resume <ArrowRight size={18} />
              </Link>
              <a href="#dual-track" className="btn-secondary">
                Explore My Work
              </a>
            </div>
          </div>

          <div className="hero-visual animate-fade-in delay-300">
             <div className="portrait-container">
                <div className="portrait-glow"></div>
                <img 
                  src="/images/hero-rakib.jpg" 
                  alt="Ahmed Rakib" 
                  className="hero-portrait"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div className="portrait-overlay"></div>
             </div>
             
             <div className="experience-badge glass-card">
                <span className="badge-number">18+</span>
                <span className="badge-text">Years of Mastery</span>
             </div>
          </div>
        </div>
      </section>

      {/* 2. THE TRUST BAR (Logos) */}
      <div className="trust-bar">
         <div className="container">
            <p className="trust-label">BUILT & SCALED WITH</p>
            <div className="logo-grid">
               <div className="logo-item">QUBEE</div>
               <div className="logo-item">SHEBA.XYZ</div>
               <div className="logo-item">ADN TELECOM</div>
               <div className="logo-item">ERICSSON</div>
               <div className="logo-item">IMAGINE RADIO</div>
            </div>
         </div>
      </div>

      {/* 3. DUAL-TRACK NAVIGATION */}
      <section id="dual-track" className="track-section section-padding">
        <div className="container">
           <div className="section-header text-center">
              <div className="section-tag">CHOOSE YOUR PATH</div>
              <h2>Strategic Leadership & Visionary Innovation</h2>
           </div>

           <div className="track-switcher">
              <button 
                className={`track-btn ${activeTrack === 'strategy' ? 'active' : ''}`}
                onClick={() => setActiveTrack('strategy')}
              >
                <Briefcase size={20} />
                <span>Strategic Consulting & Fintech</span>
              </button>
              <button 
                className={`track-btn ${activeTrack === 'innovation' ? 'active' : ''}`}
                onClick={() => setActiveTrack('innovation')}
              >
                <Cpu size={20} />
                <span>AI Labs & Creative Ventures</span>
              </button>
           </div>

           <div className="track-content-area">
              {activeTrack === 'strategy' ? (
                <div className="track-grid animate-fade-in">
                   <div className="track-card glass-card">
                      <div className="card-icon"><TrendingUp /></div>
                      <h3>Build & Scale</h3>
                      <p>Scaling complex business units and navigating the nuances of emerging markets like Bangladesh from 0 to 1.</p>
                      <ul className="track-features">
                        <li>GTV Growth Optimization (10x Focus)</li>
                        <li>Operational Excellence & Automation</li>
                        <li>MSME Fintech Ecosystems</li>
                      </ul>
                   </div>
                   <div className="track-card glass-card">
                      <div className="card-icon"><Target /></div>
                      <h3>Solve & Optimize</h3>
                      <p>Managing P&L while optimizing cost structures through process re-engineering and technical governance.</p>
                      <ul className="track-features">
                        <li>Process Re-engineering (75% Cost Reduction)</li>
                        <li>Stakeholder Governance</li>
                        <li>Scalable Business Operations</li>
                      </ul>
                   </div>
                </div>
              ) : (
                <div className="track-grid animate-fade-in">
                   <div className="track-card glass-card">
                      <div className="card-icon"><Zap /></div>
                      <h3>AI Innovation</h3>
                      <p>Pioneering voice-first retail tools and practical AI solutions for the FMCG and MSME sectors.</p>
                      <ul className="track-features">
                        <li>Voice-Driven SME Interface</li>
                        <li>Practical AI Labs (Pilot Stage)</li>
                        <li>Retail Tech Transformation</li>
                      </ul>
                   </div>
                   <div className="track-card glass-card">
                      <div className="card-icon"><PenTool /></div>
                      <h3>Cultural Ventures</h3>
                      <p>Fusing Bengali literature and Nordic Noir sensibilities into digital products and storytelling.</p>
                      <ul className="track-features">
                        <li>Language Preservation Lab</li>
                        <li>Bengali Literary Journalism</li>
                        <li>Social Impact Narratives</li>
                      </ul>
                   </div>
                </div>
              )}
           </div>
        </div>
      </section>

      {/* 4. CASE STUDIES (CORE PILLARS) */}
      <section className="case-studies section-padding bg-darker">
        <div className="container">
           <div className="section-header">
              <div className="section-tag">IMPACT STORIES</div>
              <h2>Turning Complexity into Result</h2>
           </div>

           <div className="case-grid">
              <div className="case-item glass-card">
                 <div className="case-marker">FINTECH</div>
                 <h3>Scaling the Merchant Ecosystem</h3>
                 <p>Transformed 0 to market leadership in the SME payment sector by building resilient retailer tools.</p>
                 <Link href="/resume" className="case-link">Read Case Study <ArrowUpRight size={16} /></Link>
              </div>
              <div className="case-item glass-card">
                 <div className="case-marker">AI / FMCG</div>
                 <h3>Voice-First Retail Innovation</h3>
                 <p>Developing frictionless voice interfaces for rural retailers, bridging the digital literacy gap.</p>
                 <Link href="/resume" className="case-link">Read Case Study <ArrowUpRight size={16} /></Link>
              </div>
              <div className="case-item glass-card">
                 <div className="case-marker">SOCIAL IMPACT</div>
                 <h3>Digital Cultural Heritage</h3>
                 <p>Piloting language-learning platforms that use AI to preserve and promote Bengali storytelling for children.</p>
                 <Link href="/resume" className="case-link">Read Case Study <ArrowUpRight size={16} /></Link>
              </div>
           </div>
        </div>
      </section>

      {/* 5. FUTURE PROJECTS (BETA LAB) */}
      <section className="beta-lab section-padding">
         <div className="container">
            <div className="lab-box glass-card">
               <div className="lab-content">
                  <div className="section-tag">BETA LAB & R&D</div>
                  <h2>The Next Pilot: Building Health Check</h2>
                  <p>A visionary service leveraging data and technology to revolutionize real estate and infrastructure maintenance.</p>
                  <div className="lab-status">
                     <span className="status-dot animate-pulse"></span>
                     ACTIVE R&D STAGE
                  </div>
               </div>
               <div className="lab-visual">
                  <Layers size={80} className="text-accent opacity-20" />
               </div>
            </div>
         </div>
      </section>

      {/* 6. BENGALI CONTENT PREVIEW */}
      <section className="bengali-section section-padding">
         <div className="container">
            <div className="bengali-grid">
               <div className="bengali-text">
                  <div className="section-tag">LANGUAGE & CULTURE</div>
                  <h2>ভাষা ও সংস্কৃতির মেলবন্ধন</h2>
                  <p className="bengali">আমি বিশ্বাস করি প্রযুক্তি তখনই সার্থক হয় যখন তা স্থানীয় সংস্কৃতি ও ভাষার সাথে মিশে যায়। আমার লেখনী এবং ফটোগ্রাফিতে আমি সেই অস্তিত্বের খোঁজে থাকি।</p>
                  <Link href="/blog" className="btn-secondary">Read Bengali Blogs</Link>
               </div>
               <div className="bengali-visual">
                  {latestBlogs.length > 0 && (
                    <div className="featured-bengali-card glass-card">
                       <span className="featured-tag">LATEST THOUGHT</span>
                       <h3 className="bengali" dangerouslySetInnerHTML={{ __html: latestBlogs[0].title }}></h3>
                       <Link href={`/blog/${latestBlogs[0].slug}`} className="text-link">পুরোটা পড়ুন <ArrowRight size={16} /></Link>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="footer-cta container section-padding">
         <div className="cta-box glass-card">
            <h2>Ready to Architect <br /> the <span className="text-accent">Future?</span></h2>
            <div className="cta-actions">
               <a href={`mailto:${profile?.email || 'rakib_2001331022@yahoo.com'}`} className="btn-primary">
                  <Mail size={18} /> Start a Consultation
               </a>
                <a href="/resume" className="btn-secondary">
                  Download Strategic CV
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-secondary">
                  <Share2 size={18} /> LinkedIn
                </a>
            </div>
         </div>
      </section>

      <style jsx>{`
        .landing-page { color: #fff; background: var(--bg-primary); }
        .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .section-padding { padding: 140px 0; }
        .bg-darker { background: #020202; }
        .text-accent { color: var(--accent-green); }

        /* HERO */
        .hero-section { min-height: 95vh; display: flex; align-items: center; padding-top: 120px; padding-bottom: 60px; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; width: 100%; }
        .hero-badge { display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 100px; font-size: 0.85rem; font-weight: 700; color: var(--accent-green); margin-bottom: 35px; }
        .badge-dot { width: 8px; height: 8px; background: var(--accent-green); border-radius: 50%; box-shadow: 0 0 12px var(--accent-green); }
        .hero-title { font-size: 4.5rem; font-weight: 900; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 35px; }
        .hero-description { font-size: 1.25rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 55px; max-width: 650px; font-weight: 300; }
        .hero-actions { display: flex; gap: 24px; align-items: center; }

        .hero-visual { position: relative; display: flex; justify-content: flex-end; padding-left: 40px; }
        .portrait-container { 
          position: relative; 
          width: 100%; 
          max-width: 500px; 
          aspect-ratio: 3/4; 
          border-radius: 40px; 
          overflow: hidden; 
          border: 1px solid rgba(255,255,255,0.12); 
          background: #0a0a0a; 
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.7); 
        }
        .hero-portrait { width: 100%; height: 100%; object-fit: cover; object-position: center 15%; filter: contrast(1.02) brightness(1.05); transition: transform 0.5s ease; }
        .portrait-container:hover .hero-portrait { transform: scale(1.03); }
        .portrait-glow { position: absolute; inset: 0; background: radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 60%); z-index: 1; pointer-events: none; }
        .portrait-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 30%); z-index: 2; pointer-events: none; }
        
        .experience-badge { 
          position: absolute; 
          bottom: 30px; 
          left: -20px; 
          padding: 24px 32px; 
          border-radius: 24px; 
          text-align: center; 
          z-index: 10;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .badge-number { display: block; font-size: 3rem; font-weight: 900; color: var(--accent-green); line-height: 1; margin-bottom: 4px; }
        .badge-text { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; }

        /* TRUST BAR */
        .trust-bar { padding: 60px 0; background: rgba(255,255,255,0.01); border-top: 1px solid rgba(255,255,255,0.05); }
        .trust-label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.3em; text-align: center; margin-bottom: 40px; }
        .logo-grid { display: flex; justify-content: center; gap: 80px; flex-wrap: wrap; opacity: 0.3; }
        .logo-item { font-size: 1.3rem; font-weight: 900; letter-spacing: 0.2em; }

        /* TRACK SWITCHER */
        .track-switcher { display: flex; justify-content: center; gap: 20px; margin-bottom: 80px; }
        .track-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: var(--text-muted); padding: 18px 36px; border-radius: 100px; cursor: pointer; display: flex; align-items: center; gap: 15px; font-weight: 700; transition: all 0.3s; }
        .track-btn.active { background: var(--accent-green); color: #000; border-color: var(--accent-green); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.25); }
        .track-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .track-card { padding: 50px; border-radius: 32px; }
        .card-icon { width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); color: var(--accent-green); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }
        .track-card h3 { font-size: 1.5rem; margin-bottom: 16px; }
        .track-features { list-style: none; padding: 0; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 25px; }
        .track-features li { padding-left: 24px; position: relative; font-size: 0.95rem; color: var(--text-muted); margin-bottom: 12px; }
        .track-features li::before { content: '→'; position: absolute; left: 0; color: var(--accent-green); font-weight: 900; }

        /* CASE STUDIES */
        .case-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .case-item { padding: 50px; display: flex; flex-direction: column; height: 100%; border-radius: 32px; }
        .case-marker { font-size: 0.75rem; font-weight: 900; color: var(--accent-green); border: 1.5px solid var(--accent-green); padding: 6px 14px; border-radius: 8px; width: fit-content; margin-bottom: 30px; letter-spacing: 0.1em; }
        .case-item h3 { font-size: 1.6rem; margin-bottom: 20px; color: #fff; line-height: 1.3; }
        .case-item p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 40px; flex: 1; font-weight: 300; }
        .case-link { display: flex; align-items: center; gap: 10px; color: var(--accent-green); font-weight: 700; text-decoration: none; font-size: 1rem; transition: gap 0.3s; }
        .case-link:hover { gap: 15px; }

        /* BETA LAB */
        .lab-box { padding: 80px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; border-radius: 48px; border-color: rgba(16, 185, 129, 0.2); background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%); }
        .lab-content h2 { font-size: 2.8rem; margin: 25px 0; font-weight: 900; }
        .lab-content p { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 35px; max-width: 500px; }
        .lab-status { display: inline-flex; align-items: center; gap: 12px; font-size: 0.8rem; font-weight: 900; background: #000; padding: 12px 24px; border-radius: 100px; color: var(--accent-green); border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-dot { width: 10px; height: 10px; background: var(--accent-green); border-radius: 50%; }

        /* BENGALI */
        .bengali-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 100px; align-items: center; }
        .bengali-text h2 { font-size: 3.2rem; margin: 25px 0; font-weight: 900; }
        .bengali { font-size: 1.4rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 50px; font-weight: 400; }
        .featured-bengali-card { padding: 50px; border-radius: 40px; }
        .featured-tag { font-size: 0.8rem; font-weight: 900; color: var(--accent-green); margin-bottom: 20px; display: block; letter-spacing: 0.2em; }
        .featured-bengali-card h3 { font-size: 1.8rem; margin-bottom: 30px; line-height: 1.5; font-weight: 700; }
        .text-link { color: var(--accent-green); font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 12px; font-size: 1rem; }

        /* FOOTER CTA */
        .cta-box { padding: 120px 40px; text-align: center; border-radius: 64px; border-color: rgba(16, 185, 129, 0.3); background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent); }
        .cta-box h2 { font-size: 4.5rem; font-weight: 900; margin-bottom: 60px; letter-spacing: -0.05em; line-height: 1; }
        .cta-actions { display: flex; justify-content: center; gap: 24px; }

        .btn-primary { background: var(--accent-green); color: #000; padding: 20px 48px; border-radius: 18px; font-weight: 800; font-size: 1.15rem; display: flex; align-items: center; gap: 14px; cursor: pointer; text-decoration: none; transition: all 0.3s; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 20px 48px; border-radius: 18px; font-weight: 800; font-size: 1.15rem; display: flex; align-items: center; gap: 14px; cursor: pointer; text-decoration: none; transition: all 0.3s; }
        .btn-primary:hover { background: #14d393; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-5px); }

        @media (max-width: 1200px) {
          .hero-grid { grid-template-columns: 1fr; text-align: center; gap: 60px; }
          .hero-content { display: flex; flex-direction: column; align-items: center; }
          .hero-actions { justify-content: center; }
          .hero-visual { padding-left: 0; justify-content: center; margin-top: 40px; }
          .hero-title { font-size: 3.5rem; }
          .track-grid { grid-template-columns: 1fr; }
          .case-grid { grid-template-columns: 1fr; }
          .bengali-grid { grid-template-columns: 1fr; gap: 60px; }
          .lab-box { grid-template-columns: 1fr; text-align: center; padding: 60px 40px; }
        }

        @media (max-width: 768px) {
          .container { padding: 0 20px; }
          .hero-title { font-size: 2.5rem; }
          .hero-description { font-size: 1.1rem; }
          .section-padding { padding: 80px 0; }
          .cta-actions { flex-direction: column; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
          .track-switcher { flex-direction: column; }
          .track-btn { width: 100%; justify-content: center; }
          .cta-box h2 { font-size: 2.8rem; }
          .experience-badge { padding: 18px; bottom: 20px; left: -10px; }
          .badge-number { font-size: 2rem; }
        }

        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
