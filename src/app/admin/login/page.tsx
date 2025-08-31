'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  console.log('AdminLogin component rendered');

  // Check if user is already logged in
  useEffect(() => {
    console.log('AdminLogin useEffect running');
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          router.push('/admin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    console.log('checkAuth');

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user info in localStorage for client-side access
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        router.push('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-primary to-coral-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-2xl font-bold text-coral-primary">T</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            TechOrbitze
          </h1>
          <p className="text-white/80 text-lg">Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coral-primary focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                placeholder="admin@techorbitze.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coral-primary focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral-primary text-white py-4 px-6 rounded-xl font-semibold hover:bg-coral-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          {/* <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Demo Credentials
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-16">Email:</span>
                <span className="text-coral-primary">admin@techorbitze.com</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-16">Password:</span>
                <span className="text-coral-primary">admin123</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
