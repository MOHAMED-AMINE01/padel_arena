import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    allowedRoles?: ('PLAYER' | 'ADMIN')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-padel-blue w-12 h-12" />
                <p className="text-white/50 text-sm animate-pulse">Vérification de la session...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user exists but role not allowed, redirect to their default dashboard
        return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
    }

    return <Outlet />;
};

export const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-padel-blue w-12 h-12" />
                <p className="text-white/50 text-sm animate-pulse">Connexion au serveur...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
    }

    return <Outlet />;
};
