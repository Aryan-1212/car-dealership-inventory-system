import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';

const Login = () => {
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
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-showroom-navy font-sans p-4">
      <div className="w-full max-w-md bg-warehouse-slate rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-chalk tracking-wide">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-sold-red/10 text-sold-red p-3 rounded-lg text-sm border border-sold-red/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-chalk mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-showroom-navy border border-slate-600 rounded-lg focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass text-chalk outline-none transition-colors"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-chalk mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-showroom-navy border border-slate-600 rounded-lg focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass text-chalk outline-none transition-colors"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 bg-dealer-brass text-showroom-navy rounded-lg font-bold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-dealer-brass focus:ring-offset-2 focus:ring-offset-warehouse-slate transition-all flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-dealer-brass hover:text-white font-medium hover:underline transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
