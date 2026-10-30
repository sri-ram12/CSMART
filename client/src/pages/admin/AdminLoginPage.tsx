import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Where to redirect after successful admin login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in as admin → redirect immediately
  React.useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate(from, { replace: true });
    } else if (user) {
      // Logged in but not admin
      setError('Access denied. This account does not have administrator privileges.');
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      // useEffect above will handle redirect once user state updates
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Invalid credentials. Please try again.');
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 rounded-full p-3">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Admin Portal</h1>
            <p className="text-amber-100 text-sm mt-1">Chandhana Shoe Mart — Restricted Access</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="admin@chandhana.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm tracking-wide flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign In to Admin Panel
                  </>
                )}
              </button>
            </form>

            {/* Back to store */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Back to Chandhana Shoe Mart
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          🔒 This area is restricted to authorized administrators only
        </p>
      </div>
    </div>
  );
}
