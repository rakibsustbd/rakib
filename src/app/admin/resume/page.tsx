'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Briefcase, 
  GraduationCap, 
  Target,
  Edit2,
  X,
  Loader2,
  Activity,
  User,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  TrendingUp,
  Rocket,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminResume() {
  const [activeTab, setActiveTab] = useState('overview'); // Default to Overview (Profile Editor)
  const [items, setItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchProfile();
    } else {
      fetchData();
    }
  }, [activeTab]);

  async function fetchProfile() {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('skills')
        .select('*')
        .eq('category', 'profile_config');
      
      if (data && data.length > 0) {
        const config: any = {};
        data.forEach(item => {
          config[item.name] = item.evidence;
        });
        setProfile(config);
      } else {
        setProfile({
          name: 'Ahmed Rakib Uddin',
          title: 'Chief Executive Officer | Strategic Leader',
          bio: 'Strategic leader with 18 years of experience in Fintech and Telecom.',
          phone: '+880 1841 672 217',
          email: 'rakib_2001331022@yahoo.com',
          location: 'Dhaka, Bangladesh',
          linkedin: 'https://linkedin.com/in/ahmed-rakib',
          years_experience: '18+',
          gtv_growth: '10x',
          merchant_growth: '3x',
          tech_cost_cut: '75%'
        });
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  }

  async function fetchData() {
    setIsLoading(true);
    let table = '';
    if (activeTab === 'experience') table = 'experiences';
    else if (activeTab === 'education') table = 'education';
    else table = 'skills';

    const { data } = await supabase
      .from(table)
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) {
      if (activeTab === 'skills') {
        setItems(data.filter((i: any) => i.category !== 'competency' && i.category !== 'profile_config'));
      } else if (activeTab === 'competencies') {
        setItems(data.filter((i: any) => i.category === 'competency'));
      } else {
        setItems(data);
      }
    }
    setIsLoading(false);
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updates = Object.entries(profile).map(([key, value]) => ({
      name: key,
      evidence: value as string,
      category: 'profile_config',
      order_index: 0
    }));

    for (const update of updates) {
      await supabase.from('skills').upsert(update, { onConflict: 'name,category' });
    }
    alert('Profile updated successfully!');
    setIsSaving(false);
  };

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      if (activeTab === 'experience') {
        setFormData({ company: '', role: '', duration: '', location: '', contribution: '', order_index: items.length });
      } else if (activeTab === 'education') {
        setFormData({ institution: '', degree: '', duration: '', order_index: items.length });
      } else if (activeTab === 'skills') {
        setFormData({ name: '', evidence: '', category: 'technical', order_index: items.length });
      } else if (activeTab === 'competencies') {
        setFormData({ name: '', evidence: '', category: 'competency', order_index: items.length });
      }
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let table = (activeTab === 'experience' || activeTab === 'education') ? activeTab === 'experience' ? 'experiences' : 'education' : 'skills';
    
    let error;
    if (editingItem) {
      const { error: err } = await supabase
        .from(table)
        .update(formData)
        .eq('id', editingItem.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from(table)
        .insert([formData]);
      error = err;
    }

    if (error) {
      alert('Error saving item: ' + error.message);
    } else {
      setIsModalOpen(false);
      fetchData();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    let table = (activeTab === 'experience' || activeTab === 'education') ? activeTab === 'experience' ? 'experiences' : 'education' : 'skills';
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-title">
          <h1>Resume & Profile</h1>
          <p>Manage your professional identity, career history, and skills.</p>
        </div>
        {activeTab !== 'overview' && (
          <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </button>
        )}
        {activeTab === 'overview' && (
           <button onClick={handleSaveProfile} className="admin-btn-primary" disabled={isSaving}>
             {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
             Save Profile Changes
           </button>
        )}
      </header>

      <div className="admin-tabs glass-card">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <User size={18} /> Profile
        </button>
        <button className={`tab-btn ${activeTab === 'competencies' ? 'active' : ''}`} onClick={() => setActiveTab('competencies')}>
          <Activity size={18} /> Competencies
        </button>
        <button className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>
          <Briefcase size={18} /> Experience
        </button>
        <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
          <Target size={18} /> Skills
        </button>
        <button className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
          <GraduationCap size={18} /> Education
        </button>
      </div>

      <div className="content-list">
        {isLoading ? (
          <div className="loading-state">
             <Loader2 className="animate-spin" size={32} />
             <span>Loading Content...</span>
          </div>
        ) : activeTab === 'overview' ? (
          <div className="profile-editor-view animate-fade-in">
             <div className="profile-grid">
                <div className="editor-card glass-card">
                  <div className="card-header"><User size={20} /> <h2>Identity</h2></div>
                  <div className="form-group"><label>Name</label><input className="admin-input" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
                  <div className="form-group"><label>Title</label><input className="admin-input" value={profile.title || ''} onChange={e => setProfile({...profile, title: e.target.value})} /></div>
                  <div className="form-group"><label>Bio</label><textarea className="admin-input" rows={4} value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} /></div>
                </div>
                <div className="editor-card glass-card">
                  <div className="card-header"><Mail size={20} /> <h2>Contact</h2></div>
                  <div className="form-group"><label>Email</label><input className="admin-input" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} /></div>
                  <div className="form-group"><label>Phone</label><input className="admin-input" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
                  <div className="form-group"><label>Location</label><input className="admin-input" value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} /></div>
                </div>
                <div className="editor-card glass-card full-width">
                   <div className="card-header"><TrendingUp size={20} /> <h2>Key Metrics</h2></div>
                   <div className="metrics-grid">
                      <div className="form-group"><label>Experience</label><input className="admin-input" value={profile.years_experience || ''} onChange={e => setProfile({...profile, years_experience: e.target.value})} /></div>
                      <div className="form-group"><label>GTV Growth</label><input className="admin-input" value={profile.gtv_growth || ''} onChange={e => setProfile({...profile, gtv_growth: e.target.value})} /></div>
                      <div className="form-group"><label>Merchant</label><input className="admin-input" value={profile.merchant_growth || ''} onChange={e => setProfile({...profile, merchant_growth: e.target.value})} /></div>
                      <div className="form-group"><label>Tech Cost</label><input className="admin-input" value={profile.tech_cost_cut || ''} onChange={e => setProfile({...profile, tech_cost_cut: e.target.value})} /></div>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="grid-list animate-fade-in">
            {items.map((item) => (
              <div key={item.id} className="admin-card item-card">
                <div className="item-main">
                   <div className="item-icon-box">
                      {activeTab === 'experience' ? <Briefcase size={20} /> : activeTab === 'education' ? <GraduationCap size={20} /> : activeTab === 'skills' ? <Target size={20} /> : <Activity size={20} />}
                   </div>
                   <div className="item-details">
                      <h3>{item.company || item.institution || item.name || item.title}</h3>
                      <span>{item.role || item.degree || item.evidence?.substring(0, 100) || item.description?.substring(0, 100)}</span>
                      {item.duration && <span className="item-date">{item.duration}</span>}
                   </div>
                </div>
                <div className="item-actions">
                  <button className="action-btn edit" onClick={() => handleOpenModal(item)}><Edit2 size={16} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="empty-msg glass-card"><p>No entries found.</p></div>}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-card animate-scale-in">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit' : 'Add'} {activeTab}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-grid">
                {(activeTab === 'skills' || activeTab === 'competencies') ? (
                  <>
                    <div className="admin-form-group full-width">
                      <label>Title / Name</label>
                      <input type="text" className="admin-input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="admin-form-group full-width">
                      <label>Description / Evidence</label>
                      <textarea className="admin-input" rows={4} value={formData.evidence || ''} onChange={e => setFormData({...formData, evidence: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>Order</label>
                      <input type="number" className="admin-input" value={formData.order_index || 0} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} />
                    </div>
                  </>
                ) : activeTab === 'experience' ? (
                  <>
                    <div className="admin-form-group"><label>Company</label><input className="admin-input" value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} required /></div>
                    <div className="admin-form-group"><label>Role</label><input className="admin-input" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} required /></div>
                    <div className="admin-form-group"><label>Duration</label><input className="admin-input" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
                    <div className="admin-form-group full-width"><label>Contribution</label><textarea className="admin-input" value={formData.contribution || ''} onChange={e => setFormData({...formData, contribution: e.target.value})} /></div>
                  </>
                ) : (
                  <>
                    <div className="admin-form-group full-width"><label>Institution</label><input className="admin-input" value={formData.institution || ''} onChange={e => setFormData({...formData, institution: e.target.value})} required /></div>
                    <div className="admin-form-group"><label>Degree</label><input className="admin-input" value={formData.degree || ''} onChange={e => setFormData({...formData, degree: e.target.value})} required /></div>
                    <div className="admin-form-group"><label>Duration</label><input className="admin-input" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .full-width { grid-column: 1 / -1; }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .editor-card { padding: 25px; border-radius: 20px; }
        .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: var(--accent-green); }
        .card-header h2 { font-size: 1.1rem; color: #fff; margin: 0; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; }
        .admin-tabs { display: flex; gap: 8px; padding: 8px; margin-bottom: 30px; }
        .tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; border-radius: 10px; font-weight: 600; font-size: 0.85rem; transition: all 0.3s; }
        .tab-btn.active { background: var(--accent-green); color: #000; }
        .grid-list { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .item-card { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        .item-main { display: flex; gap: 15px; align-items: center; }
        .item-icon-box { width: 44px; height: 44px; background: rgba(255,255,255,0.03); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--accent-green); }
        .item-details h3 { font-size: 1rem; margin: 0; }
        .item-details span { font-size: 0.85rem; color: var(--text-muted); }
        .item-actions { display: flex; gap: 8px; }
        .action-btn { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); color: var(--text-muted); border: none; cursor: pointer; transition: all 0.3s; }
        .action-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .empty-msg { padding: 40px; text-align: center; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
