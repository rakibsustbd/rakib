'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PhotoStoryDetailPage() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStoryData() {
      setIsLoading(true);
      try {
        // Fetch the story config from 'skills' table
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('*')
          .eq('id', id)
          .single();

        if (skillData) {
          const parsed = JSON.parse(skillData.evidence);
          const photoIds = parsed.photo_ids || [];

          // Fetch all photos in the story
          const { data: photosData } = await supabase
            .from('photos')
            .select('*')
            .in('id', photoIds);

          // Order photos according to the selection order if possible, or just as they come
          const orderedPhotos = photoIds.map((pid: any) => 
            photosData?.find(p => String(p.id) === String(pid))
          ).filter(Boolean);

          setStory({
            title: skillData.name,
            description: parsed.description || '',
            category: parsed.category || 'Visual Story',
            date: skillData.created_at ? new Date(skillData.created_at).toLocaleDateString() : 'Recent'
          });
          setPhotos(orderedPhotos);
        }
      } catch (e) {
        console.error("Error fetching story details:", e);
      }
      setIsLoading(false);
    }

    if (id) fetchStoryData();
  }, [id]);

  if (isLoading) return (
    <div className="loading-state">
      <Loader2 className="animate-spin" size={48} color="#10b981" />
      <p>Developing Story...</p>
    </div>
  );

  if (!story) return <div className="error-state">Story not found.</div>;

  const heroPhotos = photos.slice(0, 8);
  const remainingPhotos = photos.slice(8);

  return (
    <div className="story-detail-container animate-fade-in">

      <header className="story-header animate-fade-in">
        <Link href="/photography" className="back-link">
          <ArrowLeft size={18} /> Back to Archive
        </Link>
        <div className="story-meta-top">
          <span className="story-cat-badge">{story.category}</span>
          <span className="story-date"><Calendar size={14} /> {story.date}</span>
        </div>
      </header>

      {/* Cinematic Hero Frame (Dynamic 3x3 Grid) */}
      <div className="story-hero-frame">
        {heroPhotos.map((p, idx) => (
          <div key={p.id} className={`frame-item p${idx + 1}`}>
            <img src={p.image_url} alt="" />
          </div>
        ))}
        
        {/* Placeholder if fewer than 8 photos */}
        {Array.from({ length: Math.max(0, 8 - heroPhotos.length) }).map((_, i) => (
          <div key={`fill-${i}`} className={`frame-item fill-${i}`} style={{ background: 'rgba(255,255,255,0.02)' }} />
        ))}

        <div className="frame-center-title">
           <div className="story-badge">PHOTO STORY</div>
           <h1 className="story-main-title">{story.title}</h1>
           <p className="story-location">{story.category}</p>
        </div>
      </div>

      <div className="story-narrative-container">
        <p className="story-lead-long">{story.description}</p>
      </div>

      {/* Continuous Archive for Remaining Photos */}
      {remainingPhotos.length > 0 && (
        <div className="story-remaining-archive">
          <h3 className="archive-label">Extended Collection</h3>
          <div className="remaining-grid">
            {remainingPhotos.map((photo) => (
              <div key={photo.id} className="remaining-item">
                <img src={photo.image_url} alt={photo.title} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .story-detail-container { max-width: 1400px; margin: 0 auto; padding: 40px 40px 100px; }
        .back-link { display: flex; align-items: center; gap: 8px; color: var(--text-muted); text-decoration: none; font-weight: 500; transition: color 0.3s ease; margin-bottom: 20px; }
        .back-link:hover { color: var(--accent-green); }
        .story-meta-top { display: flex; gap: 20px; align-items: center; margin-bottom: 40px; }
        .story-cat-badge { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); padding: 6px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border: 1px solid rgba(16, 185, 129, 0.2); }
        .story-date { color: var(--text-muted); font-size: 0.85rem; display: flex; align-items: center; gap: 6px; }

        .story-hero-frame { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 80px; }
        .frame-item { width: 100%; aspect-ratio: 1; border-radius: 20px; overflow: hidden; background: #050505; display: flex; align-items: center; justify-content: center; }
        .frame-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .frame-item:hover img { transform: scale(1.05); }

        .frame-center-title { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 32px; border: 1px solid rgba(255,255,255,0.05); grid-area: 2 / 2; }
        .story-badge { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.3em; color: var(--text-muted); margin-bottom: 16px; }
        .story-main-title { font-size: 2.2rem; font-weight: 800; line-height: 1.1; margin-bottom: 12px; color: #fff; }
        .story-location { color: var(--accent-green); font-size: 0.9rem; font-weight: 600; }

        .story-narrative-container { max-width: 800px; margin: 0 auto 100px; text-align: center; }
        .story-lead-long { font-size: 1.2rem; line-height: 1.7; color: var(--text-secondary); font-style: italic; }

        .story-remaining-archive { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 60px; }
        .archive-label { font-size: 1.5rem; font-weight: 700; margin-bottom: 40px; color: #fff; }
        .remaining-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .remaining-item { border-radius: 16px; overflow: hidden; background: #050505; }
        .remaining-item img { width: 100%; height: auto; display: block; }

        .loading-state { height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: var(--text-muted); }
        .error-state { height: 70vh; display: flex; align-items: center; justify-content: center; color: #ff4b4b; }

        @media (max-width: 1024px) {
          .story-hero-frame { grid-template-columns: 1fr 1fr; }
          .frame-center-title { grid-column: span 2; grid-row: auto; order: -1; margin-bottom: 24px; }
          .remaining-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
