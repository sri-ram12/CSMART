import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute — protects all /admin/* pages.
 * - If auth is still loading: show a spinner.
 * - If user is not logged in OR not ADMIN role: redirect to /admin/login.
 * - Otherwise: render the protected child page.
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="bg-amber-600/20 rounded-full p-5">
          <ShieldCheck className="w-10 h-10 text-amber-500" />
        </div>
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Verifying admin access…</p>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    // Preserve the page they tried to visit so we can redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

