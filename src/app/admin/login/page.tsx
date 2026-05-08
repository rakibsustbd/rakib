'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll use a simple mock authentication
    // In production, this would use Supabase Auth
    if (email === 'admin@ahmedrakib.com' && password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      alert('Invalid credentials. (Hint: Use admin@ahmedrakib.com / admin123 for now)');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass-card animate-fade-in">
        <div className="login-header">
           <div className="shield-icon">
              <ShieldCheck size={32} />
           </div>
           <h1>Admin Access</h1>
           <p>Secure gateway to your portfolio management system.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
           <p>© 2026 Ahmed Rakib Portfolio. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
          padding: 20px;
        }

        .login-box {
          width: 100%;
          max-width: 450px;
          padding: 50px 40px;
          border-radius: 32px;
          text-align: center;
        }

        .shield-icon {
          width: 64px;
          height: 64px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-green);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .login-header h1 {
          font-size: 2rem;
          margin-bottom: 8px;
          letter-spacing: -0.04em;
        }

        .login-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 40px;
        }

        .login-form {
          text-align: left;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-wrapper input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px 14px 48px;
          color: #fff;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .input-wrapper input:focus {
          border-color: var(--accent-green);
          background: rgba(255,255,255,0.05);
          outline: none;
        }

        .toggle-password {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .login-btn {
          width: 100%;
          background: var(--accent-green);
          color: #000;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .login-btn:hover {
          background: #0ea5e9;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .login-footer {
          margin-top: 40px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
