import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/api/whatToWatchApi';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logoutHandler: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
    }, []);

    const login = () => {
        const HOST = import.meta.env.VITE_API_HOST;
        window.location.href = `${HOST}login`;
    };

    const logoutHandler = async () => {
        try {
            await api.get('logout');
            setIsAuthenticated(false);
            login(); // Re-trigger login or just clear session
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logoutHandler }}>
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
