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

  // For the banner, pick 6 recent photos
  const bannerPhotos = photos.slice(0, 6);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="container animate-fade-in">
      
      {/* Photo Hero Banner (Similar to Blog Statement Banner but with photos) */}
      <div className="photography-hero-banner glass-card">
        <div className="banner-grid">
           {bannerPhotos.map((p) => (
             <div key={p.id} className="banner-item">
               <img src={p.local_path || p.image_url} alt={p.title} />
             </div>
           ))}
           {bannerPhotos.length === 0 && (
             <div className="banner-placeholder">
               <Camera size={48} color="rgba(255,255,255,0.1)" />
             </div>
           )}
        </div>
        <div className="banner-overlay">
          <div className="banner-content">
             <h1 className="banner-title">Visual Archive</h1>
             <p className="banner-subtitle">Capturing moments through the lens of time.</p>
          </div>
        </div>
      </div>

      {/* Archive Grid - Matching Blog Style */}
      <div className="photography-archive-section">
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
                        backgroundPosition: 'center'
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
                  <div className="photo-info">
                    <span className="photo-date">{new Date(photo.publish_date).toLocaleDateString()}</span>
                    <h3 className="photo-title bengali">{photo.title}</h3>
                  </div>
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
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          height: 100%;
          opacity: 0.4;
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
