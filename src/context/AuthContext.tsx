import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'PLAYER' | 'ADMIN';
    avatar?: string;
    authProvider?: 'local' | 'google';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<any>;
    register: (userData: any) => Promise<any>;
    googleLogin: (token: string) => Promise<any>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (using cookie)
        const checkLoggedIn = async () => {
            console.log('[AuthContext] Checking if user is logged in...');
            try {
                const res = await api.get('/auth/me');
                console.log('[AuthContext] Response:', res.data);
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (err) {
                console.log('[AuthContext] Error or not logged in:', err);
                setUser(null);
            } finally {
                console.log('[AuthContext] Setting loading to false');
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (credentials: any) => {
        try {
            const res = await api.post('/auth/login', credentials);
            if (res.data.success) {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
                setUser(res.data.data);
                return res.data.data;
            }
        } catch (err: any) {
            throw err;
        }
    };

    const register = async (userData: any) => {
        try {
            const res = await api.post('/auth/register', userData);
            if (res.data.success) {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
                setUser(res.data.data);
                return res.data.data;
            }
        } catch (err: any) {
            throw err;
        }
    };

    const googleLogin = async (token: string) => {
        try {
            const res = await api.post('/auth/google', { token });
            if (res.data.success) {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
                setUser(res.data.data);
                return res.data.data;
            }
        } catch (err: any) {
            throw err;
        }
    };

    const logout = async () => {
        console.log('[AuthContext] Starting logout...');
        try {
            await api.get('/auth/logout');
            console.log('[AuthContext] Backend logout successful');
        } catch (err) {
            console.error('[AuthContext] Backend logout failed:', err);
        }
        // Always clear local state regardless of backend response
        localStorage.removeItem('token');
        setUser(null);
        console.log('[AuthContext] Local state cleared, redirecting...');
        // Force full page reload to clear all state
        window.location.href = '/auth';
    };

    const refreshUser = async () => {
        try {
            const res = await api.get('/auth/me');
            if (res.data.success) {
                setUser(res.data.data);
            }
        } catch (err) {
            console.error('Failed to refresh user', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
