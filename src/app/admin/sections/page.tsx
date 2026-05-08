'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Layers, 
  Eye,
  Layout,
  Code,
  Save,
  X,
  GripVertical,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSections() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    is_active: true,
    content_json: {},
    order_index: 0
  });

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    setIsLoading(true);
    const { data } = await supabase
      .from('dynamic_sections')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) setSections(data);
    setIsLoading(false);
  }

  const handleOpenModal = (section: any = null) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        title: section.title || '',
        slug: section.slug || '',
        is_active: section.is_active ?? true,
        content_json: section.content_json || {},
        order_index: section.order_index || 0
      });
    } else {
      setEditingSection(null);
      setFormData({
        title: '',
        slug: '',
        is_active: true,
        content_json: {},
        order_index: sections.length
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let error;
    if (editingSection) {
      const { error: err } = await supabase
        .from('dynamic_sections')
        .update(formData)
        .eq('id', editingSection.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('dynamic_sections')
        .insert([formData]);
      error = err;
    }

    if (error) {
      alert('Error saving section: ' + error.message);
    } else {
      setIsModalOpen(false);
      fetchSections();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? This will remove it from the live site.')) return;
    await supabase.from('dynamic_sections').delete().eq('id', id);
    fetchSections();
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-title">
          <h1>Dynamic Sections</h1>
          <p>Create and manage custom pages or sections for your website. Control visibility and ordering.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Create New Section
        </button>
      </header>

      <div className="sections-container">
        {isLoading ? (
          <div className="loading-state">
             <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="section-builder-list">
            {sections.map((section) => (
              <div key={section.id} className="admin-card section-row glass-card">
                 <div className="section-drag-handle">
                    <GripVertical size={20} />
                 </div>
                 <div className="section-main-info">
                    <div className="section-icon-circle">
                       <Layout size={20} />
                    </div>
                    <div>
                       <h3 className="section-name">{section.title}</h3>
                       <span className="section-slug">URL Slug: /{section.slug}</span>
                    </div>
                 </div>
                 <div className="section-meta-tags">
                    <span className={`visibility-pill ${section.is_active ? 'visible' : 'hidden'}`}>
                       {section.is_active ? 'Live' : 'Hidden'}
                    </span>
                    <span className="type-pill">Custom Content</span>
                 </div>
                 <div className="section-actions">
                    <button className="icon-btn" title="Edit Content" onClick={() => handleOpenModal(section)}><Code size={18} /></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(section.id)}><Trash2 size={18} /></button>
                 </div>
              </div>
            ))}

            {sections.length === 0 && (
              <div className="empty-sections-canvas glass-card">
                 <div className="canvas-icon">
                    <Layers size={48} />
                 </div>
                 <h3>Your canvas is empty</h3>
                 <p>Custom sections allow you to expand your website with tailored content blocks.</p>
                 <button className="admin-btn-primary mt-4" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Start Building
                 </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-card animate-scale-in">
            <div className="modal-header">
              <h2>{editingSection ? 'Edit Section' : 'Create New Section'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-grid">
                <div className="admin-form-group full-width">
                  <label>Section Title</label>
                  <input type="text" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>URL Slug</label>
                  <input type="text" className="admin-input" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Order Index</label>
                  <input type="number" className="admin-input" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} />
                </div>
                <div className="admin-form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                    Section is Active
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .loading-state { display: flex; justify-content: center; padding: 50px; }
        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .admin-modal {
          width: 100%;
          max-width: 500px;
          padding: 40px;
          border-radius: 24px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .modal-form .form-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .full-width { grid-column: 1 / -1; }
        .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; }
        .modal-footer { margin-top: 40px; display: flex; justify-content: flex-end; gap: 15px; }
        .section-builder-list { display: flex; flex-direction: column; gap: 16px; }
        .section-row { display: flex; align-items: center; padding: 20px 24px; margin-bottom: 0; transition: transform 0.2s ease, border-color 0.2s ease; }
        .section-row:hover { border-color: var(--accent-green); transform: translateX(4px); }
        .section-drag-handle { color: var(--text-muted); cursor: grab; margin-right: 15px; }
        .section-main-info { display: flex; align-items: center; gap: 20px; flex: 1; }
        .section-icon-circle { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; color: var(--accent-green); }
        .section-name { font-size: 1.1rem; margin: 0 0 2px 0; font-weight: 600; }
        .section-slug { font-size: 0.8rem; color: var(--text-muted); font-family: monospace; }
        .section-meta-tags { display: flex; gap: 10px; margin: 0 40px; }
        .visibility-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; }
        .visibility-pill.visible { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .visibility-pill.hidden { background: rgba(255,255,255,0.05); color: var(--text-muted); }
        .type-pill { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .section-actions { display: flex; gap: 10px; }
        .icon-btn { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .icon-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .icon-btn.delete:hover { color: #ff4b4b; background: rgba(255,75,75,0.1); }
        .empty-sections-canvas { padding: 80px; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .canvas-icon { width: 100px; height: 100px; background: rgba(255,255,255,0.02); border-radius: 30px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); margin-bottom: 24px; }
        .empty-sections-canvas h3 { font-size: 1.5rem; margin-bottom: 12px; }
        .empty-sections-canvas p { color: var(--text-muted); max-width: 400px; margin-bottom: 24px; }
      `}</style>
    </div>
  );
}
