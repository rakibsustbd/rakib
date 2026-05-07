'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Search, Calendar, User, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('সব');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .not('title', 'ilike', '%আড্ডা পুষ্ট%') // Using a fuzzy filter to ensure it's removed
        .order('publish_date', { ascending: false });

      if (data) {
        setPosts(data);
      }
      setIsLoading(false);
    }

    fetchPosts();
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

  const featuredPosts = filteredPosts.slice(0, 5);
  const archivePosts = filteredPosts.slice(5);

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
                         <span className="slider-date"><Calendar size={14} /> {post.publish_date}</span>
                         <h3 className="slider-title bengali">{post.title}</h3>
                         <p className="slider-excerpt bengali">{post.excerpt || 'এইখানে ব্লগের সারাংশ থাকবে। সর্বোচ্চ তিন লাইনে এটি সীমাবদ্ধ থাকবে।'}</p>
                         <Link href={`/blog/${post.slug}`} className="read-link-overlay">
                           Read Story <ArrowRight size={16} />
                         </Link>
                      </div>
                   </div>
                </div>
              </div>
            ))}
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
                <span className="post-date">{post.publish_date}</span>
                <h3 className="archive-title bengali">{post.title}</h3>
                <p className="archive-text bengali">
                  {post.excerpt || 'এইখানে ব্লগের সারাংশ থাকবে। সর্বোচ্চ তিন লাইনে এটি সীমাবদ্ধ থাকবে যাতে গ্রিড লেআউট সুন্দর দেখায় এবং পড়ার আগ্রহ তৈরি করে...'}
                </p>
                <Link href={`/blog/${post.slug}`} className="read-link">
                  Read Story <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
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
        .blog-archive-section {
          margin-top: 100px;
          margin-bottom: 120px;
        }

        .archive-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          align-items: stretch;
        }

        .archive-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(255,255,255,0.01);
          padding: 16px;
          border-radius: 24px;
          border: 1px solid transparent;
          transition: all 0.4s ease;
        }

        .archive-card:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(16, 185, 129, 0.2);
          transform: translateY(-8px);
        }

        .archive-img-wrap {
          width: 100%;
          height: 240px; /* Fixed height to ensure consistency */
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
          background-color: #111;
        }

        .blog-banner-wrap {
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 40px;
          height: 250px;
          position: relative;
          border: 1px solid var(--border-color);
        }
        
        .blog-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .blog-intro {
          margin-bottom: 60px;
        }

        .blog-title {
          font-size: 3.5rem;
          margin-bottom: 16px;
          letter-spacing: -0.04em;
        }

        .blog-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.6;
        }

        .statement-banner {
          width: 100%;
          min-height: 220px;
          margin-bottom: 60px;
          position: relative;
          background: url('/quote_bg_v2.png') center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 40px 60px;
          border-radius: 24px;
          border: 1px solid rgba(16, 185, 129, 0.1);
          overflow: hidden;
        }

        .statement-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%);
        }

        .statement-content {
          position: relative;
          z-index: 1;
          max-width: 550px;
          text-align: left;
        }

        .statement-text {
          font-size: 1.15rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 300;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          border-left: 3px solid var(--accent-green);
          padding-left: 20px;
        }

        @media (max-width: 768px) {
          .statement-text {
            font-size: 1.3rem;
          }
          .statement-banner {
            min-height: auto;
            padding: 40px 20px;
          }
        }

        .category-menu-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
          padding: 24px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .blog-search {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 20px;
          border-radius: 12px;
          width: 320px;
          transition: all 0.3s ease;
        }

        .blog-search:focus-within {
          border-color: var(--accent-green);
          background: rgba(255,255,255,0.06);
        }

        .search-icon {
          color: var(--text-muted);
          margin-right: 12px;
        }

        .search-input {
          background: none;
          border: none;
          color: var(--text-primary);
          outline: none;
          width: 100%;
          font-family: inherit;
          font-size: 0.95rem;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 60px;
        }

        .page-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: rgba(255,255,255,0.02);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .page-btn:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
          border-color: rgba(255,255,255,0.2);
        }

        .page-btn.active {
          background: var(--accent-green);
          color: #000;
          border-color: var(--accent-green);
        }

        .page-btn.prev, .page-btn.next {
          width: auto;
          padding: 0 20px;
          gap: 8px;
        }

        .page-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        .category-menu {
          display: flex;
          gap: 48px;
        }

        .category-item {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.15rem;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          transition: var(--transition-smooth);
          padding: 8px 0;
        }

        .category-item:hover, .category-item.active {
          color: var(--accent-green);
        }

        .category-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-green);
          box-shadow: 0 0 10px var(--accent-green-glow);
        }

        .featured-slider-track {
          display: flex;
          gap: 32px;
          overflow-x: auto;
          padding: 10px 0 30px 0;
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
        }

        .featured-slider-track::-webkit-scrollbar {
          display: none;
        }

        .featured-slider-item {
          min-width: 500px;
          flex: 0 0 500px;
          scroll-snap-align: start;
        }

        .slider-card-image-bg {
          height: 450px;
          border-radius: 24px;
          background: #111;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .slider-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .category-badge-pill {
          position: absolute;
          top: 30px;
          left: 30px;
          background: var(--accent-green);
          color: #000;
          padding: 6px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .slider-date {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .slider-title {
          font-size: 1.8rem;
          margin-bottom: 16px;
          line-height: 1.3;
          color: #fff;
        }

        .slider-excerpt {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          margin-bottom: 24px;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-link-overlay {
          color: var(--accent-green);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition-smooth);
        }

        .read-link-overlay:hover {
          gap: 14px;
        }

        .blog-archive-section {
          margin-bottom: 80px;
        }

        .archive-info {
          padding-top: 10px;
        }

        .post-date {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        @media (max-width: 1024px) {
          .category-menu-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          .blog-search {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .banner-title {
            font-size: 2.5rem;
          }
          .blog-search {
            width: 100%;
          }
        }

        .signature-watermark {
          font-family: var(--font-outfit);
          font-weight: 900;
          font-size: 2rem;
          color: rgba(16, 185, 129, 0.2);
          letter-spacing: 0.1em;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
