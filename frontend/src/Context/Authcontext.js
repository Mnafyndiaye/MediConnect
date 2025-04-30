import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Simuler un utilisateur connecté (changez le rôle pour tester : 'patient', 'medecin', 'assistant', 'admin')
    const [user, setUser] = useState({
        id: 1,
        role: 'patient', // Changez ici pour tester d'autres rôles
        token: 'fake-token'
    });
    const [loading, setLoading] = useState(false);

    const login = async (username, password, role) => {
        setUser({ id: 1, role, token: 'fake-token' });
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};