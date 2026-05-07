'use client';

import { 
  Briefcase, GraduationCap, Code, Award, Download, 
  Activity, TrendingUp, Target, Users, Zap, 
  Phone, Mail, MapPin, Link, Rocket, ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState('competencies');

  const skillEvidences = [
    {
      skill: "Strategy",
      evidence: "Optimized 75% tech cost and doubled revenue to survive a business shutdown."
    },
    {
      skill: "Product Management",
      evidence: "Tuned commercial strategy, introducing new product lines to double GTV in 4 months."
    },
    {
      skill: "Leadership",
      evidence: "Assembled an expert team to successfully acquire Bangladesh Bank PSP license at the first attempt."
    },
    {
      skill: "Technology",
      evidence: "Led technological modernization to launch a digital payment collection service, driving 10x GTV growth."
    },
    {
      skill: "User Analysis",
      evidence: "Leveraged user behavior insights to reach 100K monthly active users in one year."
    },
    {
      skill: "Growth",
      evidence: "Secured 3x merchant number growth and 1.5x subscription revenue growth within 6 months."
    },
    {
      skill: "Project Management",
      evidence: "Successfully delivered a countrywide Microwave SDH transmission project in just 6 months."
    },
    {
      skill: "Process Management",
      evidence: "Optimized yearly operational infrastructure costs by 25% through partner negotiation."
    },
    {
      skill: "Transformation",
      evidence: "Transformed product operations, cutting sales complaints from 7% to 3% and improving margins."
    },
    {
      skill: "Modernization",
      evidence: "Initiated a pilot project for rural WiFi from technical solution design to hotspot implementation."
    },
    {
      skill: "AI",
      evidence: "Applying advanced data-driven automation to optimize business scaling and operational efficiency."
    }
  ];

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
            <h2 className="profile-name">Ahmed Rakib Uddin</h2>
            <p className="profile-title">Chief Executive Officer | Strategic Leader</p>
            
            <div className="profile-contacts">
               <div className="contact-item">
                 <Phone size={16} />
                 <span>+880 1841 672 217</span>
               </div>
               <div className="contact-item">
                 <Mail size={16} />
                 <span>rakib_2001331022@yahoo.com</span>
               </div>
               <div className="contact-item">
                 <MapPin size={16} />
                 <span>Dhaka, Bangladesh</span>
               </div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <h1 className="hero-title">
            Building Business <br />
            <span className="accent-text">That Matters</span>
          </h1>
          <p className="hero-bio">
            Dynamic strategic professional with 18 years of leadership experience, specializing in the development of complex technological products and scalable business and growth operations across Fintech, SME, telecom and service. Blends deep technical expertise with strategic business acumen, using user behavior analysis and business modeling to drive innovation.
          </p>

          <div className="hero-metrics">
            <div className="metric-box glass-card">
               <Briefcase size={20} className="icon-green" />
               <div className="metric-number">18+</div>
               <div className="metric-text">Years Experience</div>
            </div>
            <div className="metric-box glass-card">
               <Rocket size={20} className="icon-green" />
               <div className="metric-number">10x</div>
               <div className="metric-text">GTV Growth</div>
            </div>
            <div className="metric-box glass-card">
               <Users size={20} className="icon-green" />
               <div className="metric-number">3x</div>
               <div className="metric-text">Merchant Growth</div>
            </div>
            <div className="metric-box glass-card">
               <ArrowUpRight size={20} className="icon-green" />
               <div className="metric-number">75%</div>
               <div className="metric-text">Tech Cost Cut</div>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn-primary">
              <Mail size={18} /> Contact Me
            </button>
            <button className="btn-secondary">
              <Download size={18} /> Download Resume
            </button>
            <button className="btn-secondary">
              <Link size={18} /> LinkedIn
            </button>
          </div>
        </div>
      </div>

      {/* Brands Section */}
      <div className="brands-section mb-80 animate-fade-in">
        <p className="brands-title">BRANDS I HAVE LED & TRANSFORMED</p>
        <div className="brands-container glass-card">
          <div className="brands-track">
            <div className="brand-item">
              <img src="/brands/sheba-manager.png" alt="Sheba Manager" className="brand-logo" style={{ height: '130px' }} />
              <span>Sheba Manager</span>
            </div>
            <div className="brand-item">
              <img src="/brands/sheba-pay.png" alt="Sheba Pay" className="brand-logo" style={{ height: '130px' }} />
              <span>Sheba Pay</span>
            </div>
            <div className="brand-item">
              <img src="/brands/sheba-platform.png" alt="Sheba Platform" className="brand-logo" style={{ height: '130px' }} />
              <span>Sheba Platform</span>
            </div>
            <div className="brand-item">
              <img src="/brands/ADN-Telecom.png" alt="ADN Telecom" className="brand-logo" style={{ height: '65px' }} />
              <span>ADN Telecom</span>
            </div>
            <div className="brand-item">
              <img src="/brands/imagine-radio.png" alt="Imagine Radio" className="brand-logo" style={{ height: '240px', margin: '-60px 0' }} />
              <span>Imagine Radio</span>
            </div>
            <div className="brand-item">
              <div className="brand-text-logo" style={{ fontSize: '1.6rem', height: '65px' }}>QUBEE</div>
              <span>Qubee</span>
            </div>
            <div className="brand-item">
              <img src="/brands/Ericsson-Dark.png" alt="Ericsson" className="brand-logo" style={{ height: '45px' }} />
              <span>Ericsson</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs Section */}
      <div className="resume-layout">
        <aside className="inner-nav">
          <h4 className="nav-heading">NAVIGATION</h4>
          <ul className="inner-nav-list">
            <li 
              className={`inner-nav-item ${activeSection === 'competencies' ? 'active' : ''}`}
              onClick={() => setActiveSection('competencies')}
            >
              <Activity size={18} /> Core Competencies
            </li>
            <li 
              className={`inner-nav-item ${activeSection === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveSection('experience')}
            >
              <Briefcase size={18} /> Experience
            </li>
            <li 
              className={`inner-nav-item ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveSection('skills')}
            >
              <Target size={18} /> Skills
            </li>
            <li 
              className={`inner-nav-item ${activeSection === 'education' ? 'active' : ''}`}
              onClick={() => setActiveSection('education')}
            >
              <GraduationCap size={18} /> Education
            </li>
          </ul>
        </aside>

        <main className="resume-content">

          {/* COMPETENCIES SECTION */}
          {activeSection === 'competencies' && (
            <section className="animate-fade-in">
              <div className="section-heading-minimal">
                 <div className="section-icon-box">
                    <Activity size={24} />
                 </div>
                 <div>
                   <h2>Core Competencies</h2>
                   <p className="section-subtitle">Broad areas of strategic expertise</p>
                 </div>
              </div>
              <div className="competency-grid">
                 <div className="content-card glass-card">
                    <div className="card-icon-box">
                      <TrendingUp size={24} />
                    </div>
                    <div className="card-body">
                      <h3>Business Transformation & Turnarounds</h3>
                      <p>Driving large-scale transformations, restoring profitability, embedding cost discipline, and leading cross-functional teams through periods of crisis.</p>
                    </div>
                 </div>
                 <div className="content-card glass-card">
                    <div className="card-icon-box">
                      <Zap size={24} />
                    </div>
                    <div className="card-body">
                      <h3>Growth & Revenue Strategy</h3>
                      <p>Creating and executing strategies for new revenue streams, innovative products, distribution channels, and process improvisation.</p>
                    </div>
                 </div>
                 <div className="content-card glass-card">
                    <div className="card-icon-box">
                      <Code size={24} />
                    </div>
                    <div className="card-body">
                      <h3>Technological Product Innovation</h3>
                      <p>Develop and implement scalable and efficient data-driven product strategies to build the right business product.</p>
                    </div>
                 </div>
                 <div className="content-card glass-card">
                    <div className="card-icon-box">
                      <Users size={24} />
                    </div>
                    <div className="card-body">
                      <h3>Strategic Partnership</h3>
                      <p>Partner up with right fit organizations to establish partnerships as important revenue and a solid growth channel.</p>
                    </div>
                 </div>
              </div>
            </section>
          )}

          {/* SKILLS SECTION */}
          {activeSection === 'skills' && (
            <section className="animate-fade-in">
              <div className="section-heading-minimal">
                 <div className="section-icon-box">
                    <Target size={24} />
                 </div>
                 <div>
                   <h2>Skills</h2>
                   <p className="section-subtitle">Core technical and strategic competencies</p>
                 </div>
              </div>
              
              <div className="skills-hashtag-container">
                {skillEvidences.map((item, index) => (
                  <div key={index} className="skill-hashtag-box glass-card">
                    <span className="skill-hashtag">#{item.skill.replace(/\s+/g, '')}</span>
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
                 <div className="section-icon-box">
                    <Briefcase size={24} />
                 </div>
                 <div>
                   <h2>Professional Experience</h2>
                   <p className="section-subtitle">A track record of driving growth and leading transformations</p>
                 </div>
              </div>
              
              <div className="experience-list">
                {/* Experience 1 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Chief Executive Officer</h3>
                         <span className="company">Sheba Merchants Ltd | Dhaka, Bangladesh</span>
                       </div>
                       <div className="date-badge">Feb 2025 – Present</div>
                    </div>
                    <p className="exp-contribution">Contribution: Technological product transformation and modernization to make the product business ready, drive early growth and fixed necessary business processes to scale up the business.</p>
                    <ul className="exp-bullets">
                      <li>Product transformation and modernized, launched digital payment collection service which resulted 10x GTV growth in 5 months.</li>
                      <li>1.5X subscription revenue growth in 6 months and 5 M BDT revenue generation from alternate source.</li>
                      <li>3X Merchant number growth securing growth of north star matrix for the business.</li>
                      <li>Directed strategic improvements in sales strategy & operations, cutting sales complaints and refunds from 7% to 3% and improved Contribution margin from 15% to 28%.</li>
                      <li>Reduced high value merchant churn rate from 9% to 4%.</li>
                    </ul>
                    <div className="metrics-container">
                      <div className="metric-badge">
                         <span className="metric-val">10x</span>
                         <span className="metric-label">GTV Growth</span>
                      </div>
                      <div className="metric-badge">
                         <span className="metric-val">1.5x</span>
                         <span className="metric-label">Subscription Rev</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience 2 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Deputy Chief Executive Officer</h3>
                         <span className="company">Sheba Fintech Limited | Dhaka, Bangladesh</span>
                       </div>
                       <div className="date-badge">Jun 2023 – Jan 2025</div>
                    </div>
                    <p className="exp-contribution">Contribution: Technological and compliance readiness of the organization at lowest possible cost to avail PSP license from Bangladesh Bank, Make the organization commercial ready and launch sheba pay service in the market.</p>
                    <ul className="exp-bullets">
                      <li>With a team without any Technological and Fintech background, with extremely limited budget, assembled a group of experts and completed all necessary readiness for Bangladesh Bank Audit for PSP license at single attempt.</li>
                      <li>Partnered with major banks, MFS and PSOs, Set up total Fintech eMoney operation along with necessary reporting structure with Bangladesh Bank.</li>
                      <li>Tested Sheba Pay wallet for merchants, Launched commercially, migrated all merchants from old structure to new wallet system, started generating revenue.</li>
                    </ul>
                  </div>
                </div>

                {/* Experience 3 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Chief Strategy Officer</h3>
                         <span className="company">Sheba Platform Limited</span>
                       </div>
                       <div className="date-badge">Oct 2022 – Jun 2023</div>
                    </div>
                    <p className="exp-contribution">Context: Helped the company to survive a possible business shut down, liaison with board member and share holders to avail interim breath investment, streamlined scaled down operation, kept all business alive, despite all odds revenue almost doubled up.</p>
                    <ul className="exp-bullets">
                      <li>Optimized 75% Technology cost and defined operational and development procedure to keep business running as it is and alive.</li>
                      <li>Optimized 60% Business Operation cost, defined new processes to improved overall efficiency and productivity.</li>
                      <li>Drive the business to double growth despite all odds to maintain the business profile attractive to existing and new investors.</li>
                    </ul>
                    <div className="metrics-container">
                      <div className="metric-badge">
                         <span className="metric-val">75%</span>
                         <span className="metric-label">Tech Cost Cut</span>
                      </div>
                      <div className="metric-badge">
                         <span className="metric-val">60%</span>
                         <span className="metric-label">Ops Cost Cut</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience 4 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Senior Vice President</h3>
                         <span className="company">Sheba Platform Limited</span>
                       </div>
                       <div className="date-badge">Jan 2022 – Sep 2022</div>
                    </div>
                    <p className="exp-contribution">Context: Joined the team and took over business operations to accelerate hyper growth to make business metrics acceptable to be considered for VC investment.</p>
                    <ul className="exp-bullets">
                      <li>Tune commercial strategy to make the product market fit and drive 3 times active merchants growth in 4 months.</li>
                      <li>Introduce new product line to drive Gross Transaction value double in 4 months.</li>
                    </ul>
                    <div className="metrics-container">
                      <div className="metric-badge">
                         <span className="metric-val">3x</span>
                         <span className="metric-label">Merchant Growth</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience 5 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Senior Manager, Regional and Retail Business</h3>
                         <span className="company">ADN Telecom</span>
                       </div>
                       <div className="date-badge">Dec 2020 – Jan 2022</div>
                    </div>
                    <ul className="exp-bullets mt-3">
                      <li>Improved infrastructure and Bandwidth cost almost 25% by negotiating with partners and portfolio rearrangement.</li>
                      <li>Expanding Regional Business to 6 Districts.</li>
                      <li>Initiated the Pilot project of rural WiFi, from technical solution to business case validation and 5 hotspots implementation.</li>
                    </ul>
                  </div>
                </div>

                {/* Experience 6 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Co-founder and Chief Operating Officer</h3>
                         <span className="company">Imagine Radio</span>
                       </div>
                       <div className="date-badge">Jan 2019 – Oct 2020</div>
                    </div>
                    <ul className="exp-bullets mt-3">
                      <li>First ever local built cross platform music streaming application.</li>
                      <li>Reached 100K monthly active users in 1 year time.</li>
                    </ul>
                  </div>
                </div>

                {/* Experience 7 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Manager, Business Process & Service Innovation / RAN</h3>
                         <span className="company">QUBEE</span>
                       </div>
                       <div className="date-badge">Jun 2010 – Dec 2018</div>
                    </div>
                    <ul className="exp-bullets mt-3">
                      <li>Established 3rd party delivery partner services first time to distribute devices to customer doorsteps.</li>
                      <li>Optimized the operational cost of infrastructure yearly 25% by negotiating and portfolio rearrangement.</li>
                      <li>Delivered Critical network antenna swap project without any network and revenue compromise.</li>
                    </ul>
                  </div>
                </div>

                {/* Experience 8 */}
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Briefcase size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>Implementation Manager</h3>
                         <span className="company">LM ERICSSON Bangladesh Ltd</span>
                       </div>
                       <div className="date-badge">May 2007 – Jun 2010</div>
                    </div>
                    <ul className="exp-bullets mt-3">
                      <li>Replaced Foreign experienced resource in 1 year to reduce significant cost of service.</li>
                      <li>Delivered and handed over successfully a long pending country wide Microwave SDH transmission project of Warid telecom (now Airtel) in just 6 months.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* EDUCATION SECTION */}
          {activeSection === 'education' && (
            <section className="animate-fade-in">
              <div className="section-heading-minimal">
                 <div className="section-icon-box">
                    <GraduationCap size={24} />
                 </div>
                 <div>
                   <h2>Academic Qualifications</h2>
                   <p className="section-subtitle">Educational background and certifications</p>
                 </div>
              </div>
              <div className="experience-list">
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <GraduationCap size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>MBA in Finance</h3>
                         <span className="company">East West University</span>
                       </div>
                       <div className="date-badge">2010 - 2012</div>
                    </div>
                  </div>
                </div>
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <GraduationCap size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>B.Sc. in CSE</h3>
                         <span className="company">Shah Jalal University of Science & Technology</span>
                       </div>
                       <div className="date-badge">2002 - 2007</div>
                    </div>
                  </div>
                </div>
                
                <div className="content-card glass-card exp-card">
                  <div className="card-icon-box">
                     <Award size={24} />
                  </div>
                  <div className="card-body">
                    <div className="exp-header">
                       <div>
                         <h3>PRINCE2® Certifications</h3>
                         <span className="company">Professional Credentials</span>
                       </div>
                    </div>
                    <ul className="exp-bullets mt-3">
                      <li>PRINCE2 Foundation Certificate</li>
                      <li>PRINCE2® Practitioner</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>

      <style jsx>{`
        .mb-80 { margin-bottom: 80px; }
        .icon-green { color: var(--accent-green); }
        .icon-muted { color: var(--text-muted); }
        
        .hero-section {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          margin-top: 40px;
        }

        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
          }
        }

        .profile-card {
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .profile-image-placeholder {
          width: 140px;
          height: 140px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          margin: 0 auto 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .profile-name {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .profile-title {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0 0 30px 0;
          line-height: 1.5;
        }

        .profile-contacts {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .skills-hashtag-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .skill-hashtag-box {
          padding: 24px;
          border-radius: 12px;
          border-left: 3px solid rgba(16, 185, 129, 0.1);
          transition: all 0.3s ease;
        }
        .skill-hashtag-box:hover {
          border-left-color: var(--accent-green);
          background: rgba(16, 185, 129, 0.05);
          transform: translateY(-2px);
        }
        .skill-hashtag {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--accent-green);
          display: block;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .skill-hashtag-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .hero-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-title {
          font-size: 3rem;
          line-height: 1.1;
          margin: 0 0 24px 0;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }
        }

        .hero-bio {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1.05rem;
          margin: 0 0 32px 0;
          max-width: 800px;
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        @media (max-width: 1024px) {
          .hero-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .metric-box {
          padding: 20px;
          border-radius: 16px;
        }

        .metric-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 12px 0 4px 0;
        }

        .metric-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent-green);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          background: #0ea5e9;
          transform: translateY(-2px);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }


        .resume-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          align-items: flex-start;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 60px;
        }

        @media (max-width: 900px) {
          .resume-layout {
            grid-template-columns: 1fr;
          }
          .inner-nav {
            position: relative;
            top: 0;
          }
        }

        .inner-nav {
          position: sticky;
          top: 100px;
        }

        .nav-heading {
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          margin: 0 0 16px 0;
          padding-left: 16px;
        }

        .inner-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .inner-nav-item {
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        }

        .inner-nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .inner-nav-item.active {
          color: #000;
          background: var(--accent-green);
        }


        .resume-content {
          padding-bottom: 100px;
        }

        .section-heading-minimal {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .section-icon-box {
          width: 56px;
          height: 56px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-heading-minimal h2 {
          font-size: 2rem;
          margin: 0 0 4px 0;
          color: var(--text-primary);
        }
        
        .section-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }
        
        .skills-pill-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .skill-pill {
          background: var(--accent-green);
          color: #000;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
          transition: all 0.3s ease;
          display: inline-block;
          white-space: nowrap;
          text-align: center;
          width: 100%;
        }
        .skill-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(16, 185, 129, 0.5);
        }

        .content-card {
          padding: 30px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255,255,255,0.05);
          color: var(--text-secondary);
          line-height: 1.7;
          transition: all 0.3s ease;
        }
        .content-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .competency-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .competency-grid .content-card {
          display: flex;
          gap: 20px;
        }
        .competency-grid h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
          font-size: 1.2rem;
        }

        .card-icon-box {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .experience-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .exp-card {
          display: flex;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .exp-card, .competency-grid .content-card {
            flex-direction: column;
            gap: 16px;
          }
          .skill-evidence-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .skill-pill-wrapper {
            flex: none;
          }
        }

        .card-body {
          flex: 1;
        }

        .exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .exp-header h3 {
          color: var(--text-primary);
          font-size: 1.3rem;
          margin: 0 0 4px 0;
        }

        .company {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .date-badge {
          background: rgba(255,255,255,0.05);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .exp-contribution {
          margin-bottom: 16px;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .exp-bullets {
          padding-left: 20px;
          margin: 0;
          color: var(--text-secondary);
          list-style-type: disc;
        }
        .exp-bullets li {
          margin-bottom: 8px;
        }
        .exp-bullets.mt-3 {
          margin-top: 12px;
        }

        .metrics-container {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .metric-badge {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.15);
          padding: 8px 16px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          color: var(--accent-green);
          font-weight: 700;
          font-size: 1.2rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .brands-section {
          text-align: center;
        }
        .brands-title {
          font-size: 0.85rem;
          color: var(--text-muted);
          letter-spacing: 0.15em;
          margin-bottom: 24px;
        }
        .brands-container {
          padding: 20px 40px 30px 40px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
        }
        .brands-track {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 60px;
          flex-wrap: wrap;
        }
        .brand-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 140px;
        }
        .brand-item span {
          position: absolute;
          bottom: -15px;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
          opacity: 0;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .brand-item:hover span {
          opacity: 1;
          bottom: -10px;
        }
        .brand-logo {
          object-fit: contain;
          filter: grayscale(100%) brightness(1.6) opacity(0.85);
          transition: all 0.3s ease;
        }
        .brand-item:hover .brand-logo {
          filter: grayscale(0%) brightness(1) opacity(1);
          transform: scale(1.1);
        }
        .brand-text-logo {
          font-weight: 800;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        .brand-item:hover .brand-text-logo {
          color: var(--accent-green);
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .brands-track {
            gap: 30px;
          }
          .brand-logo, .brand-text-logo {
            height: 55px;
          }
        }
      `}</style>
    </div>
  );
}
