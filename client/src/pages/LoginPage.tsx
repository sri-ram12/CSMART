import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck, UserCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCustomer = () => {
    setEmail('rahul.sharma@example.com');
    setPassword('Customer@12345');
  };

  const handleQuickAdmin = () => {
    setEmail('admin@chandhanashoemart.com');
    setPassword('Admin@12345');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-white shadow-xl border-none relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500 font-medium">
            Access your order history, saved addresses, and wishlist
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 text-xs text-red-600 font-semibold flex items-center gap-2 border-none">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3.5 text-xs font-bold flex items-center justify-center gap-2 border-none shadow-md cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        {/* 1-Click Evaluation Credentials for User and Admin */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-center">
            Instant Demo Logins:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-bold text-slate-700 hover:text-red-600 hover:bg-red-50/50 transition-all flex items-center justify-center gap-1.5 border-none ring-1 ring-slate-200 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-bold text-slate-700 hover:text-red-600 hover:bg-red-50/50 transition-all flex items-center justify-center gap-1.5 border-none ring-1 ring-slate-200 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 font-medium">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-red-600 font-extrabold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
