'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Heart, MessageSquare, Send, Calendar, Download, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PhotoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [photo, setPhoto] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function fetchPhoto() {
      if (!params?.id) return;
      
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setPhoto(data);
        setLikes(data.likes || 0);
      }
      setIsLoading(false);
    }

    fetchPhoto();
  }, [params?.id]);

  const handleLike = async () => {
    if (!photo) return;
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);
    
    await supabase
      .from('photos')
      .update({ likes: newLikes })
      .eq('id', photo.id);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} color="var(--accent-green)" />
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="not-found">
        <h2>Photo not found</h2>
        <Link href="/photography" className="back-link">Return to Archive</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="photo-view-layout">
        
        {/* Sidebar / Info */}
        <aside className="photo-info-sidebar">
          <button onClick={() => router.back()} className="back-btn">
            <ArrowLeft size={20} /> Back
          </button>

          <div className="photo-meta-header">
            <h1 className="photo-title">{photo.title}</h1>
            <div className="meta-row">
              <Calendar size={16} /> 
              <span>{new Date(photo.publish_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>

          <p className="photo-description">
            {photo.description || "No description provided for this capture."}
          </p>

          <div className="photo-stats-bar glass-card">
            <button 
              className={`stat-btn ${isLiked ? 'active' : ''}`} 
              onClick={handleLike}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              <span>{likes} Likes</span>
            </button>
            <button className="stat-btn">
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3 className="section-title"><MessageSquare size={18} /> Comments (0)</h3>
            
            <div className="comment-box glass-card">
              <textarea 
                placeholder="Add a comment..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="send-comment">
                <Send size={16} />
              </button>
            </div>

            <div className="empty-comments">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          </div>
        </aside>

        {/* Main Content / Image */}
        <main className="photo-display-main">
          <div className="photo-stage glass-card">
             <img 
               src={photo.local_path || photo.image_url} 
               alt={photo.title} 
               className="main-photo"
             />
             <div className="stage-actions">
                <a href={photo.flickr_url} target="_blank" rel="noopener noreferrer" className="stage-btn">
                   <ExternalLink size={18} /> View on Flickr
                </a>
                <a href={photo.local_path || photo.image_url} download className="stage-btn">
                   <Download size={18} /> Download
                </a>
             </div>
          </div>
        </main>

      </div>

      <style jsx>{`
        .photo-view-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
          padding: 40px 0 100px;
        }

        .photo-info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
          margin-bottom: 10px;
        }
        .back-btn:hover { color: var(--accent-green); }

        .photo-title {
          font-size: 2.5rem;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 12px;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-green);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .photo-description {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.05rem;
        }

        .photo-stats-bar {
          display: flex;
          padding: 16px;
          gap: 20px;
          border-radius: 16px;
        }
        .stat-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .stat-btn:hover { color: var(--accent-green); }
        .stat-btn.active { color: #ff4b4b; }

        .comments-section {
          margin-top: 20px;
        }
        .section-title {
          font-size: 1.1rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .comment-box {
          position: relative;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 30px;
        }
        .comment-box textarea {
          width: 100%;
          background: none;
          border: none;
          color: white;
          min-height: 80px;
          outline: none;
          resize: none;
          font-family: inherit;
        }
        .send-comment {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: var(--accent-green);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .empty-comments {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
          padding: 20px;
        }

        .photo-display-main {
          position: relative;
        }
        .photo-stage {
          padding: 12px;
          border-radius: 24px;
          position: sticky;
          top: 40px;
        }
        .main-photo {
          width: 100%;
          height: auto;
          border-radius: 16px;
          display: block;
        }
        .stage-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 16px;
          padding: 0 8px;
        }
        .stage-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .stage-btn:hover { color: var(--accent-green); }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
        }

        @media (max-width: 1024px) {
          .photo-view-layout {
            grid-template-columns: 1fr;
          }
          .photo-stage { position: static; }
        }
      `}</style>
    </div>
  );
}
