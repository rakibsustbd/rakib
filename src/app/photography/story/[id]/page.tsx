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
      <Link href="/photography" className="back-link">
        <ArrowLeft size={20} /> Back to Archive
      </Link>

      <header className="story-header">
        <div className="story-meta">
          <span className="story-cat-badge">{story.category || 'Visual Story'}</span>
          <span className="story-date"><Calendar size={14} /> {story.date || 'Recent'}</span>
        </div>
        <h1 className="story-main-title">{story.title}</h1>
        <p className="story-lead">{story.description}</p>
        
        <div className="story-actions">
           <button className="action-btn"><Heart size={18} /> Like Story</button>
           <button className="action-btn"><Share2 size={18} /> Share</button>
        </div>
      </header>

      <div className="story-masonry-grid">
        {photos.map((photo, index) => (
          <div key={photo.id} className={`masonry-item ${index % 3 === 0 ? 'large' : 'medium'}`}>
            <img src={photo.image_url} alt={photo.title} />
            <div className="img-caption">{photo.title}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .story-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 100px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          text-decoration: none;
          margin-bottom: 60px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: var(--accent-green);
        }

        .story-header {
          max-width: 800px;
          margin-bottom: 80px;
        }

        .story-meta {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 24px;
        }

        .story-cat-badge {
          background: var(--accent-green);
          color: #000;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .story-date {
          color: var(--text-muted);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .story-main-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.04em;
        }

        .story-lead {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .story-actions {
          display: flex;
          gap: 16px;
        }

        .action-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 10px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--accent-green);
        }

        .story-masonry-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .masonry-item {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #111;
        }

        .masonry-item.large {
          grid-row: span 2;
        }

        .masonry-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .masonry-item:hover img {
          transform: scale(1.05);
        }

        .img-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: #fff;
          font-size: 0.9rem;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .masonry-item:hover .img-caption {
          opacity: 1;
        }

        .loading {
          height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-green);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .story-main-title { font-size: 2.5rem; }
          .story-masonry-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
