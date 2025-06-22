import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';
import {getAuthUser, logout as logoutService} from '../services/AuthService.ts';
import User from '../interfaces/User';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    setUser: () => {
    },
    logout: () => {
    },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on page load
        const checkAuth = async () => {
            try {
                const userData = await getAuthUser();
                setUser(userData);
            } catch (error) {
                console.error(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth().then(() => {
        });
    }, []);

    const logout = () => {
        logoutService().then(() => {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }).catch(error => {
            console.error('Logout error:', error);
            // Still clear user on error
            setUser(null);
        });
    };

    return (
        <AuthContext.Provider value={{user, loading, setUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
};