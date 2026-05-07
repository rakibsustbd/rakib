'use client';

import { ChevronLeft, ChevronRight, BookOpen, Camera, ExternalLink } from 'lucide-react';
import { useRef } from 'react';

export default function PhotographyPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const galleryImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', title: 'Everest Twilight', location: 'Solukhumbu, Nepal' },
    { id: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', title: 'Annapurna Range', location: 'Gandaki, Nepal' },
    { id: 3, url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80', title: 'City Lights', location: 'Dhaka, Bangladesh' },
  ];

  const archiveImages = [
    { id: 4, url: 'https://images.unsplash.com/photo-1470252649358-96957c053e9a?auto=format&fit=crop&w=800&q=80', title: 'Mountain Mist' },
    { id: 5, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', title: 'Reflections' },
    { id: 6, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', title: 'Peaks' },
    { id: 7, url: 'https://images.unsplash.com/photo-1519681393784-d120267953ba?auto=format&fit=crop&w=800&q=80', title: 'Starry Night' },
    { id: 8, url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80', title: 'Nature Echo' },
    { id: 9, url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80', title: 'Forest Path' },
  ];

  const photoStories = [
    { id: 1, title: 'The Silence of Mountains', cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', pages: 12 },
    { id: 2, title: 'City of Dreams', cover: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80', pages: 24 },
    { id: 3, title: 'Lost in Wilderness', cover: 'https://images.unsplash.com/photo-1470252649358-96957c053e9a?auto=format&fit=crop&w=800&q=80', pages: 18 },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="container animate-fade-in">
      <header className="intro-section">
        <h1 className="intro-title">Photography</h1>
        <p className="intro-desc">
          Capturing light, shadows, and the essence of time. A journey through lenses and landscapes.
        </p>
      </header>

      <section className="display-slider">
        <div className="slider-controls">
          <button onClick={() => scroll('left')} className="slider-btn"><ChevronLeft /></button>
          <button onClick={() => scroll('right')} className="slider-btn"><ChevronRight /></button>
        </div>
        <div className="slider-track" ref={scrollRef}>
          {galleryImages.map((img) => (
            <div key={img.id} className="slider-item gallery-item glass-card">
              <div className="gallery-img">
                <img src={img.url} alt={img.title} />
                <div className="gallery-overlay">
                  <h3 className="gallery-title">{img.title}</h3>
                  <p className="gallery-location">{img.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-100">
        <h2 className="archive-heading">Photo Stories</h2>
        <div className="story-grid">
          {photoStories.map((story) => (
            <div key={story.id} className="story-card glass-card">
              <div className="story-cover">
                <img src={story.cover} alt={story.title} />
                <div className="story-icon">
                  <BookOpen size={24} />
                </div>
              </div>
              <div className="story-info">
                <h3 className="story-title">{story.title}</h3>
                <p className="story-meta">{story.pages} Photos • Visual Essay</p>
                <button className="read-story-btn">
                  View Story <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="archive-section">
        <h2 className="archive-heading">Visual Archive</h2>
        <div className="archive-grid">
          {archiveImages.map((img) => (
            <div key={img.id} className="archive-card photography-card">
              <div className="archive-img-wrap" style={{ aspectRatio: '1' }}>
                <img src={img.url} alt={img.title} />
                <div className="photo-label">{img.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="photography-footer">
        <p>Explore more on <a href="https://www.flickr.com/photos/rakiiiiiiib/" target="_blank" rel="noopener noreferrer" className="accent-link">Flickr Archive</a></p>
      </div>

      <style jsx>{`
        .mb-100 { margin-bottom: 100px; }
        .archive-heading {
          font-size: 2.5rem;
          margin-bottom: 40px;
          letter-spacing: -0.04em;
        }
        .gallery-item {
          padding: 0;
          overflow: hidden;
          border-radius: 24px;
        }
        .gallery-img {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
        }
        .gallery-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px;
        }
        .gallery-title { font-size: 2rem; }
        .slider-controls {
          position: absolute;
          top: -60px;
          right: 0;
          display: flex;
          gap: 12px;
        }
        .slider-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .slider-btn:hover { background: var(--accent-green); }
        
        .story-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .story-card { padding: 0; overflow: hidden; }
        .story-cover {
          position: relative;
          aspect-ratio: 4/5;
        }
        .story-cover img { width: 100%; height: 100%; object-fit: cover; }
        .story-icon {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--accent-green);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px var(--accent-green-glow);
        }
        .story-info { padding: 24px; }
        .story-title { font-size: 1.25rem; margin-bottom: 8px; }
        .story-meta { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 20px; }
        .read-story-btn {
          background: transparent;
          border: 1px solid var(--accent-green);
          color: var(--accent-green);
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .read-story-btn:hover { background: var(--accent-green); color: white; }

        .photography-card {
          position: relative;
        }
        .photo-label {
          position: absolute;
          bottom: 20px;
          left: 20px;
          font-size: 0.75rem;
          background: rgba(0,0,0,0.5);
          padding: 4px 10px;
          border-radius: 4px;
          opacity: 0;
          transition: var(--transition-smooth);
        }
        .archive-card:hover .photo-label { opacity: 1; }
      `}</style>
    </div>
  );
}
