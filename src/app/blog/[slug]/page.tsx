'use client';

import { ArrowLeft, Send, MessageCircle, Heart, Share2, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function BlogPostPage() {
  const [comment, setComment] = useState('');
  
  const post = {
    title: "শহরের কোনো এক উষ্ণতম দিনে....",
    category: "ভাবনা",
    date: "এপ্রিল ২৮, ২০২৪",
    author: "Ahmed Rakib",
    readTime: "৩ মিনিট",
    content: `
      ঠিক উষ্ণতম বলা যাবে না হয়তো। তবে প্রচন্ড দাবদাহকে উপেক্ষাও করা যাচ্ছে না। স্মৃতিকথন লেখার জন্য একেবারেই উপযুক্ত আবহাওয়া নয়। এডিসন ভাইয়ের আবিষ্কারের সরকারী ডিজিটাইজড ব্যবস্থাপনায় আশা যাওয়ায় লেখালেখি দূরে থাক, একটু প্রশান্তিতে ঘুমিয়ে থাকাটাই দায়। 
      
      কি অদ্ভুত, সময় গড়ে দেয় ব্যবধান। একটা সময় এই রকম আবহাওয়ায় খেলার মাঠে কত সময় কাটিয়েছি। আর আজ চার দেয়ালের মাঝে ফ্যানের নিচে বসেও অস্থির লাগছে। বয়স নাকি পরিস্থিতি, কোনটা এর জন্য দায়ী তা বলা মুশকিল।
      
      এই গরমের মাঝেই মনে পড়ে গেল কিছু পুরোনো স্মৃতি। বন্ধুরা মিলে পুকুরে ঝাঁপিয়ে পড়ার সেই দুপুরগুলো। এখন আর সেই দিন নেই, সেই বন্ধুরাও নেই কাছাকাছি। সবাই যার যার জীবনে ব্যস্ত। 
      
      তবে এই উষ্ণতম দিনেও একটা শান্তি আছে। যখন হঠাৎ করে এক পশলা বৃষ্টি এসে সব কিছু ঠান্ডা করে দেয়। মাটির সোঁদা গন্ধ আর বৃষ্টির শব্দ সব ক্লান্তি ধুয়ে মুছে নিয়ে যায়। হয়তো আজ বিকেলেও এমন একটা বৃষ্টির অপেক্ষায় আছি।
    `
  };

  const initialComments = [
    { id: 1, user: "তানভীর আহমেদ", text: "খুব সুন্দর লিখেছেন রাকিব ভাই। অনুপ্রেরণা পেলাম!", date: "২ ঘণ্টা আগে" },
    { id: 2, user: "সায়মা চৌধুরী", text: "আপনার অভিজ্ঞতাগুলো সবসময়ই নতুন কিছু শেখায়। ধন্যবাদ শেয়ার করার জন্য।", date: "৫ ঘণ্টা আগে" }
  ];

  return (
    <div className="container animate-fade-in">
      <Link href="/blog" className="back-link">
        <ArrowLeft size={18} /> Back to Stories
      </Link>

      <article className="post-container">
        <header className="post-header">
          <div className="post-category-tag bengali">{post.category}</div>
          <h1 className="post-full-title bengali">{post.title}</h1>
          <div className="post-meta-full">
            <span className="meta-item"><User size={16} /> {post.author}</span>
            <span className="meta-item"><Calendar size={16} /> {post.date}</span>
            <span className="meta-item">⏱️ {post.readTime} পড়া</span>
          </div>
        </header>

        <div className="post-featured-image glass-card">
           {/* Image placeholder */}
           <div className="image-overlay-subtle"></div>
        </div>

        <div className="post-content bengali">
          {post.content.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <footer className="post-footer">
          <div className="post-actions">
            <button className="action-btn"><Heart size={20} /> <span>১২৪</span></button>
            <button className="action-btn"><Share2 size={20} /> <span>শেয়ার</span></button>
          </div>
        </footer>

        {/* Comment Section */}
        <section className="comment-section">
          <h3 className="section-title"><MessageCircle size={22} /> আলোচনা ({initialComments.length})</h3>
          
          <div className="comment-input-wrap glass-card">
            <textarea 
              placeholder="আপনার মতামত লিখুন..." 
              className="comment-textarea bengali"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="input-footer">
              <span className="input-tip">Bengali supported</span>
              <button className="send-btn">
                Send <Send size={16} />
              </button>
            </div>
          </div>

          <div className="comments-list">
            {initialComments.map((c) => (
              <div key={c.id} className="comment-item glass-card">
                <div className="comment-header">
                  <span className="comment-user">{c.user}</span>
                  <span className="comment-date">{c.date}</span>
                </div>
                <p className="comment-text bengali">{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <style jsx>{`
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--text-secondary);
          margin-bottom: 40px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .back-link:hover {
          color: var(--accent-green);
          transform: translateX(-5px);
        }

        .post-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .post-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .post-category-tag {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          padding: 6px 16px;
          border-radius: 8px;
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .post-full-title {
          font-size: 3rem;
          line-height: 1.2;
          margin-bottom: 24px;
          letter-spacing: -0.04em;
        }

        .post-meta-full {
          display: flex;
          justify-content: center;
          gap: 24px;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .post-featured-image {
          width: 100%;
          height: 500px;
          border-radius: 24px;
          background: #111;
          margin-bottom: 60px;
          position: relative;
          overflow: hidden;
        }

        .post-content {
          font-size: 1.2rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 60px;
        }

        .post-content p {
          margin-bottom: 30px;
        }

        .post-footer {
          padding-top: 40px;
          border-top: 1px solid var(--border-color);
          margin-bottom: 80px;
        }

        .post-actions {
          display: flex;
          gap: 24px;
        }

        .action-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          color: var(--accent-green);
        }

        .comment-section {
          margin-bottom: 100px;
        }

        .section-title {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .comment-input-wrap {
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 40px;
        }

        .comment-textarea {
          width: 100%;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.1rem;
          min-height: 120px;
          outline: none;
          resize: none;
          font-family: inherit;
        }

        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .input-tip {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .send-btn {
          background: var(--accent-green);
          color: #000;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .send-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px var(--accent-green-glow);
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .comment-item {
          padding: 24px;
          border-radius: 16px;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .comment-user {
          font-weight: 600;
          color: var(--accent-green);
        }

        .comment-date {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .comment-text {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .post-full-title { font-size: 2.2rem; }
          .post-meta-full { flex-direction: column; gap: 12px; align-items: center; }
          .post-featured-image { height: 300px; }
        }
      `}</style>
    </div>
  );
}
