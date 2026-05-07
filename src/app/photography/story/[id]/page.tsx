'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Calendar, Share2, Heart } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PhotoStoryDetailPage() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this from a 'stories' table
    // For now, we simulate the story data based on the ID
    const mockStories: any = {
      'himalayan-dawn': {
        title: 'Himalayan Dawn',
        description: 'A journey through the silent peaks of the Annapurna range as the first light breaks.',
        date: 'October 12, 2023',
        location: 'Nepal',
        category: 'Landscape'
      },
      'urban-solitude': {
        title: 'Urban Solitude',
        description: 'Finding peace in the chaotic heart of Dhaka through minimalist street perspectives.',
        date: 'January 05, 2024',
        location: 'Dhaka, Bangladesh',
        category: 'Street'
      },
      'village-rhythm': {
        title: 'Village Rhythm',
        description: 'The simple, unhurried life along the banks of the Shitalakshya river.',
        date: 'March 20, 2024',
        location: 'Narayanganj',
        category: 'Life'
      }
    };

    setStory(mockStories[id as string] || { title: 'Visual Essay', description: 'A collection of moments.' });

    async function fetchStoryPhotos() {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .limit(8); // Showing a collection
      
      if (data) setPhotos(data);
      setIsLoading(false);
    }

    fetchStoryPhotos();
  }, [id]);

  if (isLoading) return <div className="loading">Loading Story...</div>;

  return (
    <div className="story-detail-container animate-fade-in">

      <header className="story-header animate-fade-in">
        <Link href="/photography" className="back-link">
          <ArrowLeft size={18} /> Back to Archive
        </Link>
        <div className="story-meta-top">
          <span className="story-cat-badge">{story.category || 'Visual Story'}</span>
          <span className="story-date"><Calendar size={14} /> {story.date || 'Recent'}</span>
        </div>
      </header>

      {/* Cinematic Hero Frame (3x3 Grid with Title in Center) */}
      <div className="story-hero-frame">
        <div className="frame-item p1"><img src={photos[0]?.image_url} alt="" /></div>
        <div className="frame-item p2"><img src={photos[1]?.image_url} alt="" /></div>
        <div className="frame-item p3"><img src={photos[2]?.image_url} alt="" /></div>
        
        <div className="frame-item p4"><img src={photos[3]?.image_url} alt="" /></div>
        <div className="frame-center-title">
           <div className="story-badge">PHOTO STORY</div>
           <h1 className="story-main-title">{story.title}</h1>
           <p className="story-location">{story.location}</p>
        </div>
        <div className="frame-item p5"><img src={photos[4]?.image_url} alt="" /></div>
        
        <div className="frame-item p6"><img src={photos[5]?.image_url} alt="" /></div>
        <div className="frame-item p7"><img src={photos[6]?.image_url} alt="" /></div>
        <div className="frame-item p8"><img src={photos[7]?.image_url} alt="" /></div>
      </div>

      <div className="story-narrative-container">
        <p className="story-lead-long">{story.description}</p>
      </div>

      {/* Continuous Archive for Remaining Photos */}
      {photos.length > 8 && (
        <div className="story-remaining-archive">
          <h3 className="archive-label">Extended Collection</h3>
          <div className="remaining-grid">
            {photos.slice(8).map((photo) => (
              <div key={photo.id} className="remaining-item">
                <img src={photo.image_url} alt={photo.title} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .story-detail-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 40px 100px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          margin-bottom: 20px;
        }

        .back-link:hover {
          color: var(--accent-green);
        }

        .story-meta-top {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 40px;
        }

        .story-cat-badge {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .story-date {
          color: var(--text-muted);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Cinematic Hero Frame */
        .story-hero-frame {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 80px;
        }

        .frame-item {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .frame-item img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.6s ease;
        }

        .frame-center-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
          background: rgba(255,255,255,0.02);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .story-badge {
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.3em;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .story-main-title {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 12px;
          color: #fff;
        }

        .story-location {
          color: var(--accent-green);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .story-narrative-container {
          max-width: 800px;
          margin: 0 auto 100px;
          text-align: center;
        }

        .story-lead-long {
          font-size: 1.4rem;
          line-height: 1.7;
          color: var(--text-secondary);
          font-style: italic;
        }

        /* Remaining Archive */
        .story-remaining-archive {
          border-top: 1px solid var(--border-color);
          padding-top: 60px;
        }

        .archive-label {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 40px;
          color: var(--text-primary);
        }

        .remaining-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .remaining-item {
          border-radius: 16px;
          overflow: hidden;
          background: #050505;
        }

        .remaining-item img {
          width: 100%;
          height: auto;
          display: block;
        }

        @media (max-width: 1024px) {
          .story-hero-frame { grid-template-columns: 1fr 1fr; }
          .frame-center-title { grid-column: span 2; order: -1; margin-bottom: 24px; }
          .remaining-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .story-hero-frame, .remaining-grid { grid-template-columns: 1fr; }
          .frame-center-title { grid-column: span 1; }
          .story-main-title { font-size: 2rem; }
        }

        .loading {
          height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-green);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
