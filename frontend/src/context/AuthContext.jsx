import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);     // { id, name, email, role }
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);  // hydration done?

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('qf_token');
            const storedUser = localStorage.getItem('qf_user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch {
            // corrupt storage — clear it
            localStorage.removeItem('qf_token');
            localStorage.removeItem('qf_user');
        }
        setReady(true);
    }, []);

    const login = useCallback((token, userData) => {
        localStorage.setItem('qf_token', token);
        localStorage.setItem('qf_user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('qf_token');
        localStorage.removeItem('qf_user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, ready, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
