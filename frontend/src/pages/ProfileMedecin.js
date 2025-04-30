import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Grid, Card, CardContent, Typography, Button, TextField, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person, Folder, MedicalServices, Lightbulb } from '@mui/icons-material';

// Données simulées
const mockProfile = {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    specialite: 'Cardiologie',
    numeroRPPS: '123456789',
    email: 'sophie.martin@example.com',
    telephone: '0987654321',
    adresse: 'Dakar, Sénégal'
};

const mockDossiers = [
    { id: 1, patient: 'Jean Dupont', date: '2023-10-01', type: 'Consultation', description: 'Examen cardiaque' },
    { id: 2, patient: 'Marie Curie', date: '2023-11-15', type: 'Analyse', description: 'Échographie' }
];

const mockPrescriptions = [
    { id: 1, patient: 'Jean Dupont', date: '2023-10-02', medicament: 'Aspirine', posologie: '100mg/jour' },
    { id: 2, patient: 'Marie Curie', date: '2023-11-16', medicament: 'Bisoprolol', posologie: '5mg/jour' }
];

const mockSuggestionsIA = [
    { id: 1, patient: 'Jean Dupont', date: '2023-10-03', suggestion: 'Recommander une IRM pour évaluer les artères coronaires' },
    { id: 2, patient: 'Marie Curie', date: '2023-11-17', suggestion: 'Surveiller la tension artérielle pendant 3 mois' }
];

function ProfileMedecin() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        telephone: '',
        adresse: ''
    });
    const [dossiers, setDossiers] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [suggestionsIA, setSuggestionsIA] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profil');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Charger les données simulées
    useEffect(() => {
        if (user && user.role === 'medecin') {
            setLoading(true);
            setTimeout(() => {
                setProfile(mockProfile);
                setFormData({
                    email: mockProfile.email,
                    telephone: mockProfile.telephone,
                    adresse: mockProfile.adresse
                });
                setDossiers(mockDossiers);
                setPrescriptions(mockPrescriptions);
                setSuggestionsIA(mockSuggestionsIA);
                setLoading(false);
            }, 500);
        }
    }, [user]);

    // Simuler la mise à jour du profil
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            setError('Veuillez entrer un email valide');
            return;
        }
        setProfile({ ...profile, ...formData });
        setEditMode(false);
        setError('');
        alert('Profil mis à jour (simulé)');
    };

    if (!user || user.role !== 'medecin') return <div>Accès non autorisé</div>;
    if (loading) return <div>Chargement...</div>;

    const menuItems = [
        { text: 'Profil', section: 'profil', icon: <Person /> },
        { text: 'Dossiers Patients', section: 'dossiers', icon: <Folder /> },
        { text: 'Prescriptions', section: 'prescriptions', icon: <MedicalServices /> },
        { text: 'Suggestions IA', section: 'suggestions', icon: <Lightbulb /> }
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Mon Espace Médecin</Typography>
            {error && <Typography color="error">{error}</Typography>}

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ width: 240 }}
            >
                <List>
                    {menuItems.map(item => (
                        <ListItem button key={item.section} onClick={() => { setActiveSection(item.section); setDrawerOpen(false); }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Button variant="contained" onClick={() => setDrawerOpen(true)} sx={{ mb: 2 }}>
                Menu
            </Button>

            <Grid container spacing={3}>
                {activeSection === 'profil' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Informations Personnelles</Typography>
                                {!profile ? (
                                    <Typography>Chargement du profil...</Typography>
                                ) : (
                                    <>
                                        <Typography><strong>Nom :</strong> {profile.nom}</Typography>
                                        <Typography><strong>Prénom :</strong> {profile.prenom}</Typography>
                                        <Typography><strong>Spécialité :</strong> {profile.specialite}</Typography>
                                        <Typography><strong>Numéro RPPS :</strong> {profile.numeroRPPS}</Typography>
                                        <Typography><strong>Email :</strong> {profile.email}</Typography>
                                        <Typography><strong>Téléphone :</strong> {profile.telephone}</Typography>
                                        <Typography><strong>Adresse :</strong> {profile.adresse}</Typography>

                                        {editMode ? (
                                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                                <TextField
                                                    label="Email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Téléphone"
                                                    type="tel"
                                                    value={formData.telephone}
                                                    onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Adresse"
                                                    value={formData.adresse}
                                                    onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <Button type="submit" variant="contained" sx={{ mr: 1 }}>Enregistrer</Button>
                                                <Button variant="outlined" onClick={() => setEditMode(false)}>Annuler</Button>
                                            </Box>
                                        ) : (
                                            <Button variant="contained" onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
                                                Modifier
                                            </Button>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {activeSection === 'dossiers' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Dossiers Patients</Typography>
                                {dossiers.length === 0 ? (
                                    <Typography>Aucun dossier disponible.</Typography>
                                ) : (
                                    <Box>
                                        {dossiers.map(dossier => (
                                            <Box key={dossier.id} sx={{ mb: 1, p: 1, borderBottom: '1px solid #ddd' }}>
                                                <Typography><strong>{dossier.patient}</strong> - {dossier.date} : {dossier.type} ({dossier.description})</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {activeSection === 'prescriptions' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Prescriptions</Typography>
                                {prescriptions.length === 0 ? (
                                    <Typography>Aucune prescription.</Typography>
                                ) : (
                                    <Box>
                                        {prescriptions.map(prescription => (
                                            <Box key={prescription.id} sx={{ mb: 1, p: 1, borderBottom: '1px solid #ddd' }}>
                                                <Typography><strong>{prescription.patient}</strong> - {prescription.date} : {prescription.medicament} ({prescription.posologie})</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {activeSection === 'suggestions' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Suggestions IA</Typography>
                                {suggestionsIA.length === 0 ? (
                                    <Typography>Aucune suggestion disponible.</Typography>
                                ) : (
                                    <Box>
                                        {suggestionsIA.map(suggestion => (
                                            <Box key={suggestion.id} sx={{ mb: 1, p: 1, borderBottom: '1px solid #ddd' }}>
                                                <Typography><strong>{suggestion.patient}</strong> - {suggestion.date} : {suggestion.suggestion}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

export default ProfileMedecin;