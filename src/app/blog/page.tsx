'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Search, Calendar, User, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('সব');
  const [posts, setPosts] = useState<any[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch sort order first
        const { data: sortData } = await supabase
          .from('skills')
          .select('evidence')
          .eq('category', 'global_config')
          .eq('name', 'sort_order')
          .maybeSingle();
        
        const currentSortOrder = sortData?.evidence || 'desc';

        const [postsRes, configRes] = await Promise.all([
          supabase
            .from('posts')
            .select('*')
            .not('title', 'ilike', '%আড্ডা পুষ্ট%')
            .order('created_at', { ascending: currentSortOrder === 'asc' }),
          supabase
            .from('skills')
            .select('*')
            .eq('category', 'blog_config')
            .eq('name', 'featured_post_ids')
            .maybeSingle()
        ]);

        if (postsRes.data) {
          setPosts(postsRes.data);
        }
        if (configRes.data && configRes.data.evidence) {
          setFeaturedIds(JSON.parse(configRes.data.evidence));
        }
      } catch (e) {
        console.error("Error fetching blog data:", e);
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const categories = [
    { id: 'all', label: 'সব' },
    { id: 'story', label: 'গল্প' },
    { id: 'thoughts', label: 'ভাবনা' },
    { id: 'travel', label: 'ভ্রমন' },
    { id: 'pro', label: 'প্রো' },
    { id: 'country', label: 'দেশ' },
  ];

  const filteredPosts = activeCategory === 'সব' 
    ? posts 
    : posts.filter(post => post.category === activeCategory || (activeCategory === 'ভাবনা' && post.category === 'গল্প ও ভাবনা'));

  // Logic: Featured posts are those selected in Admin. If none selected, take latest 5.
  // Using String() conversion to ensure match regardless of DB type (int vs string)
  const featuredPosts = featuredIds.length > 0 
    ? featuredIds
        .map(id => posts.find(p => String(p.id) === String(id)))
        .filter(p => p !== undefined)
    : filteredPosts.filter(p => p.publish_date && p.publish_date !== 'অজানা তারিখ').slice(0, 5);

  // Archive posts are all OTHER posts
  const archivePosts = filteredPosts.filter(p => !featuredPosts.find(f => String(f.id) === String(p.id)));

  // Pagination logic for archive
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentArchivePosts = archivePosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(archivePosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      const element = document.getElementById('blog-archive-start');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="container animate-fade-in">
      
      {/* Statement Banner Section */}
      <div className="statement-banner glass-card">
        <div className="statement-content">
          <p className="statement-text bengali">
            "যন্ত্র মানবে পরিনত হতে খুব বেশি দেরি নেই। কষ্টের অনুভূতিগুলো আগের মতন ধারালো নাই আর। অযাচিত আঘাতে হৃদয়ে আগের মতন রক্তক্ষরণ হয় না। ধীরে ধীরে আমি অজেয় হয়ে উঠছি। বিবর্তনের এই ধাপটা খুব আনন্দদায়ী নয়। বরং একটু বেশি অস্বস্তিকর"
          </p>
        </div>
      </div>

      {/* Category Menu */}
      <div className="category-menu-container">
        <div className="category-menu bengali">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-item ${activeCategory === cat.label ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.label);
                setCurrentPage(1);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="blog-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search stories..." className="search-input" />
        </div>
      </div>

      {/* Featured Slider */}
      <div className="blog-featured-section">
        <div className="section-header">
          <h2 className="section-label">Featured Stories</h2>
        </div>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Loader2 className="animate-spin" size={40} color="var(--accent-green)" />
          </div>
        ) : (
          <div className="featured-slider-track">
            {featuredPosts.map((post) => (
              <div key={post.id} className="featured-slider-item">
                <div 
                  className="slider-card-image-bg" 
                  style={{ 
                    backgroundImage: post.image_url ? `url('${post.image_url}')` : 'none',
                    backgroundColor: '#064e3b',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: !post.image_url ? '1px solid var(--accent-green)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {!post.image_url && (
                    <div className="signature-watermark">RAKIB.</div>
                  )}
                   <div className="slider-overlay">
                      <div className="category-badge-pill bengali">{post.category}</div>
                      <div className="slider-content">
                          <span className="slider-date"><Calendar size={14} /> {post.publish_date && post.publish_date !== 'অজানা তারিখ' ? post.publish_date : 'সাম্প্রতিক'}</span>
                          <h3 className="slider-title bengali" dangerouslySetInnerHTML={{ __html: post.title }}></h3>
                          <p className="slider-excerpt bengali">{post.excerpt || 'এইখানে ব্লগের সারাংশ থাকবে।'}</p>

                         <Link href={`/blog/${post.slug}`} className="read-link-overlay">
                           Read Story <ArrowRight size={16} />
                         </Link>
                      </div>
                   </div>
                </div>
              </div>
            ))}
            {featuredPosts.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%', padding: '40px' }}>No featured stories found.</p>
            )}
          </div>
        )}
      </div>

      {/* Archive Grid */}
      <div id="blog-archive-start" className="blog-archive-section">
        <div className="section-header">
          <h2 className="section-label">Archive</h2>
        </div>
        
        <div className="archive-grid">
          {currentArchivePosts.map((post) => (
            <div key={post.id} className="archive-card animate-fade-in">
               <div 
                className="archive-img-wrap glass-card"
                style={{ 
                  backgroundImage: post.image_url ? `url('${post.image_url}')` : 'none',
                  backgroundColor: '#064e3b',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: !post.image_url ? '1px solid var(--accent-green)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {!post.image_url && (
                  <div className="signature-watermark" style={{ fontSize: '1.2rem' }}>RAKIB.</div>
                )}
              </div>
              <div className="archive-info">
                <span className="post-date">{post.publish_date && post.publish_date !== 'অজানা তারিখ' ? post.publish_date : 'সাম্প্রতিক'}</span>

                <h3 className="archive-title bengali" dangerouslySetInnerHTML={{ __html: post.title }}></h3>
                <p className="archive-text bengali">
                  {post.excerpt || 'এইখানে ব্লগের সারাংশ থাকবে। সর্বোচ্চ তিন লাইনে এটি সীমাবদ্ধ থাকবে যাতে গ্রিড লেআউট সুন্দর দেখায় এবং পড়ার আগ্রহ তৈরি করে...'}
                </p>
                <Link href={`/blog/${post.slug}`} className="read-link">
                  Read Story <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
          {currentArchivePosts.length === 0 && !isLoading && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '60px' }}>No archive stories found in this category.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className={`page-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button 
              className={`page-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .blog-archive-section { margin-top: 100px; margin-bottom: 120px; }
        .archive-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; align-items: stretch; }
        .archive-card { display: flex; flex-direction: column; height: 100%; background: rgba(255,255,255,0.01); padding: 16px; border-radius: 24px; border: 1px solid transparent; transition: all 0.4s ease; }
        .archive-card:hover { background: rgba(255,255,255,0.03); border-color: rgba(16, 185, 129, 0.2); transform: translateY(-8px); }
        .archive-img-wrap { width: 100%; height: 240px; border-radius: 16px; overflow: hidden; margin-bottom: 20px; border: 1px solid var(--border-color); flex-shrink: 0; background-color: #111; }
        .statement-banner { width: 100%; min-height: 220px; margin-bottom: 60px; position: relative; background: url('/quote_bg_v2.png') center/cover no-repeat; display: flex; align-items: center; justify-content: flex-end; padding: 40px 60px; border-radius: 24px; border: 1px solid rgba(16, 185, 129, 0.1); overflow: hidden; }
        .statement-banner::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%); }
        .statement-content { position: relative; z-index: 1; max-width: 550px; text-align: left; }
        .statement-text { font-size: 1.15rem; line-height: 1.7; color: rgba(255, 255, 255, 0.9); font-weight: 300; letter-spacing: 0.01em; text-shadow: 0 2px 4px rgba(0,0,0,0.5); border-left: 3px solid var(--accent-green); padding-left: 20px; }
        .category-menu-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; padding: 24px 0; border-bottom: 1px solid var(--border-color); }
        .blog-search { display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 12px; width: 320px; transition: all 0.3s ease; }
        .search-icon { color: var(--text-muted); margin-right: 12px; }
        .search-input { background: none; border: none; color: var(--text-primary); outline: none; width: 100%; font-family: inherit; font-size: 0.95rem; }
        .pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 60px; }
        .page-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.02); color: var(--text-secondary); font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .page-btn.active { background: var(--accent-green); color: #000; border-color: var(--accent-green); }
        .page-btn.prev, .page-btn.next { width: auto; padding: 0 20px; }
        .category-menu { display: flex; gap: 48px; }
        .category-item { background: none; border: none; color: var(--text-secondary); font-size: 1.15rem; font-weight: 500; cursor: pointer; position: relative; padding: 8px 0; }
        .category-item.active { color: var(--accent-green); }
        .category-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--accent-green); }
        .featured-slider-track { display: flex; gap: 32px; overflow-x: auto; padding: 10px 0 30px 0; scrollbar-width: none; }
        .featured-slider-item { min-width: 500px; flex: 0 0 500px; }
        .slider-card-image-bg { height: 450px; border-radius: 24px; background: #111; position: relative; overflow: hidden; border: 1px solid var(--border-color); }
        .slider-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%); padding: 40px; display: flex; flex-direction: column; justify-content: flex-end; }
        .category-badge-pill { position: absolute; top: 30px; left: 30px; background: var(--accent-green); color: #000; padding: 6px 16px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; }
        .slider-date { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .slider-title { font-size: 1.8rem; margin-bottom: 16px; line-height: 1.3; color: #fff; }
        .slider-excerpt { color: rgba(255,255,255,0.7); font-size: 1rem; margin-bottom: 24px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .read-link-overlay { color: var(--accent-green); font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
        .read-link-overlay:hover { gap: 14px; }
        .signature-watermark { font-family: var(--font-outfit); font-weight: 900; font-size: 2rem; color: rgba(16, 185, 129, 0.2); letter-spacing: 0.1em; user-select: none; }
        @media (max-width: 1024px) { 
          .category-menu-container { flex-direction: column; align-items: flex-start; gap: 16px; padding: 15px 0; } 
          .blog-search { width: 100%; } 
          .featured-slider-item { min-width: 85vw; } 
          .archive-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; } 
          .statement-banner { padding: 25px; min-height: 140px; }
          .statement-text { font-size: 0.9rem; padding: 15px 0 0 0; }
        }
        @media (max-width: 768px) {
          .slider-card-image-bg { height: 300px; }
          .slider-title { font-size: 1.25rem; }
          .slider-overlay { padding: 20px; }
          .category-badge-pill { top: 15px; left: 15px; font-size: 0.7rem; }
          .featured-slider-track { gap: 15px; }
          .featured-slider-item { min-width: 88vw; }
          .section-title { font-size: 1.5rem; margin-bottom: 25px; }
        }
        @media (max-width: 640px) { 
          .archive-grid { grid-template-columns: 1fr; } 
          .category-menu { gap: 20px; padding-bottom: 8px; } 
          .category-item { font-size: 0.85rem; } 
          .container { padding: 70px 15px; }
        }
      `}</style>
    </div>
  );
}
