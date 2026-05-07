'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar, Camera, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const PHOTOS_PER_PAGE = 15;

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPhotos() {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .order('publish_date', { ascending: false });
      if (data) setPhotos(data);
      setIsLoading(false);
    }
    fetchPhotos();
  }, []);

  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
  const indexOfLastPhoto = currentPage * PHOTOS_PER_PAGE;
  const indexOfFirstPhoto = indexOfLastPhoto - PHOTOS_PER_PAGE;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  // For the banner, pick 12 recent photos for a denser grid
  const bannerPhotos = photos.slice(0, 12);

  // For the Photo Story slider, we'll simulate stories by picking specific images
  // In a real scenario, this would be a separate 'stories' table in Supabase
  const storyCollections = [
    { id: 'himalayan-dawn', title: 'Himalayan Dawn', category: 'Landscape', image: photos[6]?.image_url },
    { id: 'urban-solitude', title: 'Urban Solitude', category: 'Street', image: photos[7]?.image_url },
    { id: 'village-rhythm', title: 'Village Rhythm', category: 'Life', image: photos[8]?.image_url },
    { id: 'mist-over-padma', title: 'Mist Over Padma', category: 'Nature', image: photos[9]?.image_url },
    { id: 'dhaka-lights', title: 'Dhaka Lights', category: 'Urban', image: photos[10]?.image_url },
  ];

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const element = document.getElementById('archive-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container animate-fade-in">
      
      {/* Photo Hero Banner */}
      <div className="photography-hero-banner glass-card">
        <div className="banner-grid">
           {bannerPhotos.map((p) => (
             <div key={p.id} className="banner-item">
               <img src={p.local_path || p.image_url} alt={p.title} />
             </div>
           ))}
        </div>
        <div className="banner-overlay">
          <div className="banner-content">
             <h1 className="banner-title">Visual Archive</h1>
             <p className="banner-subtitle">Capturing moments through the lens of time.</p>
          </div>
        </div>
      </div>

      {/* Photo Stories Section (Pinterest Style Slider) */}
      <div className="stories-section">
        <div className="section-header">
          <h2 className="section-label">Photo Stories</h2>
          <span className="scroll-hint">Scroll to explore →</span>
        </div>
        
        <div className="stories-slider">
          <div className="stories-track">
            {storyCollections.map((story, index) => (
              <div 
                key={story.id} 
                className={`story-card ${index % 3 === 0 ? 'tall' : index % 3 === 1 ? 'wide' : 'small'}`}
              >
                <Link href={`/photography/story/${story.id}`}>
                  <div className="story-img-container">
                    <img src={story.image || 'linear-gradient(135deg, #050505 0%, #064e3b 100%)'} alt={story.title} />
                    <div className="story-hover-info">
                      <span className="story-cat">Photo Story</span>
                      <h4 className="story-title-mini">{story.title}</h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Archive Grid */}
      <div id="archive-section" className="photography-archive-section">
        <div className="section-header">
          <h2 className="section-label">Archive</h2>
          <span className="photo-count-badge">{photos.length} Photos</span>
        </div>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={40} color="var(--accent-green)" />
          </div>
        ) : (
          <>
            <div className="photo-grid">
              {currentPhotos.map((photo) => (
                <div key={photo.id} className="photo-archive-card animate-fade-in">
                  <Link href={`/photography/${photo.id}`}>
                    <div 
                      className="photo-img-wrap glass-card"
                      style={{ 
                        backgroundImage: `url('${photo.local_path || photo.image_url}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#050505' // Fallback base
                      }}
                    >
                      <div className="photo-overlay-simple">
                         <div className="photo-stats-mini">
                            <span><Heart size={14} /> {photo.likes || 0}</span>
                            <span><MessageSquare size={14} /> 0</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                  {/* Title hidden as requested to keep the archive clean */}
                </div>
              ))}
            </div>

            {/* Pagination Controls - Same as Blog */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className={`page-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
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
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .photography-hero-banner {
          width: 100%;
          height: 300px;
          margin-bottom: 60px;
          position: relative;
          background: #000;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(16, 185, 129, 0.1);
        }

        .banner-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          height: 100%;
          opacity: 0.35;
        }

        .stories-section {
          margin-bottom: 80px;
        }

        .scroll-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .stories-slider {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow-x: auto;
          padding: 20px 40px 40px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .stories-slider::-webkit-scrollbar {
          display: none;
        }

        .stories-track {
          display: flex;
          gap: 24px;
          width: max-content;
        }

        .story-card {
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          background: #111;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .story-card.tall { width: 320px; height: 480px; }
        .story-card.wide { width: 440px; height: 350px; margin-top: 65px; }
        .story-card.small { width: 280px; height: 380px; margin-top: 30px; }

        .story-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--accent-green);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          z-index: 10;
        }

        .story-img-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .story-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .story-card:hover img {
          transform: scale(1.1);
        }

        .story-hover-info {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .story-card:hover .story-hover-info {
          opacity: 1;
        }

        .story-cat {
          color: var(--accent-green);
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .story-title-mini {
          color: #fff;
          font-size: 1.2rem;
          margin: 0;
        }

        .banner-item {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .banner-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .banner-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: -0.04em;
        }

        .banner-subtitle {
          color: var(--accent-green);
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }

        .photography-archive-section {
          margin-bottom: 100px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }

        .photo-count-badge {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .photo-archive-card {
          background: rgba(255,255,255,0.01);
          padding: 12px;
          border-radius: 20px;
          transition: all 0.4s ease;
        }

        .photo-archive-card:hover {
          background: rgba(255,255,255,0.03);
          transform: translateY(-5px);
        }

        .photo-img-wrap {
          width: 100%;
          height: 220px; /* Fixed height landscape aspect */
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 16px;
          position: relative;
          cursor: pointer;
        }

        .photo-overlay-simple {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 16px;
        }

        .photo-img-wrap:hover .photo-overlay-simple {
          opacity: 1;
        }

        .photo-stats-mini {
          display: flex;
          gap: 16px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .photo-stats-mini span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .photo-info {
          padding: 0 4px;
        }

        .photo-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: block;
          margin-bottom: 6px;
        }

        .photo-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Pagination - matching blog styles exactly */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 60px;
        }

        .page-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: transparent;
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
          width: 40px;
        }

        .page-btn.disabled {
          opacity: 0.2;
          cursor: not-allowed;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .photo-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .photo-grid {
            grid-template-columns: 1fr;
          }
          .banner-title {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
