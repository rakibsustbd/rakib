'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  ExternalLink, 
  Loader2,
  Filter,
  Search,
  X,
  Save,
  ArrowUpDown,
  BookOpen,
  ChevronRight,
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminPhotography() {
  const [activeTab, setActiveTab] = useState<'photos' | 'stories'>('photos');
  const [photos, setPhotos] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdatingSort, setIsUpdatingSort] = useState(false);
  
  // Photo Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  
  // Story Modal State
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<any>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [storyData, setStoryData] = useState({
    title: '',
    category: 'Landscape',
    description: ''
  });

  // Photo Form State
  const [photoFormData, setPhotoFormData] = useState({
    title: '',
    flickr_id: '',
    image_url: '',
    flickr_url: '',
    publish_date: '',
    description: '',
    width: 1024,
    height: 768
  });

  useEffect(() => {
    fetchPhotos();
    fetchStories();
    fetchSortConfig();
  }, [sortOrder]);

  async function fetchPhotos() {
    setIsLoading(true);
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('publish_date', { ascending: sortOrder === 'asc' });
    
    if (data) setPhotos(data);
    setIsLoading(false);
  }

  async function fetchStories() {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .eq('category', 'photo_story')
      .order('order_index', { ascending: true });
    
    if (data) {
      setStories(data.map(s => {
        try {
          const parsed = JSON.parse(s.evidence);
          return {
            id: s.id,
            title: s.name,
            category: parsed.category || 'General',
            description: parsed.description || '',
            photo_ids: parsed.photo_ids || [],
            order_index: s.order_index
          };
        } catch (e) {
          return { id: s.id, title: s.name, category: 'General', description: '', photo_ids: [] };
        }
      }));
    }
  }

  async function fetchSortConfig() {
    try {
      const { data } = await supabase
        .from('skills')
        .select('*')
        .eq('category', 'global_config')
        .eq('name', 'sort_order')
        .maybeSingle();
      
      if (data && data.evidence) {
        setSortOrder(data.evidence);
      }
    } catch (e) {
      console.error("Error fetching sort config:", e);
    }
  }

  const updateSortOrder = async (newOrder: string) => {
    setIsUpdatingSort(true);
    setSortOrder(newOrder);
    try {
      await supabase.from('skills').delete().eq('category', 'global_config').eq('name', 'sort_order');
      await supabase.from('skills').insert({ name: 'sort_order', evidence: newOrder, category: 'global_config', order_index: 0 });
    } catch (e) { console.error(e); }
    setIsUpdatingSort(false);
  };

  // Photo Handlers
  const handleOpenPhotoModal = (photo: any = null) => {
    if (photo) {
      setEditingPhoto(photo);
      setPhotoFormData({
        title: photo.title || '',
        flickr_id: photo.flickr_id || '',
        image_url: photo.image_url || '',
        flickr_url: photo.flickr_url || '',
        publish_date: photo.publish_date ? new Date(photo.publish_date).toISOString().split('T')[0] : '',
        description: photo.description || '',
        width: photo.width || 1024,
        height: photo.height || 768
      });
    } else {
      setEditingPhoto(null);
      setPhotoFormData({
        title: '', flickr_id: '', image_url: '', flickr_url: '',
        publish_date: new Date().toISOString().split('T')[0],
        description: '', width: 1024, height: 768
      });
    }
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...photoFormData, publish_date: new Date(photoFormData.publish_date).toISOString() };
    const { error } = editingPhoto 
      ? await supabase.from('photos').update(payload).eq('id', editingPhoto.id)
      : await supabase.from('photos').insert([payload]);

    if (error) alert(error.message);
    else { setIsPhotoModalOpen(false); fetchPhotos(); }
    setIsSaving(false);
  };

  // Story Handlers
  const handleOpenStoryModal = (story: any = null) => {
    if (story) {
      setEditingStory(story);
      setStoryData({ title: story.title, category: story.category, description: story.description });
      setSelectedPhotoIds(story.photo_ids.map(String));
    } else {
      setEditingStory(null);
      setStoryData({ title: '', category: 'Landscape', description: '' });
      setSelectedPhotoIds([]);
    }
    setIsStoryModalOpen(true);
  };

  const handleSaveStory = async () => {
    setIsSaving(true);
    const evidence = JSON.stringify({
      category: storyData.category,
      description: storyData.description,
      photo_ids: selectedPhotoIds
    });

    const payload = {
      name: storyData.title,
      evidence,
      category: 'photo_story',
      order_index: editingStory ? editingStory.order_index : stories.length
    };

    const { error } = editingStory
      ? await supabase.from('skills').update(payload).eq('id', editingStory.id)
      : await supabase.from('skills').insert([payload]);

    if (error) alert(error.message);
    else { setIsStoryModalOpen(false); fetchStories(); }
    setIsSaving(false);
  };

  const handleDeleteStory = async (id: any) => {
    if (!confirm('Delete this story?')) return;
    await supabase.from('skills').delete().eq('id', id);
    fetchStories();
  };

  const togglePhotoInStory = (id: string) => {
    setSelectedPhotoIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredPhotos = photos.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.flickr_id?.includes(searchQuery)
  );

  return (
    <div className="admin-photography-container">
      <header className="admin-page-header">
        <div className="admin-page-title">
          <h1>Photography & Stories</h1>
          <p>Manage your visual library and editorial photo stories.</p>
        </div>
        <div className="header-actions">
           <div className="admin-tabs glass-card">
              <button className={activeTab === 'photos' ? 'active' : ''} onClick={() => setActiveTab('photos')}>Library</button>
              <button className={activeTab === 'stories' ? 'active' : ''} onClick={() => setActiveTab('stories')}>Photo Stories</button>
           </div>
           {activeTab === 'photos' ? (
             <>
               <div className="global-sort-control glass-card">
                  <ArrowUpDown size={16} />
                  <select value={sortOrder} onChange={(e) => updateSortOrder(e.target.value)}>
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                  {isUpdatingSort && <Loader2 size={14} className="animate-spin" />}
               </div>
               <button className="admin-btn-primary" onClick={() => handleOpenPhotoModal()}>
                 <Plus size={18} /> Add Photo
               </button>
             </>
           ) : (
             <button className="admin-btn-primary" onClick={() => handleOpenStoryModal()}>
               <BookOpen size={18} /> New Photo Story
             </button>
           )}
        </div>
      </header>

      {activeTab === 'photos' ? (
        <>
          <div className="admin-controls glass-card">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search library..." className="admin-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="photo-management-grid">
            {isLoading ? <div className="loading-state"><Loader2 className="animate-spin" size={40} /></div> : (
              <div className="photo-admin-list">
                {filteredPhotos.map((photo) => (
                  <div key={photo.id} className="admin-card photo-item-card">
                    <div className="photo-preview" style={{ backgroundImage: `url('${photo.image_url}')` }}>
                       <div className="preview-overlay">
                          <a href={photo.flickr_url} target="_blank" rel="noreferrer" className="overlay-btn"><ExternalLink size={16} /></a>
                       </div>
                    </div>
                    <div className="photo-meta">
                      <h3>{photo.title || 'Untitled'}</h3>
                      <span className="photo-date">{new Date(photo.publish_date).toLocaleDateString()}</span>
                    </div>
                    <div className="photo-actions">
                       <button className="icon-btn edit" onClick={() => handleOpenPhotoModal(photo)}>Edit</button>
                       <button className="icon-btn delete" onClick={() => { if(confirm('Delete?')) supabase.from('photos').delete().eq('id', photo.id).then(fetchPhotos) }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="stories-list">
           {stories.length === 0 ? <p className="empty-state">No photo stories created yet.</p> : (
             <div className="story-admin-grid">
                {stories.map(story => (
                  <div key={story.id} className="story-admin-card glass-card">
                     <div className="story-info">
                        <span className="story-cat">{story.category}</span>
                        <h3>{story.title}</h3>
                        <p>{story.description}</p>
                        <div className="story-stats">
                           <ImageIcon size={14} /> {story.photo_ids.length} Photos
                        </div>
                     </div>
                     <div className="story-actions">
                        <button className="admin-btn-secondary" onClick={() => handleOpenStoryModal(story)}>Edit Story</button>
                        <button className="icon-btn delete" onClick={() => handleDeleteStory(story.id)}><Trash2 size={18} /></button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}

      {/* Photo Modal */}
      {isPhotoModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-card animate-scale-in">
            <div className="modal-header">
              <h2>{editingPhoto ? 'Edit Photo' : 'Add New Photo'}</h2>
              <button className="close-btn" onClick={() => setIsPhotoModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSavePhoto} className="modal-form">
              <div className="form-grid">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input type="text" className="admin-input" value={photoFormData.title} onChange={e => setPhotoFormData({...photoFormData, title: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Flickr ID</label>
                  <input type="text" className="admin-input" value={photoFormData.flickr_id} onChange={e => setPhotoFormData({...photoFormData, flickr_id: e.target.value})} required />
                </div>
                <div className="admin-form-group full-width">
                  <label>Image URL</label>
                  <input type="url" className="admin-input" value={photoFormData.image_url} onChange={e => setPhotoFormData({...photoFormData, image_url: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Date</label>
                  <input type="date" className="admin-input" value={photoFormData.publish_date} onChange={e => setPhotoFormData({...photoFormData, publish_date: e.target.value})} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsPhotoModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={isSaving}>{isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {isStoryModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal story-modal glass-card animate-scale-in">
            <div className="modal-header">
              <h2>{editingStory ? 'Edit Photo Story' : 'New Photo Story'}</h2>
              <button className="close-btn" onClick={() => setIsStoryModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="story-modal-content">
               <div className="story-fields">
                  <div className="admin-form-group">
                    <label>Story Title</label>
                    <input type="text" className="admin-input" value={storyData.title} onChange={e => setStoryData({...storyData, title: e.target.value})} />
                  </div>
                  <div className="admin-form-group">
                    <label>Category</label>
                    <select className="admin-input" value={storyData.category} onChange={e => setStoryData({...storyData, category: e.target.value})}>
                       <option>Landscape</option><option>Street</option><option>Nature</option><option>Life</option><option>Urban</option>
                    </select>
                  </div>
                  <div className="admin-form-group full-width">
                    <label>Short Description</label>
                    <textarea className="admin-input" rows={2} value={storyData.description} onChange={e => setStoryData({...storyData, description: e.target.value})} />
                  </div>
               </div>

               <div className="photo-picker-section">
                  <div className="picker-header">
                     <h3>Select Photos for this Story ({selectedPhotoIds.length})</h3>
                     <span className="hint">Choose 5-6 photos for the best display.</span>
                  </div>
                  <div className="picker-grid">
                     {photos.map(p => {
                       const isSelected = selectedPhotoIds.includes(String(p.id));
                       return (
                         <div key={p.id} className={`picker-item ${isSelected ? 'selected' : ''}`} onClick={() => togglePhotoInStory(String(p.id))}>
                            <img src={p.image_url} alt="" />
                            <div className="picker-overlay">{isSelected && <Check size={20} />}</div>
                         </div>
                       );
                     })}
                  </div>
               </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn-secondary" onClick={() => setIsStoryModalOpen(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSaveStory} disabled={isSaving || !storyData.title}>
                 {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Story
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-photography-container { animation: fade-in 0.5s ease-out; }
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .header-actions { display: flex; align-items: center; gap: 20px; }
        
        .admin-tabs { display: flex; padding: 4px; border-radius: 12px; }
        .admin-tabs button { padding: 8px 20px; border-radius: 8px; border: none; background: none; color: var(--text-muted); cursor: pointer; font-weight: 600; transition: all 0.3s; }
        .admin-tabs button.active { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); }

        .global-sort-control { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 12px; }
        .global-sort-control select { background: none; border: none; color: #fff; outline: none; cursor: pointer; font-weight: 600; }

        .story-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
        .story-admin-card { padding: 24px; display: flex; flex-direction: column; justify-content: space-between; height: 240px; }
        .story-cat { display: block; font-size: 0.7rem; color: var(--accent-green); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; margin-bottom: 8px; }
        .story-info h3 { margin-bottom: 12px; font-size: 1.4rem; }
        .story-info p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .story-stats { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted); }
        .story-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }

        .story-modal { width: 900px; max-width: 95vw; }
        .story-modal-content { display: flex; flex-direction: column; gap: 30px; margin-top: 20px; max-height: 60vh; overflow-y: auto; padding-right: 10px; }
        .story-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .photo-picker-section { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; }
        .picker-header { margin-bottom: 20px; }
        .picker-header h3 { font-size: 1.1rem; margin-bottom: 4px; }
        .hint { font-size: 0.8rem; color: var(--text-muted); }
        .picker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
        .picker-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
        .picker-item img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.5); }
        .picker-item:hover img { filter: grayscale(0); }
        .picker-item.selected { border-color: var(--accent-green); transform: scale(0.95); }
        .picker-item.selected img { filter: grayscale(0); }
        .picker-overlay { position: absolute; inset: 0; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
        .picker-item.selected .picker-overlay { opacity: 1; }

        .photo-admin-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .photo-item-card { padding: 10px; }
        .photo-preview { width: 100%; height: 180px; border-radius: 12px; background-size: cover; background-position: center; position: relative; }
        .preview-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s ease; display: flex; justify-content: flex-end; padding: 10px; }
        .photo-preview:hover .preview-overlay { opacity: 1; }
        .overlay-btn { width: 32px; height: 32px; background: #fff; color: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .photo-meta { padding: 15px 5px; }
        .photo-meta h3 { font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
        .photo-date { font-size: 0.8rem; color: var(--accent-green); font-weight: 600; }
        .photo-actions { display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; }
        .icon-btn { flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: #fff; padding: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .icon-btn.delete { color: #ff4b4b; }

        .full-width { grid-column: 1 / -1; }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}
