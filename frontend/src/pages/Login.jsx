import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!email || !password) {
      setError('Email and password are required');
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
      const response = await client.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      toast.success('Welcome back');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
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
            <h1 className="text-4xl font-display font-bold text-showroom-navy uppercase tracking-wide">Welcome Back</h1>
            <p className="text-warehouse-slate mt-2 font-medium">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-sold-red/10 text-sold-red p-3 rounded-lg text-sm border border-sold-red/20 font-mono font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-chalk/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass text-showroom-navy outline-none transition-colors font-medium pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warehouse-slate hover:text-showroom-navy focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-8 relative rounded-xl border border-slate-200 bg-chalk/50 p-1">
            <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 border border-slate-200 rounded-md shadow-sm flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-dealer-brass">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 011.08.732V16.5a.75.75 0 01-1.5 0v-1.5c0-.184.093-.35.244-.45l.042-.02a.75.75 0 01-1.08-.733v-1.428l.708-2.836a.75.75 0 00-1.063-.853l-.041.021a.75.75 0 11-.75-1.299zM12 8.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
              </svg>
              <span className="font-mono text-[10px] font-bold text-showroom-navy uppercase tracking-widest">Demo Access</span>
            </div>
            
            <div className="pt-3 pb-1 px-1 flex flex-col gap-1.5">
              <button 
                type="button"
                onClick={() => {setEmail('admin@gmail.com'); setPassword('admin1234');}}
                className="group flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 hover:border-dealer-brass hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-showroom-navy text-dealer-brass flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-showroom-navy">Administrator</h3>
                    <p className="text-xs font-mono text-warehouse-slate mt-0.5">admin@gmail.com</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-dealer-brass transition-colors mb-1 hidden sm:block">Click to auto-fill</span>
                  <span className="text-xs font-mono font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 group-hover:border-dealer-brass/30 transition-colors">pass: admin1234</span>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => {setEmail('customer@gmail.com'); setPassword('cust1234');}}
                className="group flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 hover:border-dealer-brass hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-showroom-navy flex items-center justify-center shrink-0 group-hover:bg-showroom-navy group-hover:text-chalk transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-showroom-navy">Customer</h3>
                    <p className="text-xs font-mono text-warehouse-slate mt-0.5">customer@gmail.com</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-dealer-brass transition-colors mb-1 hidden sm:block">Click to auto-fill</span>
                  <span className="text-xs font-mono font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 group-hover:border-dealer-brass/30 transition-colors">pass: cust1234</span>
                </div>
              </button>
            </div>
          </div>

          <p className="text-center text-sm font-medium text-warehouse-slate pt-4 border-t border-slate-100 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-dealer-brass hover:text-showroom-navy font-bold hover:underline transition-colors">
              Register here
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
            Find your next car
          </h2>
          <p className="text-xl font-sans text-chalk/80">
            Log in to browse our premium lot and drive away today.
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

export default Login;
