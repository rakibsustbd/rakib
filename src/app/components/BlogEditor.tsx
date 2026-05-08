'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  Image as ImageIcon,
  ChevronDown,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

const CATEGORIES = [
  'ভাবনা',
  'গল্প ও ভাবনা',
  'প্রযুক্তি',
  'ভ্রমণ',
  'ফটোগ্রাফি',
  'অন্যান্য'
];

// Helper to strip HTML tags and convert <br>, <p> to newlines
function stripHtml(html: string) {
  if (!html) return '';
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<[^>]*>/g, '');
  return text.trim();
}

interface BlogEditorProps {
  id?: string;
}

export default function BlogEditor({ id }: BlogEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    image_url: '',
    category: 'ভাবনা',
    publish_date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    author: 'Ahmed Rakib',
    read_time: '5 min',
    excerpt: ''
  });

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  async function fetchPost() {
    const { data } = await supabase.from('posts').select('*').eq('id', id).single();
    if (data) {
      setFormData({
        ...data,
        title: stripHtml(data.title || ''),
        content: stripHtml(data.content || ''),
        excerpt: stripHtml(data.excerpt || '')
      });
    }
    setIsLoading(false);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // We save as plain text. If the frontend needs HTML, it should handle formatting.
    // However, to maintain compatibility with existing data, we can convert newlines back to <br> if needed.
    // But the user explicitly said "no html tag included in the text editor".
    
    let error;
    if (id) {
      const { error: err } = await supabase
        .from('posts')
        .update(formData)
        .eq('id', id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('posts')
        .insert([formData]);
      error = err;
    }

    if (error) {
      alert('Error: ' + error.message);
    } else {
      router.push('/admin/blog');
    }
    setIsSaving(false);
  };

  if (isLoading) return (
    <div className="loading-state-full">
      <Loader2 className="animate-spin" size={48} />
      <style jsx>{`
        .loading-state-full { display: flex; align-items: center; justify-content: center; height: 60vh; color: var(--accent-green); }
      `}</style>
    </div>
  );

  return (
    <div className="blog-editor-container">
      <div className="editor-header">
        <button onClick={() => router.back()} className="back-btn">
          <ArrowLeft size={18} /> Back to Stories
        </button>
        <div className="header-actions">
           <button onClick={handleSave} className="admin-btn-primary" disabled={isSaving}>
             {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
             {id ? 'Update Story' : 'Publish Story'}
           </button>
        </div>
      </div>

      <div className="editor-content-grid">
        <div className="main-editor glass-card">
          <div className="form-section">
            <label>Story Title (Plain Text)</label>
            <input 
              type="text" 
              className="title-input bengali" 
              placeholder="গল্পের শিরোনাম লিখুন..."
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div className="form-section">
            <label>Story Content (Plain Text Only)</label>
            <textarea 
              className="content-textarea bengali" 
              rows={22}
              placeholder="আপনার গল্প এখানে লিখুন... (কোনো HTML ট্যাগ প্রয়োজন নেই)"
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
            />
          </div>
        </div>

        <div className="side-editor">
          <div className="editor-card glass-card">
            <h3>Publishing Details</h3>
            
            <div className="form-group">
              <label>URL Slug</label>
              <input type="text" className="admin-input" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <div className="select-wrapper">
                <select 
                  className="admin-input bengali" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>

            <div className="form-group">
              <label>Publish Date</label>
              <input type="text" className="admin-input bengali" value={formData.publish_date} onChange={e => setFormData({...formData, publish_date: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Read Time</label>
              <input type="text" className="admin-input" value={formData.read_time} onChange={e => setFormData({...formData, read_time: e.target.value})} />
            </div>
          </div>

          <div className="editor-card glass-card">
            <h3>Featured Image</h3>
            
            <div className="form-group">
              <div className="img-upload-container">
                <div className="img-preview-box">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" />
                  ) : (
                    <div className="placeholder">
                       <ImageIcon size={32} />
                       <span>No image selected</span>
                    </div>
                  )}
                  {isUploading && <div className="upload-overlay"><Loader2 className="animate-spin" /></div>}
                </div>
                
                <div className="upload-actions">
                  <button type="button" className="upload-btn" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <Upload size={16} /> {formData.image_url ? 'Change Image' : 'Upload Image'}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="url-input-box">
                    <LinkIcon size={14} />
                    <input 
                      type="url" 
                      placeholder="Or paste image URL..." 
                      className="admin-input mini"
                      value={formData.image_url}
                      onChange={e => setFormData({...formData, image_url: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Excerpt / Summary</label>
              <textarea className="admin-input bengali" rows={4} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-editor-container {
          max-width: 1400px;
          margin: 0 auto;
          animation: fade-in 0.4s ease-out;
        }
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 500;
          transition: color 0.2s;
        }
        .back-btn:hover { color: #fff; }

        .editor-content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
        }

        .main-editor {
          padding: 40px;
          border-radius: 24px;
        }
        .title-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          padding: 10px 0;
          margin-bottom: 40px;
          outline: none;
        }
        .title-input::placeholder { color: rgba(255,255,255,0.1); }
        
        .content-textarea {
          width: 100%;
          background: transparent;
          border: none;
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          outline: none;
          resize: none;
        }

        .side-editor {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .editor-card {
          padding: 24px;
          border-radius: 20px;
        }
        .editor-card h3 {
          font-size: 0.9rem;
          margin-bottom: 20px;
          color: var(--accent-green);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        
        .select-wrapper { position: relative; }
        .select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); }
        .select-wrapper select { appearance: none; }

        .img-upload-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .img-preview-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .img-preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--text-muted); font-size: 0.8rem; }
        .upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }

        .upload-btn {
          width: 100%;
          padding: 10px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .upload-btn:hover { background: rgba(16, 185, 129, 0.2); }
        
        .url-input-box {
          position: relative;
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
        .url-input-box :global(svg) { position: absolute; left: 12px; color: var(--text-muted); }
        .url-input-box input { padding-left: 35px; height: 36px; font-size: 0.8rem; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1100px) {
          .editor-content-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
