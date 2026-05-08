'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar, Camera, Heart, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const PHOTOS_PER_PAGE = 15;

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data: sortData } = await supabase
          .from('skills')
          .select('evidence')
          .eq('category', 'global_config')
          .eq('name', 'sort_order')
          .maybeSingle();
        
        const currentSortOrder = sortData?.evidence || 'desc';

        const [photosRes, storiesRes] = await Promise.all([
          supabase.from('photos').select('*').order('publish_date', { ascending: currentSortOrder === 'asc' }),
          supabase.from('skills').select('*').eq('category', 'photo_story').order('order_index', { ascending: true })
        ]);

        if (photosRes.data) setPhotos(photosRes.data);
        if (storiesRes.data) {
          const parsedStories = storiesRes.data.map(s => {
            const parsed = JSON.parse(s.evidence);
            const storyPhotos = (parsed.photo_ids || [])
              .map((id: any) => photosRes.data?.find(p => String(p.id) === String(id)))
              .filter((p: any) => p !== undefined);
            
            return {
              id: s.id,
              title: s.name,
              category: parsed.category || 'General',
              description: parsed.description || '',
              photos: storyPhotos
            };
          }).filter(s => s.photos.length > 0);
          setStories(parsedStories);
        }
      } catch (e) {
        console.error("Error fetching photography data:", e);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      const timer = setInterval(() => {
        setActiveStoryIdx((prev) => (prev + 1) % stories.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [stories.length]);

  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
  const currentPhotos = photos.slice((currentPage - 1) * PHOTOS_PER_PAGE, currentPage * PHOTOS_PER_PAGE);
  const bannerPhotos = photos.slice(0, 6); // Using 6 for the spaced layout
  const activeStory = stories[activeStoryIdx];

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      const element = document.getElementById('archive-grid-start');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="container animate-fade-in">
      
      {/* Photo Hero Banner (Updated Grid Layout) */}
      <div className="photography-hero-banner glass-card">
        <div className="banner-grid-outer">
          {bannerPhotos.map((p) => (
            <div key={p.id} className="banner-tile">
              <img src={p.image_url} alt={p.title} />
            </div>
          ))}
        </div>
        <div className="banner-overlay">
          <div className="banner-content">
             <h1 className="banner-title">Visual Archive</h1>
             <p className="banner-subtitle">CAPTURING MOMENTS THROUGH THE LENS OF TIME.</p>
          </div>
        </div>
      </div>

      {/* Photo Stories Section (Dynamic Grid Slider) */}
      {stories.length > 0 && activeStory && (
        <div className="photography-stories-slider-container">
          <div className="section-header">
            <div className="label-flex">
               <BookOpen size={20} className="accent-text" />
               <h2 className="section-label">Editorial Stories</h2>
            </div>
            <div className="slider-dots">
              {stories.map((_, i) => (
                <button key={i} className={`dot ${activeStoryIdx === i ? 'active' : ''}`} onClick={() => setActiveStoryIdx(i)} />
              ))}
            </div>
          </div>

          <div className="story-display-wrapper glass-card">
             <div className="story-content-side">
                <span className="story-category-tag">{activeStory.category}</span>
                <h2 className="story-title-main">{activeStory.title}</h2>
                <p className="story-description-main">{activeStory.description}</p>
                <Link href={`/photography/story/${activeStory.id}`} className="explore-story-btn">
                   Explore Story <ArrowRight size={18} />
                </Link>
             </div>

             <div className="story-visual-side">
                <div className="dynamic-photo-stack">
                   {activeStory.photos.slice(0, 6).map((photo: any, idx: number) => (
                     <div key={photo.id} className={`stack-item item-${idx}`}>
                        <img src={photo.image_url} alt="" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Photography Archive Section */}
      <div id="archive-grid-start" className="photography-archive-section">
        <div className="archive-header">
          <div>
            <h2 className="archive-title">Photography Archive</h2>
            <p className="archive-subtitle">Total {photos.length} captures in the collection.</p>
          </div>
          <div className="archive-filters">
             <button className="filter-chip active">All Captures</button>
             <button className="filter-chip">Landscape</button>
             <button className="filter-chip">Street</button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" size={48} color="#10b981" />
          </div>
        ) : (
          <div className="photo-grid">
            {currentPhotos.map((photo) => (
              <div key={photo.id} className="photo-card-wrapper glass-card">
                <div className="photo-card-image">
                  <img src={photo.image_url} alt={photo.title} loading="lazy" />
                  <div className="photo-card-overlay">
                    <div className="overlay-top">
                       <span className="p-category">{photo.category || 'Landscape'}</span>
                    </div>
                    <div className="overlay-bottom">
                       <button className="p-action-btn"><Heart size={18} /></button>
                       <button className="p-action-btn"><MessageSquare size={18} /></button>
                    </div>
                  </div>
                </div>
                <div className="photo-card-info">
                  <div className="photo-metadata">
                    <span><Calendar size={14} /> {new Date(photo.publish_date).toLocaleDateString()}</span>
                    <span><Camera size={14} /> {photo.flickr_id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button className="page-nav" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button key={num} className={`page-number ${currentPage === num ? 'active' : ''}`} onClick={() => paginate(num)}>
                  {num}
                </button>
              ))}
            </div>
            <button className="page-nav" disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .photography-hero-banner { 
          height: 380px; 
          position: relative; 
          overflow: hidden; 
          border-radius: 40px; 
          margin-bottom: 60px; 
          border: 1px solid rgba(255,255,255,0.1);
          padding: 24px;
        }
        .banner-grid-outer { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          grid-template-rows: repeat(2, 1fr); 
          gap: 16px;
          height: 100%; 
        }
        .banner-tile { 
          border-radius: 20px;
          overflow: hidden; 
          opacity: 0.3;
          transition: all 0.5s;
        }
        .banner-tile img { width: 100%; height: 100%; object-fit: cover; }
        .banner-tile:hover { opacity: 0.6; transform: scale(1.02); }
        .banner-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; text-align: center; pointer-events: none; }
        .banner-title { font-size: 5rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.02em; color: #fff; }
        .banner-subtitle { font-size: 0.85rem; color: var(--accent-green); font-weight: 800; letter-spacing: 0.2em; }

        .photography-stories-slider-container { margin-bottom: 80px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .label-flex { display: flex; align-items: center; gap: 12px; }
        .section-label { font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 800; color: #fff; }
        .slider-dots { display: flex; gap: 8px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; cursor: pointer; transition: all 0.3s; }
        .dot.active { background: var(--accent-green); width: 24px; border-radius: 5px; }

        .story-display-wrapper { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; padding: 50px; border-radius: 40px; min-height: 400px; align-items: center; overflow: hidden; }
        .story-content-side { max-width: 450px; z-index: 10; }
        .story-category-tag { color: var(--accent-green); font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem; margin-bottom: 20px; display: block; }
        .story-title-main { font-size: 3rem; line-height: 1.1; margin-bottom: 20px; color: #fff; font-weight: 800; }
        .story-description-main { font-size: 1rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 30px; }
        .explore-story-btn { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 100px; transition: all 0.3s; background: rgba(255,255,255,0.05); font-size: 0.9rem; }
        .explore-story-btn:hover { background: var(--accent-green); color: #000; border-color: var(--accent-green); transform: translateX(5px); }

        .story-visual-side { position: relative; height: 100%; display: flex; align-items: center; justify-content: center; }
        .dynamic-photo-stack { position: relative; width: 100%; height: 400px; }
        .stack-item { position: absolute; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .stack-item img { width: 100%; height: 100%; object-fit: cover; }
        
        .item-0 { width: 220px; height: 300px; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 5; }
        .item-1 { width: 160px; height: 220px; top: 5%; left: 5%; z-index: 3; opacity: 0.8; }
        .item-2 { width: 140px; height: 140px; top: 0%; right: 10%; z-index: 2; opacity: 0.6; }
        .item-3 { width: 200px; height: 160px; bottom: 5%; right: 5%; z-index: 4; }
        .item-4 { width: 180px; height: 240px; bottom: 0%; left: 10%; z-index: 3; }
        .item-5 { width: 120px; height: 120px; top: 35%; right: 0%; z-index: 1; opacity: 0.4; }

        .photography-archive-section { margin-bottom: 100px; }
        .archive-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; }
        .archive-title { font-size: 2.2rem; color: #fff; margin-bottom: 8px; }
        .archive-subtitle { color: var(--text-muted); font-size: 1rem; }
        .archive-filters { display: flex; gap: 10px; }
        .filter-chip { padding: 8px 20px; border-radius: 100px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 0.9rem; }
        .filter-chip.active { background: var(--accent-green); color: #000; border-color: var(--accent-green); }

        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .photo-card-wrapper { border-radius: 24px; overflow: hidden; transition: all 0.4s; border: 1px solid rgba(255,255,255,0.05); }
        .photo-card-wrapper:hover { transform: translateY(-8px); border-color: rgba(16, 185, 129, 0.3); }
        .photo-card-image { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #111; }
        .photo-card-image img { width: 100%; height: 100%; object-fit: cover; transition: all 0.6s; }
        .photo-card-wrapper:hover .photo-card-image img { transform: scale(1.08); }
        .photo-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 40%, transparent 60%, rgba(0,0,0,0.5)); opacity: 0; transition: all 0.4s; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; }
        .photo-card-wrapper:hover .photo-card-overlay { opacity: 1; }
        .p-category { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--accent-green); letter-spacing: 0.1em; }
        .overlay-bottom { display: flex; gap: 10px; justify-content: flex-end; }
        .p-action-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.5); color: #fff; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); cursor: pointer; transition: all 0.2s; }
        .p-action-btn:hover { background: var(--accent-green); color: #000; border-color: var(--accent-green); }
        
        .photo-card-info { padding: 20px; }
        .photo-title { font-size: 1.1rem; margin-bottom: 10px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
        .photo-metadata { display: flex; gap: 16px; color: var(--text-muted); font-size: 0.8rem; }
        .photo-metadata span { display: flex; align-items: center; gap: 5px; }

        .pagination-container { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 50px; }
        .page-nav { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .page-numbers { display: flex; gap: 8px; }
        .page-number { width: 44px; height: 44px; border-radius: 12px; border: 1px solid transparent; background: none; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .page-number.active { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); border-color: rgba(16, 185, 129, 0.2); }

        @media (max-width: 1000px) {
          .story-display-wrapper { grid-template-columns: 1fr; padding: 25px; gap: 30px; }
          .banner-title { font-size: 2.5rem; }
          .story-title-main { font-size: 1.8rem; }
          .dynamic-photo-stack { height: 320px; }
          .item-0 { width: 160px; height: 220px; }
          .item-1, .item-2, .item-3, .item-4, .item-5 { width: 100px; height: 140px; }
          .container { padding: 70px 15px; }
        }

        @media (max-width: 768px) {
          .photography-hero-banner { height: 240px; border-radius: 20px; padding: 12px; }
          .banner-grid-outer { gap: 8px; }
          .banner-title { font-size: 1.8rem; margin-bottom: 8px; }
          .banner-subtitle { font-size: 0.6rem; letter-spacing: 0.12em; }
          .archive-header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .archive-filters { width: 100%; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
          .archive-filters::-webkit-scrollbar { display: none; }
          .filter-chip { white-space: nowrap; flex-shrink: 0; font-size: 0.8rem; padding: 8px 18px; }
          .story-title-main { font-size: 1.5rem; }
          .story-description-main { font-size: 0.85rem; }
          .photo-grid { grid-template-columns: 1fr; gap: 20px; }
          .section-title { font-size: 1.6rem; }
        }

        @media (max-width: 480px) {
          .banner-title { font-size: 1.5rem; }
          .photography-hero-banner { height: 200px; }
          .banner-grid-outer { grid-template-columns: repeat(2, 1fr); }
          .story-display-wrapper { padding: 15px; border-radius: 20px; }
          .dynamic-photo-stack { height: 240px; }
          .item-0 { width: 120px; height: 160px; }
          .item-1, .item-2, .item-3, .item-4, .item-5 { width: 70px; height: 90px; }
        }
      `}</style>
    </div>
  );
}
