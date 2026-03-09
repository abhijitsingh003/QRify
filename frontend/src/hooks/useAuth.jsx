import { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        const token = localStorage.getItem('token');
        if (userInfo && token) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify({ name: data.name, email: data.email, _id: data._id }));
        localStorage.setItem('token', data.token);
        setUser({ name: data.name, email: data.email, _id: data._id });
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post('/auth/signup', { name, email, password });
        localStorage.setItem('userInfo', JSON.stringify({ name: data.name, email: data.email, _id: data._id }));
        localStorage.setItem('token', data.token);
        setUser({ name: data.name, email: data.email, _id: data._id });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            // Ignore
        }
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
