'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  Star,
  Layout,
  ArrowUpDown
} from 'lucide-react';

const CATEGORIES = ['All', 'ভাবনা', 'গল্প ও ভাবনা', 'প্রযুক্তি', 'ভ্রমণ', 'ফটোগ্রাফি'];

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isUpdatingFeatured, setIsUpdatingFeatured] = useState(false);
  const [isUpdatingSort, setIsUpdatingSort] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchConfigs();
  }, [selectedCategory, sortOrder]);

  async function fetchBlogs() {
    setIsLoading(true);
    let query = supabase.from('posts').select('*').order('created_at', { ascending: sortOrder === 'asc' });
    
    if (selectedCategory !== 'All') {
      query = query.eq('category', selectedCategory);
    }

    const { data } = await query;
    if (data) setBlogs(data);
    setIsLoading(false);
  }

  async function fetchConfigs() {
    try {
      const { data } = await supabase
        .from('skills')
        .select('*')
        .or('category.eq.blog_config,category.eq.global_config');
      
      if (data) {
        // Featured IDs
        const featuredRow = data.find(r => r.name === 'featured_post_ids');
        if (featuredRow && featuredRow.evidence) {
          const parsed = JSON.parse(featuredRow.evidence);
          setFeaturedIds(Array.isArray(parsed) ? parsed.map(String) : []);
        }

        // Global Sort Order
        const sortRow = data.find(r => r.name === 'sort_order');
        if (sortRow && sortRow.evidence) {
          setSortOrder(sortRow.evidence);
        }
      }
    } catch (e) {
      console.error("Error fetching configs:", e);
    }
  }

  const updateSortOrder = async (newOrder: string) => {
    setIsUpdatingSort(true);
    setSortOrder(newOrder);

    try {
      await supabase
        .from('skills')
        .delete()
        .eq('category', 'global_config')
        .eq('name', 'sort_order');

      await supabase.from('skills').insert({
        name: 'sort_order',
        evidence: newOrder,
        category: 'global_config',
        order_index: 0
      });
    } catch (e) {
      console.error("Error updating sort order:", e);
    }
    setIsUpdatingSort(false);
  };

  const toggleFeatured = async (rawId: any) => {
    if (isUpdatingFeatured) return;
    const id = String(rawId);
    setIsUpdatingFeatured(true);
    
    let newIds = [...featuredIds].map(String);
    const isAdding = !newIds.includes(id);

    if (!isAdding) {
      newIds = newIds.filter(i => i !== id);
    } else {
      if (newIds.length >= 6) {
        alert("You can only feature up to 6 stories at a time.");
        setIsUpdatingFeatured(false);
        return;
      }
      newIds.push(id);
    }
    
    setFeaturedIds(newIds);

    try {
      await supabase
        .from('skills')
        .delete()
        .eq('category', 'blog_config')
        .eq('name', 'featured_post_ids');

      const { error } = await supabase.from('skills').insert({
        name: 'featured_post_ids',
        evidence: JSON.stringify(newIds),
        category: 'blog_config',
        order_index: 0
      });
      
      if (error) throw error;
    } catch (e: any) {
      console.error("Error updating featured posts:", e);
      alert("Failed to sync featured posts: " + e.message);
      fetchConfigs();
    }
    setIsUpdatingFeatured(false);
  };

  const handleDelete = async (id: any) => {
    console.log("Delete triggered for ID:", id);
    if (!confirm(`Are you sure you want to delete story with ID: ${id}?`)) return;
    
    const numericId = Number(id);
    if (isNaN(numericId)) {
      alert("Invalid Post ID. It must be a number.");
      return;
    }

    try {
      console.log("Sending delete request to Supabase for ID:", numericId);
      const response = await supabase
        .from('posts')
        .delete()
        .eq('id', numericId);
      
      const { error, status, statusText } = response;
      console.log("Raw Supabase Response:", response);

      if (error) {
        console.error("Supabase Delete Error:", error);
        alert(`Database Error (Status ${status}): ${error.message || statusText}`);
      } else if (status === 204 || status === 200) {
        console.log("Delete successful in database.");
        // Immediate local filter
        setBlogs(prev => prev.filter(b => Number(b.id) !== numericId));
        alert(`Story ID ${numericId} deleted successfully.`);
        fetchBlogs();
      } else {
        alert(`Unexpected Response Status: ${status}. Row may not have been deleted.`);
      }
    } catch (e: any) {
      console.error("Client Exception during delete:", e);
      alert(`Critical Error: ${e.message}`);
    }
  };

  const featuredBlogs = blogs.filter(b => featuredIds.includes(String(b.id)));

  return (
    <div className="admin-blog-page">
      <div className="admin-header-flex">
        <div>
          <h1>Thoughts & Blog</h1>
          <p className="text-secondary">Manage your stories, insights, and shared thoughts.</p>
        </div>
        <div className="header-actions">
          <div className="global-sort-control glass-card">
            <ArrowUpDown size={16} />
            <select value={sortOrder} onChange={(e) => updateSortOrder(e.target.value)}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            {isUpdatingSort && <Loader2 size={14} className="animate-spin" />}
          </div>
          <Link href="/admin/blog/new" className="admin-btn-primary">
            <Plus size={18} /> New Story
          </Link>
        </div>
      </div>

      {/* Featured Management Panel */}
      <div className="featured-panel glass-card">
        <div className="panel-header">
           <Star size={20} className={featuredIds.length > 0 ? "star-active" : ""} />
           <h2>Currently Featured Stories ({featuredIds.length}/6)</h2>
        </div>
        {featuredBlogs.length > 0 ? (
          <div className="featured-strip">
            {featuredBlogs.map(blog => (
              <div key={blog.id} className="featured-mini-card animate-scale-in">
                 <div className="mini-thumb" style={{ backgroundImage: blog.image_url ? `url(${blog.image_url})` : 'none', backgroundColor: '#111' }}>
                   {!blog.image_url && <ImageIcon size={14} color="#333" />}
                 </div>
                 <div className="mini-info">
                    <span className="bengali truncate">{blog.title.replace(/<[^>]*>/g, '')}</span>
                    <button className="remove-btn" onClick={() => toggleFeatured(blog.id)}>Remove</button>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-panel-text">No stories featured yet. Use the star icon on any story to feature it.</p>
        )}
      </div>

      <div className="blog-toolbar glass-card">
        <div className="filter-group">
          <label>Filter by Category</label>
          <div className="select-wrapper">
             <select 
               className="admin-input bengali" 
               value={selectedCategory} 
               onChange={(e) => setSelectedCategory(e.target.value)}
             >
               {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
             </select>
             <ChevronDown size={14} className="select-icon" />
          </div>
        </div>
        
        <div className="search-group">
          <label>Search Stories</label>
          <div className="input-with-icon">
            <Search size={16} />
            <input type="text" className="admin-input" placeholder="Search by title..." />
          </div>
        </div>

        <div className="debug-delete-group">
          <label>Debug Delete (Enter ID)</label>
          <div className="input-with-icon" style={{ gap: '10px' }}>
            <input 
              type="number" 
              className="admin-input" 
              placeholder="Post ID" 
              id="debug-id-input"
            />
            <button 
              className="admin-btn-primary" 
              style={{ background: '#ff4b4b', color: '#fff' }}
              onClick={() => {
                const input = document.getElementById('debug-id-input') as HTMLInputElement;
                if (input.value) handleDelete(input.value);
              }}
            >
              Force Delete
            </button>
          </div>
        </div>

        <div className="stat-pill">
           <span className="pill-label">Total Stories</span>
           <span className="pill-value">{blogs.length}</span>
        </div>
      </div>

      <div className="blog-list-container">
        {isLoading ? (
          <div className="loading-state">
             <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="story-grid">
            {blogs.map((blog) => {
              const isFeatured = featuredIds.includes(String(blog.id));
              return (
                <div key={blog.id} className={`story-card glass-card ${isFeatured ? 'featured' : ''}`}>
                  <div className="story-cover">
                    {blog.image_url ? (
                      <img src={blog.image_url} alt="" />
                    ) : (
                      <div className="cover-placeholder"><ImageIcon size={32} /></div>
                    )}
                    <div className="category-badge bengali">{blog.category}</div>
                    <button 
                      className={`feature-toggle ${isFeatured ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFeatured(blog.id);
                      }}
                      title={isFeatured ? "Unfeature" : "Feature on Homepage"}
                    >
                      <Star size={20} fill={isFeatured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="story-details">
                    <h3 className="bengali" dangerouslySetInnerHTML={{ __html: blog.title }}></h3>
                    <div className="story-meta">
                      <span className="bengali"><Calendar size={14} /> {blog.publish_date}</span>
                      <span><Layout size={14} /> {blog.read_time}</span>
                    </div>
                    <div className="story-actions">
                      <Link href={`/admin/blog/${blog.id}`} className="icon-btn edit">
                        <Edit size={18} />
                      </Link>
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="icon-btn view">
                        <ExternalLink size={18} />
                      </a>
                      <button className="icon-btn delete" onClick={() => handleDelete(blog.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-blog-page { animation: fade-in 0.5s ease-out; }
        .admin-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .header-actions { display: flex; align-items: center; gap: 20px; }
        
        .global-sort-control {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .global-sort-control select {
          background: none;
          border: none;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }
        .global-sort-control select option { background: #111; }

        .featured-panel { padding: 24px; border-radius: 24px; margin-bottom: 30px; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.03); }
        .panel-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .panel-header h2 { font-size: 1rem; color: #fff; margin: 0; }
        .star-active { color: var(--accent-green); fill: var(--accent-green); }
        .featured-strip { display: flex; gap: 15px; overflow-x: auto; padding: 5px 5px 15px 5px; }
        .featured-mini-card { flex-shrink: 0; width: 220px; display: flex; gap: 12px; align-items: center; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
        .mini-thumb { width: 50px; height: 50px; border-radius: 10px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; }
        .mini-info { flex: 1; overflow: hidden; }
        .mini-info span { display: block; font-size: 0.85rem; margin-bottom: 4px; color: #eee; font-weight: 500; }
        .remove-btn { background: none; border: none; color: #ff4b4b; font-size: 0.75rem; cursor: pointer; padding: 0; font-weight: 600; opacity: 0.8; transition: opacity 0.2s; }
        .remove-btn:hover { opacity: 1; text-decoration: underline; }
        .empty-panel-text { color: var(--text-muted); font-size: 0.9rem; margin: 0; padding: 10px 0; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .blog-toolbar { padding: 24px; border-radius: 20px; display: flex; gap: 30px; align-items: flex-end; margin-bottom: 30px; }
        .filter-group, .search-group { flex: 1; }
        .filter-group label, .search-group label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; }
        .select-wrapper { position: relative; }
        .select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); }
        .select-wrapper select { appearance: none; padding-right: 35px; }
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon :global(svg) { position: absolute; left: 14px; color: var(--text-muted); }
        .input-with-icon input { padding-left: 42px; }
        .stat-pill { padding: 12px 24px; background: rgba(255,255,255,0.03); border-radius: 12px; text-align: right; }
        .pill-label { display: block; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
        .pill-value { font-size: 1.2rem; font-weight: 700; color: var(--accent-green); }

        .story-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .story-card { border-radius: 24px; overflow: hidden; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.05); }
        .story-card:hover { transform: translateY(-5px); border-color: rgba(255, 255, 255, 0.1); }
        .story-card.featured { border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.03); box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.1); }
        
        .story-cover { position: relative; width: 100%; aspect-ratio: 16/10; background: #111; }
        .story-cover img { width: 100%; height: 100%; object-fit: cover; }
        .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #222; }
        .category-badge { position: absolute; top: 15px; left: 15px; padding: 6px 12px; background: var(--accent-green); color: #000; border-radius: 8px; font-size: 0.75rem; font-weight: 700; }
        
        .feature-toggle {
          position: absolute; top: 15px; right: 15px; width: 42px; height: 42px; border-radius: 50%;
          background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; backdrop-filter: blur(8px);
          z-index: 10;
        }
        .feature-toggle:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); color: var(--accent-green); border-color: var(--accent-green); }
        .feature-toggle.active { background: var(--accent-green); color: #000; border-color: var(--accent-green); box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }

        .story-details { padding: 24px; }
        .story-details h3 { font-size: 1.15rem; line-height: 1.5; margin-bottom: 16px; min-height: 3.4rem; color: #fff; font-weight: 600; }
        .story-meta { display: flex; gap: 20px; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 24px; }
        .story-meta span { display: flex; align-items: center; gap: 6px; }
        .story-actions { display: flex; gap: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }
        .icon-btn {
          width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03); color: var(--text-secondary); transition: all 0.2s; border: 1px solid transparent;
          text-decoration: none;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .icon-btn.delete:hover { background: rgba(255, 75, 75, 0.1); color: #ff4b4b; border-color: rgba(255, 75, 75, 0.2); }
        .icon-btn.edit:hover { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); border-color: rgba(16, 185, 129, 0.2); }

        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}
