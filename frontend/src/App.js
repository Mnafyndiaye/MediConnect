import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfilePatient from './pages/ProfilePatient';
import ProfileMedecin from './pages/ProfileMedecin';
import ProfileAssistant from './pages/ProfileAssistant';
import ProfileAdmin from './pages/ProfileAdmin';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
    const context = useContext(AuthContext);

    if (!context) {
        return <div>Erreur : AuthContext non défini</div>;
    }

    const { user, loading, logout } = context;

    if (loading) return <div>Chargement...</div>;

    return (
        <Router>
            <div className="App">
                <h1>MediConnect</h1>
                <nav>
                    {user && (
                        <>
                            {user.role === 'patient' && <Link to="/profile/patient">Mon Espace</Link>}
                            {user.role === 'medecin' && <Link to="/profile/medecin">Mon Espace</Link>}
                            {user.role === 'assistant' && <Link to="/profile/assistant">Mon Espace</Link>}
                            {user.role === 'admin' && <Link to="/profile/admin">Mon Espace</Link>}
                            {' | '}
                            <button onClick={logout}>Déconnexion</button>
                        </>
                    )}
                </nav>
                <Routes>
                    <Route path="/profile/patient" element={<ProfilePatient />} />
                    <Route path="/profile/medecin" element={<ProfileMedecin />} />
                    <Route path="/profile/assistant" element={<ProfileAssistant />} />
                    <Route path="/profile/admin" element={<ProfileAdmin />} />
                    <Route path="*" element={<div>Page non trouvée</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;