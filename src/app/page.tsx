'use client';

import { 
  Briefcase, GraduationCap, Code, Award, Download, 
  Activity, TrendingUp, Target, Users, Zap, 
  Phone, Mail, MapPin, Link, Rocket, ArrowUpRight,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState('competencies');
  const [profile, setProfile] = useState<any>(null);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [profileRes, skillsRes, expRes, eduRes] = await Promise.all([
        supabase.from('skills').select('*').eq('category', 'profile_config'),
        supabase.from('skills').select('*').neq('category', 'profile_config').order('order_index', { ascending: true }),
        supabase.from('experiences').select('*').order('order_index', { ascending: true }),
        supabase.from('education').select('*').order('order_index', { ascending: true })
      ]);

      if (profileRes.data && profileRes.data.length > 0) {
        const config: any = {};
        profileRes.data.forEach(item => {
          config[item.name] = item.evidence;
        });
        setProfile(config);
      } else {
        setProfile(null);
      }

      if (skillsRes.data) {
        setCompetencies(skillsRes.data.filter(s => s.category === 'competency'));
        // Only include actual skill categories, exclude configuration ones
        setSkills(skillsRes.data.filter(s => 
          s.category !== 'competency' && 
          s.category !== 'global_config' && 
          s.category !== 'blog_config' &&
          s.category !== 'photo_story' &&
          s.category !== 'profile_config'
        ));
      }

      if (expRes.data) setExperiences(expRes.data);
      if (eduRes.data) setEducation(eduRes.data);

    } catch (e) {
      console.error(e);
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

  const displayProfile = (profile && Object.keys(profile).length > 0) ? profile : {
    name: 'Ahmed Rakib Uddin',
    title: 'Chief Executive Officer | Strategic Leader',
    bio: 'Dynamic strategic professional with 18 years of leadership experience, specializing in the development of complex technological products and scalable business and growth operations across Fintech, SME, telecom and service. Blends deep technical expertise with strategic business acumen, using user behavior analysis and business modeling to drive innovation. A customer-focused leader with a proven ability to translate market needs into successful product and business strategies. Delivered measurable impact in managing very optimum cost operation through process re-engineering, automation, and governance best practices.',
    phone: '+880 1841 672 217',
    email: 'rakib_2001331022@yahoo.com',
    location: 'Dhaka, Bangladesh',
    years_experience: '18+',
    gtv_growth: '10x',
    merchant_growth: '3x',
    tech_cost_cut: '75%'
  };

  return (
    <div className="container animate-fade-in">
      
      {/* Top Hero Section */}
      <div className="hero-section mb-80">
        <div className="hero-left">
          <div className="profile-card glass-card">
            <div className="profile-image-placeholder">
               <div className="image-inner">
                 <Users size={48} className="icon-muted" />
               </div>
            </div>
            <h2 className="profile-name">{displayProfile.name}</h2>
            <p className="profile-title">{displayProfile.title}</p>
            
            <div className="profile-contacts">
               <div className="contact-item">
                 <Phone size={16} />
                 <span>{displayProfile.phone}</span>
               </div>
               <div className="contact-item">
                 <Mail size={16} />
                 <span>{displayProfile.email}</span>
               </div>
               <div className="contact-item">
                 <MapPin size={16} />
                 <span>{displayProfile.location}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <h1 className="hero-title animate-slide-up">
            Building Business <span className="text-accent-green">That Matters</span>
          </h1>
          <p className="hero-bio">{displayProfile.bio}</p>
          
          <div className="hero-stats">
            <div className="stat-pill glass-card">
              <span className="stat-value">{displayProfile.years_experience}</span>
              <span className="stat-label">Experience</span>
            </div>
            <div className="stat-pill glass-card">
              <span className="stat-value">{displayProfile.gtv_growth}</span>
              <span className="stat-label">GTV Growth</span>
            </div>
            <div className="stat-pill glass-card">
              <span className="stat-value">{displayProfile.merchant_growth}</span>
              <span className="stat-label">Merchant Growth</span>
            </div>
            <div className="stat-pill glass-card">
              <span className="stat-value">{displayProfile.tech_cost_cut}</span>
              <span className="stat-label">Tech Cost Cut</span>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn-primary">
              <Download size={18} />
              Download Full CV
            </button>
            <button className="btn-secondary">
               Let's Connect
            </button>
          </div>
        </div>
      </div>

      {/* Brands Section (Ordered and Sized Up) */}
      <div className="brands-container mb-80">
        <div className="glass-card brand-box">
          <div className="brands-grid">
            <div className="brand-item">
              <img src="/brands/sheba-manager.png" alt="Sheba Manager" className="brand-logo" />
            </div>
            <div className="brand-item">
              <img src="/brands/sheba-pay.png" alt="Sheba Pay" className="brand-logo" />
            </div>
            <div className="brand-item">
              <img src="/brands/sheba-platform.png" alt="Sheba Platform" className="brand-logo" />
            </div>
            <div className="brand-item">
              <img src="/brands/ADN-Telecom.png" alt="ADN Telecom" className="brand-logo" />
            </div>
            <div className="brand-item">
              <img src="/brands/imagine-radio.png" alt="Imagine Radio" className="brand-logo" />
            </div>
            <div className="brand-item">
              <div className="brand-text-logo">QUBEE</div>
            </div>
            <div className="brand-item">
              <img src="/brands/Ericsson-Dark.png" alt="Ericsson" className="brand-logo" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Resume Tabs Section */}
      <div className="resume-layout">
        <aside className="inner-nav">
          <h4 className="nav-heading">NAVIGATION</h4>
          <ul className="inner-nav-list">
            <li className={`inner-nav-item ${activeSection === 'competencies' ? 'active' : ''}`} onClick={() => setActiveSection('competencies')}>
              <Activity size={18} /> Core Competencies
            </li>
            <li className={`inner-nav-item ${activeSection === 'experience' ? 'active' : ''}`} onClick={() => setActiveSection('experience')}>
              <Briefcase size={18} /> Experience
            </li>
            <li className={`inner-nav-item ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setActiveSection('skills')}>
              <Target size={18} /> Skills
            </li>
            <li className={`inner-nav-item ${activeSection === 'education' ? 'active' : ''}`} onClick={() => setActiveSection('education')}>
              <GraduationCap size={18} /> Education
            </li>
          </ul>
        </aside>

        <main className="resume-content">

          {/* COMPETENCIES SECTION */}
          {activeSection === 'competencies' && (
            <section className="animate-fade-in">
              <div className="section-heading-minimal">
                 <div className="section-icon-box"><Activity size={24} /></div>
                 <div>
                   <h2>Core Competencies</h2>
                   <p className="section-subtitle">Broad areas of strategic expertise</p>
                 </div>
              </div>
              <div className="competency-grid">
                 {(competencies.length > 0 ? competencies : [
                   { id: 1, name: 'Strategic Leadership', evidence: 'Directing complex business units and scaling operations from zero to market leadership.' },
                   { id: 2, name: 'Product Innovation', evidence: 'Conceptualizing and launching disruptive products in Fintech and Service sectors.' },
                   { id: 3, name: 'Financial Acumen', evidence: 'Managing P&L, optimizing operational costs, and driving significant GTV growth.' },
                   { id: 4, name: 'Stakeholder Management', evidence: 'Aligning cross-functional teams and building relationships with global partners.' }
                 ]).map((comp, idx) => (
                   <div key={comp.id} className="content-card glass-card">
                      <div className="card-icon-box">
                        {idx === 0 ? <TrendingUp size={24} /> : idx === 1 ? <Zap size={24} /> : idx === 2 ? <Code size={24} /> : <Users size={24} />}
                      </div>
                      <div className="card-body">
                        <h3>{comp.name}</h3>
                        <p>{comp.evidence}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </section>
          )}

          {/* SKILLS SECTION */}
          {activeSection === 'skills' && (
            <section className="animate-fade-in">
              <div className="section-heading-minimal">
                 <div className="section-icon-box"><Target size={24} /></div>
                 <div>
                   <h2>Skills</h2>
                   <p className="section-subtitle">Core technical and strategic competencies</p>
                 </div>
              </div>
              <div className="skills-hashtag-container">
                {(skills.length > 0 ? skills : [
                  { id: 1, name: 'BusinessModeling', evidence: 'Designing sustainable revenue models for tech platforms.' },
                  { id: 2, name: 'OperationalExcellence', evidence: 'Process re-engineering and automation for scale.' },
                  { id: 3, name: 'FintechEcosystem', evidence: 'Deep knowledge of payment gateways and digital finance.' }
                ]).map((item) => (
                  <div key={item.id} className="skill-hashtag-box glass-card">
                    <span className="skill-hashtag">#{item.name.replace(/\s+/g, '')}</span>
                    <p className="skill-hashtag-desc">{item.evidence}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE SECTION */}
          {activeSection === 'experience' && (
            <section className="animate-fade-in">
              <div className="section-heading-minimal">
                 <div className="section-icon-box"><Briefcase size={24} /></div>
                 <div>
                   <h2>Professional Experience</h2>
                   <p className="section-subtitle">A track record of driving growth and leading transformations</p>
                 </div>
              </div>
              <div className="experience-list">
                {experiences.map((exp) => (
                  <div key={exp.id} className="exp-item glass-card">
                    <div className="exp-marker"></div>
                    <div className="exp-header">
                       <div className="exp-title-box">
                         <h3>{exp.role}</h3>
                         <span className="exp-company">{exp.company}</span>
                       </div>
                       <div className="exp-meta">
                         <span className="exp-duration">{exp.duration}</span>
                         <span className="exp-location">{exp.location}</span>
                       </div>
                    </div>
                    <div className="exp-body">
                       {exp.contribution && exp.contribution.includes('\n') || exp.contribution.startsWith('-') || exp.contribution.startsWith('•') ? (
                         <ul className="exp-bullets">
                           {exp.contribution.split('\n').map((line: string, i: number) => {
                             const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                             if (!cleanLine) return null;
                             return <li key={i}>{cleanLine}</li>;
                           })}
                         </ul>
                       ) : (
                         <p>{exp.contribution}</p>
                       )}
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <p className="empty-state">No experience data found. Please add it via the Admin panel.</p>
                )}
              </div>
            </section>
          )}

          {/* EDUCATION SECTION */}
          {activeSection === 'education' && (
            <section className="animate-fade-in">
              <div className="section-heading-minimal">
                 <div className="section-icon-box"><GraduationCap size={24} /></div>
                 <div>
                   <h2>Education & Certifications</h2>
                   <p className="section-subtitle">Academic foundations and professional learning</p>
                 </div>
              </div>
              <div className="education-grid">
                {education.map((edu) => (
                  <div key={edu.id} className="content-card glass-card">
                    <div className="card-body">
                      <h3>{edu.degree}</h3>
                      <p className="edu-institution">{edu.institution}</p>
                      <span className="edu-duration">{edu.duration}</span>
                    </div>
                  </div>
                ))}
                {education.length === 0 && (
                   <p className="empty-state">No education data found.</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      <style jsx>{`
        .container { max-width: 1200px; margin: 0 auto; padding: 100px 20px; overflow-x: hidden; }
        .hero-section { display: grid; grid-template-columns: minmax(0, 350px) minmax(0, 1fr); gap: 60px; align-items: center; }
        .hero-title { font-size: 3.2rem; line-height: 1.1; margin-bottom: 30px; letter-spacing: -0.04em; color: #fff; font-weight: 900; white-space: nowrap; }
        .hero-bio { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; max-width: 750px; margin-bottom: 40px; }
        .text-accent-green { color: var(--accent-green); }
        .hero-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 40px; }
        .stat-pill { padding: 20px; text-align: center; }
        .stat-value { display: block; font-size: 1.8rem; font-weight: 800; color: var(--accent-green); margin-bottom: 4px; }
        .stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 600; }
        .hero-actions { display: flex; gap: 20px; }
        .btn-primary { background: var(--accent-green); color: #000; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.3s; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 16px 32px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .profile-card { padding: 40px; text-align: center; }
        .profile-image-placeholder { width: 150px; height: 150px; margin: 0 auto 30px; border-radius: 40px; background: linear-gradient(135deg, #10b981 0%, #064e3b 100%); padding: 3px; }
        .image-inner { width: 100%; height: 100%; background: #000; border-radius: 38px; display: flex; align-items: center; justify-content: center; }
        .profile-name { font-size: 1.8rem; margin-bottom: 8px; color: #fff; font-weight: 800; }
        .profile-title { font-size: 0.9rem; color: var(--accent-green); font-weight: 600; margin-bottom: 25px; }
        .profile-contacts { display: flex; flex-direction: column; gap: 12px; text-align: left; }
        .contact-item { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--text-muted); }
        .brand-box { padding: 25px 40px; }
        .brands-grid { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; padding: 0; }
        .brands-grid::-webkit-scrollbar { display: none; }
        .brand-item { display: flex; align-items: center; justify-content: center; flex: 1; min-width: 100px; }
        .brand-logo { height: 60px; width: auto; max-width: 150px; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.8; transition: all 0.3s ease; display: block; }
        /* Boost size for smaller logos */
        .brand-item:nth-child(1) .brand-logo, 
        .brand-item:nth-child(2) .brand-logo, 
        .brand-item:nth-child(3) .brand-logo { height: 85px; } 
        .brand-item:nth-child(5) .brand-logo { height: 140px; max-width: 200px; }
        
        .brand-logo:hover { opacity: 1; transform: scale(1.1); filter: none; }
        .brand-text-logo { font-size: 2.2rem; font-weight: 900; letter-spacing: 0.05em; color: #fff; opacity: 0.8; }
        .resume-layout { display: grid; grid-template-columns: minmax(0, 280px) minmax(0, 1fr); gap: 80px; }
        .inner-nav { position: sticky; top: 120px; height: fit-content; }
        .nav-heading { font-size: 0.75rem; letter-spacing: 0.2em; color: var(--text-muted); margin-bottom: 30px; }
        .inner-nav-list { list-style: none; padding: 0; }
        .inner-nav-item { padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 15px; cursor: pointer; color: var(--text-secondary); transition: all 0.3s; font-weight: 600; }
        .inner-nav-item.active { color: var(--accent-green); border-bottom-color: var(--accent-green); }
        .section-heading-minimal { display: flex; align-items: center; gap: 20px; margin-bottom: 50px; }
        .section-icon-box { width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--accent-green); }
        .section-subtitle { color: var(--text-muted); font-size: 0.95rem; margin-top: 4px; }
        .competency-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .content-card { padding: 30px; display: flex; gap: 20px; }
        .card-icon-box { width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; color: var(--accent-green); flex-shrink: 0; }
        .card-body h3 { font-size: 1.15rem; margin-bottom: 10px; color: #fff; font-weight: 700; word-wrap: break-word; overflow-wrap: break-word; }
        .card-body p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word; }
        .skills-hashtag-container { display: flex; flex-wrap: wrap; gap: 15px; }
        .skill-hashtag-box { padding: 25px; flex: 1 1 300px; }
        .skill-hashtag { color: var(--accent-green); font-weight: 800; font-size: 1.1rem; display: block; margin-bottom: 10px; }
        .skill-hashtag-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }
        .experience-list { display: flex; flex-direction: column; gap: 30px; }
        .exp-item { padding: 30px; position: relative; box-sizing: border-box; width: 100%; }
        .exp-marker { position: absolute; left: 0; top: 40px; width: 4px; height: 30px; background: var(--accent-green); border-radius: 0 4px 4px 0; }
        .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
        .exp-company { display: block; color: var(--accent-green); font-weight: 700; font-size: 0.9rem; margin-top: 5px; }
        .exp-meta { text-align: right; }
        .exp-duration { display: block; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .exp-location { font-size: 0.8rem; color: var(--text-muted); }
        .exp-body p { color: var(--text-secondary); line-height: 1.7; font-size: 1rem; word-wrap: break-word; overflow-wrap: break-word; }
        .exp-bullets { list-style: none; padding: 0; margin: 0; width: 100%; }
        .exp-bullets li { position: relative; padding-left: 24px; color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; margin-bottom: 12px; word-wrap: break-word; overflow-wrap: break-word; }
        .exp-bullets li::before { content: ''; position: absolute; left: 0; top: 10px; width: 6px; height: 6px; background: var(--accent-green); border-radius: 50%; box-shadow: 0 0 8px var(--accent-green-glow); }
        .education-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .edu-institution { color: var(--accent-green); font-weight: 600; margin: 10px 0 5px; }
        .edu-duration { font-size: 0.85rem; color: var(--text-muted); }
        .mb-80 { margin-bottom: 80px; }
        .empty-state { color: var(--text-muted); font-style: italic; }
        @media (max-width: 1100px) {
          .hero-section { grid-template-columns: 1fr; gap: 40px; }
          .resume-layout { grid-template-columns: 1fr; gap: 0; }
          .inner-nav {
            position: sticky;
            top: 70px;
            background: rgba(5, 5, 5, 0.97);
            backdrop-filter: blur(10px);
            z-index: 100;
            margin: 0 -20px 40px;
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            width: calc(100% + 40px);
            box-sizing: border-box;
          }
          .nav-heading { display: none; }
          .inner-nav-list { display: flex; flex-direction: row; overflow-x: auto; scrollbar-width: none; gap: 8px; }
          .inner-nav-list::-webkit-scrollbar { display: none; }
          .inner-nav-item { white-space: nowrap; border-bottom: none; border-radius: 100px; padding: 8px 18px; background: rgba(255,255,255,0.03); font-size: 0.85rem; border: 1px solid transparent; flex-shrink: 0; }
          .inner-nav-item.active { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); }
          .hero-stats { grid-template-columns: 1fr 1fr; }
          .hero-title { font-size: 2.5rem; white-space: normal; }
          .container { padding: 80px 20px; }
          .brands-grid { flex-wrap: wrap; justify-content: center; gap: 20px; }
          .brand-item { flex: 0 0 calc(33.33% - 14px); min-width: 80px; box-sizing: border-box; }
        }

        @media (max-width: 768px) {
          .container { padding: 70px 16px; overflow-x: hidden; }
          .hero-section { grid-template-columns: 1fr; gap: 24px; }
          .hero-title { font-size: 1.8rem; margin-bottom: 16px; white-space: normal; line-height: 1.2; }
          .hero-bio { font-size: 0.85rem; line-height: 1.6; max-width: 100%; }
          .hero-stats { grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
          .stat-pill { padding: 12px 8px; }
          .stat-value { font-size: 1.1rem; }
          .stat-label { font-size: 0.58rem; }
          .hero-actions { flex-direction: column; width: 100%; gap: 10px; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; padding: 14px 20px; font-size: 0.9rem; box-sizing: border-box; }
          .profile-card { padding: 20px; width: 100%; box-sizing: border-box; }
          .profile-image-placeholder { width: 90px; height: 90px; margin-bottom: 16px; }
          .profile-name { font-size: 1.2rem; }
          .profile-title { font-size: 0.78rem; margin-bottom: 14px; }
          .brands-grid { flex-wrap: wrap; justify-content: center; gap: 16px; }
          .brand-item { flex: 0 0 calc(33.33% - 11px); min-width: 0; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
          .brand-logo { height: 36px !important; max-width: 100%; object-fit: contain; }
          .brand-item:nth-child(1) .brand-logo, .brand-item:nth-child(2) .brand-logo, .brand-item:nth-child(3) .brand-logo { height: 46px !important; }
          .brand-item:nth-child(5) .brand-logo { height: 56px !important; }
          .resume-layout { grid-template-columns: 1fr; }
          .inner-nav { top: 60px; margin: 0 -16px 30px; padding: 10px 16px; width: calc(100% + 32px); box-sizing: border-box; }
          .competency-grid, .education-grid { grid-template-columns: 1fr; gap: 12px; }
          .content-card { padding: 16px; flex-direction: column; gap: 10px; align-items: flex-start; width: 100%; box-sizing: border-box; }
          .card-icon-box { width: 36px; height: 36px; flex-shrink: 0; }
          .card-body h3 { font-size: 0.95rem; line-height: 1.4; }
          .card-body p { font-size: 0.82rem; }
          .section-heading-minimal { margin-bottom: 20px; gap: 10px; width: 100%; }
          .section-icon-box { width: 36px; height: 36px; }
          .section-subtitle { font-size: 0.8rem; }
          .exp-item { padding: 18px 16px; width: 100%; box-sizing: border-box; }
          .exp-header { flex-direction: column; gap: 6px; margin-bottom: 14px; }
          .exp-meta { text-align: left; }
          .exp-duration { font-size: 0.85rem; }
          .exp-location { font-size: 0.75rem; }
          .exp-body p { font-size: 0.85rem; }
          .exp-bullets li { font-size: 0.85rem; padding-left: 18px; margin-bottom: 8px; }
          .experience-list { gap: 16px; }
          .skills-hashtag-container { gap: 8px; width: 100%; }
          .skill-hashtag-box { padding: 14px; flex: 1 1 100%; box-sizing: border-box; }
          .skill-hashtag { font-size: 0.95rem; }
          .skill-hashtag-desc { font-size: 0.78rem; }
          .mb-80 { margin-bottom: 40px; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 1.5rem; }
          .hero-stats { grid-template-columns: 1fr 1fr; }
          .brand-item { flex: 0 0 calc(50% - 8px); }
          .inner-nav { margin: 0 -16px 24px; padding: 10px 16px; }
        }
      `}</style>
    </div>
  );
}
