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

      if (profileRes.data) {
        const config: any = {};
        profileRes.data.forEach(item => {
          config[item.name] = item.evidence;
        });
        setProfile(config);
      }

      if (skillsRes.data) {
        setCompetencies(skillsRes.data.filter(s => s.category === 'competency'));
        setSkills(skillsRes.data.filter(s => s.category !== 'competency'));
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

  // Fallback if profile not loaded
  const displayProfile = profile || {
    name: 'Ahmed Rakib Uddin',
    title: 'Chief Executive Officer | Strategic Leader',
    bio: 'Dynamic strategic professional with 18 years of leadership experience...',
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
          <h1 className="hero-title">
            Building Business <br />
            <span className="accent-text">That Matters</span>
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

      {/* Brands Section */}
      <div className="brands-container mb-80">
        <div className="glass-card p-40">
          <h4 className="brands-title">EXPERIENCE WITH GLOBAL & LOCAL LEADERS</h4>
          <div className="brands-grid">
            <div className="brand-item">
              <img src="/brands/bkash.png" alt="bKash" className="brand-logo" />
              <span>bKash</span>
            </div>
            <div className="brand-item">
              <img src="/brands/sheba-platform.png" alt="Sheba Platform" className="brand-logo" />
              <span>Sheba Platform</span>
            </div>
            <div className="brand-item">
              <img src="/brands/ADN-Telecom.png" alt="ADN Telecom" className="brand-logo" />
              <span>ADN Telecom</span>
            </div>
            <div className="brand-item">
              <div className="brand-text-logo">QUBEE</div>
              <span>Qubee</span>
            </div>
            <div className="brand-item">
              <img src="/brands/Ericsson-Dark.png" alt="Ericsson" className="brand-logo" />
              <span>Ericsson</span>
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
                 {competencies.map((comp, idx) => (
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
                {skills.map((item) => (
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
                       <p>{exp.contribution}</p>
                    </div>
                  </div>
                ))}
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
              </div>
            </section>
          )}
        </main>
      </div>

      <style jsx>{`
        .container { max-width: 1200px; margin: 0 auto; padding: 100px 20px; }
        .hero-section { display: grid; grid-template-columns: 350px 1fr; gap: 60px; align-items: center; }
        .hero-title { font-size: 4.5rem; line-height: 1.1; margin-bottom: 30px; letter-spacing: -0.04em; }
        .hero-bio { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; max-width: 700px; margin-bottom: 40px; }
        .accent-text { color: var(--accent-green); }
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
        .profile-name { font-size: 1.8rem; margin-bottom: 8px; }
        .profile-title { font-size: 0.9rem; color: var(--accent-green); font-weight: 600; margin-bottom: 25px; }
        .profile-contacts { display: flex; flex-direction: column; gap: 12px; text-align: left; }
        .contact-item { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--text-muted); }
        .brands-title { font-size: 0.8rem; letter-spacing: 0.2em; color: var(--text-muted); text-align: center; margin-bottom: 40px; font-weight: 800; }
        .brands-grid { display: flex; justify-content: space-between; align-items: center; filter: grayscale(1) opacity(0.5); }
        .brand-item { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .brand-logo { height: 40px; object-fit: contain; }
        .brand-text-logo { font-weight: 900; font-size: 1.2rem; height: 40px; display: flex; align-items: center; }
        .resume-layout { display: grid; grid-template-columns: 280px 1fr; gap: 80px; }
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
        .card-body h3 { font-size: 1.15rem; margin-bottom: 10px; }
        .card-body p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; }
        .skills-hashtag-container { display: flex; flex-wrap: wrap; gap: 15px; }
        .skill-hashtag-box { padding: 25px; flex: 1 1 300px; }
        .skill-hashtag { color: var(--accent-green); font-weight: 800; font-size: 1.1rem; display: block; margin-bottom: 10px; }
        .skill-hashtag-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }
        .experience-list { display: flex; flex-direction: column; gap: 30px; }
        .exp-item { padding: 40px; position: relative; }
        .exp-marker { position: absolute; left: 0; top: 40px; width: 4px; height: 30px; background: var(--accent-green); border-radius: 0 4px 4px 0; }
        .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
        .exp-company { display: block; color: var(--accent-green); font-weight: 700; font-size: 0.9rem; margin-top: 5px; }
        .exp-meta { text-align: right; }
        .exp-duration { display: block; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .exp-location { font-size: 0.8rem; color: var(--text-muted); }
        .exp-body p { color: var(--text-secondary); line-height: 1.7; font-size: 1rem; }
        .education-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .edu-institution { color: var(--accent-green); font-weight: 600; margin: 10px 0 5px; }
        .edu-duration { font-size: 0.85rem; color: var(--text-muted); }
        .mb-80 { margin-bottom: 80px; }
        @media (max-width: 1100px) {
          .hero-section { grid-template-columns: 1fr; }
          .resume-layout { grid-template-columns: 1fr; gap: 40px; }
          .inner-nav { position: relative; top: 0; }
          .hero-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
