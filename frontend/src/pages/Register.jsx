import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name || !email || !password) {
      setError('Name, email, and password are required');
      return;
    }
    
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Register the user
      await client.post('/auth/register', { name, email, password });
      
      // 2. Immediately log in since register doesn't return a token
      const loginResponse = await client.post('/auth/login', { email, password });
      const { token, user } = loginResponse.data;
      
      login(token, user);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      toast.success('Account created');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to register. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch font-sans">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-chalk relative z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-200">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-showroom-navy uppercase tracking-wide">Create Account</h1>
            <p className="text-warehouse-slate mt-2 font-medium">Join us to manage inventory</p>
          </div>

          {error && (
            <div className="bg-sold-red/10 text-sold-red p-3 rounded-lg text-sm border border-sold-red/20 font-mono font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-mono font-bold text-showroom-navy uppercase tracking-wider mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-chalk/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass text-showroom-navy outline-none transition-colors font-medium"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-showroom-navy uppercase tracking-wider mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-chalk/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass text-showroom-navy outline-none transition-colors font-medium"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-showroom-navy uppercase tracking-wider mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-chalk/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass text-showroom-navy outline-none transition-colors font-medium"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 mt-2 bg-dealer-brass text-showroom-navy rounded-lg font-display font-bold uppercase tracking-widest hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-dealer-brass focus:ring-offset-2 transition-all flex items-center justify-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-showroom-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-warehouse-slate pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="text-dealer-brass hover:text-showroom-navy font-bold hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Hero / Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-showroom-navy flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 border border-warehouse-slate rounded-full opacity-50 transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 border border-warehouse-slate rounded-full opacity-30"></div>
        <div className="absolute top-2/3 left-0 right-0 h-px bg-warehouse-slate opacity-40 shadow-[0_0_10px_rgba(201,162,93,0.1)]"></div>

        {/* Text */}
        <div className="z-10 text-center mb-16 max-w-lg">
          <h2 className="text-5xl font-display font-bold text-chalk uppercase tracking-widest mb-4 leading-tight">
            Join the lot
          </h2>
          <p className="text-xl font-sans text-chalk/80">
            Create an account to track our inventory and make purchases.
          </p>
        </div>

        {/* Blueprint Car SVG */}
        <div className="z-10 w-full max-w-xl">
          <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
            {/* Ground Line */}
            <line x1="20" y1="250" x2="780" y2="250" stroke="#C9A25D" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
            
            {/* Wheels */}
            <circle cx="180" cy="210" r="35" stroke="#C9A25D" strokeWidth="3" />
            <circle cx="180" cy="210" r="12" stroke="#C9A25D" strokeWidth="2" opacity="0.8" />
            <path d="M 180 175 L 180 185 M 180 235 L 180 245 M 145 210 L 155 210 M 205 210 L 215 210" stroke="#C9A25D" strokeWidth="2" opacity="0.5" />
            
            <circle cx="620" cy="210" r="35" stroke="#C9A25D" strokeWidth="3" />
            <circle cx="620" cy="210" r="12" stroke="#C9A25D" strokeWidth="2" opacity="0.8" />
            <path d="M 620 175 L 620 185 M 620 235 L 620 245 M 585 210 L 595 210 M 645 210 L 655 210" stroke="#C9A25D" strokeWidth="2" opacity="0.5" />
            
            {/* Car Body Silhouette */}
            <path d="M 100 210 L 80 210 C 60 210 50 190 50 170 C 50 150 70 135 100 130 L 250 120 L 360 45 C 410 15 460 15 520 45 L 670 115 C 720 130 750 160 750 185 C 750 205 730 210 700 210 L 670 210" stroke="#C9A25D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 230 210 L 570 210" stroke="#C9A25D" strokeWidth="4" strokeLinecap="round" />
            
            {/* Windows / Cabin */}
            <path d="M 270 120 L 370 55 C 410 35 450 35 495 55 L 600 115 Z" stroke="#C9A25D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="440" y1="42" x2="440" y2="120" stroke="#C9A25D" strokeWidth="3" />
            <line x1="275" y1="115" x2="605" y2="115" stroke="#C9A25D" strokeWidth="3" strokeLinecap="round" />
            
            {/* Headlights / Tail lights */}
            <path d="M 720 145 L 745 155" stroke="#C9A25D" strokeWidth="4" strokeLinecap="round" />
            <path d="M 55 155 L 85 145" stroke="#C9A25D" strokeWidth="4" strokeLinecap="round" />
            
            {/* Minimal Doors */}
            <path d="M 265 120 L 250 205 M 440 120 L 440 205 M 610 115 L 630 180" stroke="#C9A25D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            
            {/* Measurement annotations (Blueprint style) */}
            <line x1="180" y1="270" x2="620" y2="270" stroke="#E9ECF2" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="180" y1="265" x2="180" y2="275" stroke="#E9ECF2" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="620" y1="265" x2="620" y2="275" stroke="#E9ECF2" strokeWidth="1" strokeOpacity="0.5" />
            <text x="400" y="285" fill="#E9ECF2" fontSize="12" fontFamily="monospace" textAnchor="middle" opacity="0.7" letterSpacing="0.1em">WHEELBASE</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Register;
