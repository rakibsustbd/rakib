'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ResumePrintPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [profileRes, skillsRes, expRes, eduRes] = await Promise.all([
        supabase.from('skills').select('*').eq('category', 'profile_config'),
        supabase.from('skills').select('*').neq('category', 'profile_config').order('order_index', { ascending: true }),
        supabase.from('experiences').select('*').order('order_index', { ascending: true }),
        supabase.from('education').select('*').order('order_index', { ascending: true })
      ]);

      const config: any = {};
      profileRes.data?.forEach(item => {
        config[item.name] = item.evidence;
      });

      setData({
        profile: config,
        competencies: skillsRes.data?.filter(s => s.category === 'competency') || [],
        experiences: expRes.data || [],
        education: eduRes.data || []
      });
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && data) {
      // Small delay to ensure styles are loaded
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [isLoading, data]);

  if (isLoading || !data) return <div style={{ padding: '50px', textAlign: 'center' }}>Preparing Resume for Print...</div>;

  const profile = {
    name: data.profile.name || 'Ahmed Rakib Uddin',
    title: data.profile.title || 'Chief Executive Officer | Strategic Leader',
    bio: data.profile.bio || '',
    phone: data.profile.phone || '+880 1841 672 217',
    email: data.profile.email || 'rakib_2001331022@yahoo.com',
    location: data.profile.location || 'Dhaka, Bangladesh'
  };

  return (
    <div className="print-container">
      <header className="print-header">
        <h1>{profile.name}</h1>
        <div className="header-contact">
          <span className="contact-item"><Phone size={12} /> {profile.phone}</span>
          <span className="divider">|</span>
          <span className="contact-item"><Mail size={12} /> {profile.email}</span>
          <span className="divider">|</span>
          <span className="contact-item"><MapPin size={12} /> {profile.location}</span>
        </div>
      </header>

      <div className="print-body">
        <section className="print-section">
          <h2>Executive Profile</h2>
          <p className="profile-bio">{profile.bio}</p>
        </section>

        <section className="print-section">
          <h2>Core Competencies</h2>
          <div className="competencies-grid">
            {data.competencies.map((comp: any, i: number) => (
              <div key={i} className="comp-item">
                <span className="comp-label">{comp.name}:</span>
                <span className="comp-desc"> {comp.evidence}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="print-section">
          <h2>Professional Experience</h2>
          {data.experiences.map((exp: any, i: number) => (
            <div key={i} className="experience-item">
              <div className="exp-header">
                <div className="exp-title-box">
                  <span className="role">{exp.role}</span>
                  <span className="company">{exp.company}</span>
                </div>
                <div className="exp-meta">
                  <span className="duration">{exp.duration}</span>
                  <span className="location">{exp.location}</span>
                </div>
              </div>
              <div className="exp-content">
                {exp.contribution && (exp.contribution.includes('\n') || exp.contribution.startsWith('-')) ? (
                  <ul className="print-bullets">
                    {exp.contribution.split('\n').map((line: string, idx: number) => {
                      const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                      if (!cleanLine) return null;
                      return <li key={idx}>{cleanLine}</li>;
                    })}
                  </ul>
                ) : (
                  <p>{exp.contribution}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="print-section">
          <h2>Education</h2>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="education-item">
              <div className="edu-header">
                <span className="degree">{edu.degree}</span>
                <span className="duration">{edu.duration}</span>
              </div>
              <p className="institution">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @media print {
          @page { margin: 12.7mm 20mm 20mm; size: A4; }
          body { background: #fff !important; color: #000 !important; font-family: 'Inter', sans-serif !important; }
          .top-nav, .no-print, .mobile-menu-btn { display: none !important; }
        }

        .top-nav { display: none !important; }

        .print-container {
          max-width: 180mm;
          margin: 0 auto;
          background: #fff;
          color: #111;
          font-family: 'Inter', sans-serif;
          padding: 0;
          line-height: 1.5;
        }

        .print-header {
          text-align: left;
          border-bottom: 1px solid #10b981;
          padding-bottom: 10px;
          margin-bottom: 22px;
        }

        .print-header h1 { font-size: 22pt; margin: 0; font-weight: 800; letter-spacing: -0.02em; color: #000; }
        .header-contact { font-size: 9pt; color: #4b5563; display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .contact-item { display: flex; align-items: center; gap: 4px; }
        .divider { color: #d1d5db; }

        .print-body { display: flex; flex-direction: column; gap: 28px; }
        
        .print-section h2 { 
          font-size: 13pt; 
          font-weight: 800; 
          border-bottom: 1px solid #e5e7eb; 
          padding-bottom: 4px; 
          margin-bottom: 10px; 
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .profile-bio { font-size: 10pt; color: #374151; text-align: justify; margin: 0; line-height: 1.5; }

        .experience-item { margin-bottom: 20px; page-break-inside: avoid; }
        .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
        .exp-title-box .role { font-size: 11.5pt; font-weight: 800; display: block; color: #000; }
        .exp-title-box .company { font-size: 10.5pt; font-weight: 700; color: #10b981; }
        .exp-meta { text-align: right; font-size: 9pt; }
        .exp-meta .duration { font-weight: 700; display: block; color: #111; }
        .exp-meta .location { color: #6b7280; }

        .exp-content { font-size: 9.5pt; color: #374151; }
        .print-bullets { padding-left: 18px; margin: 6px 0; }
        .print-bullets li { margin-bottom: 4px; list-style-type: disc; }

        .competencies-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .comp-item { font-size: 9.5pt; line-height: 1.4; }
        .comp-label { font-weight: 700; color: #111; }
        .comp-desc { color: #4b5563; }

        .education-item { margin-bottom: 15px; }
        .edu-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 10.5pt; }
        .institution { font-size: 9.5pt; color: #4b5563; margin: 2px 0 0; }
      `}</style>
    </div>
  );
}
