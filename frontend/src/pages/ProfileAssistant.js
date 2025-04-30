import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Grid, Card, CardContent, Typography, Button, TextField, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person, PersonAdd, CalendarToday } from '@mui/icons-material';

// Données simulées
const mockProfile = {
    id: 3,
    nom: 'Leroy',
    prenom: 'Claire',
    email: 'claire.leroy@example.com',
    telephone: '0678901234',
    adresse: '789 Boulevard des Assistants, Paris'
};

const mockPatients = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', dateCreation: '2023-10-01' },
    { id: 2, nom: 'Curie', prenom: 'Marie', dateCreation: '2023-11-15' }
];

const mockAgendas = [
    { id: 1, medecin: 'Dr. Martin', date: '2023-12-01', heure: '10:00', patient: 'Jean Dupont' },
    { id: 2, medecin: 'Dr. Dubois', date: '2023-12-02', heure: '14:30', patient: 'Marie Curie' }
];

function ProfileAssistant() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        telephone: '',
        adresse: ''
    });
    const [patients, setPatients] = useState([]);
    const [agendas, setAgendas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profil');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Charger les données simulées
    useEffect(() => {
        if (user && user.role === 'assistant') {
            setLoading(true);
            setTimeout(() => {
                setProfile(mockProfile);
                setFormData({
                    email: mockProfile.email,
                    telephone: mockProfile.telephone,
                    adresse: mockProfile.adresse
                });
                setPatients(mockPatients);
                setAgendas(mockAgendas);
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

    if (!user || user.role !== 'assistant') return <div>Accès non autorisé</div>;
    if (loading) return <div>Chargement...</div>;

    const menuItems = [
        { text: 'Profil', section: 'profil', icon: <Person /> },
        { text: 'Création Patients', section: 'patients', icon: <PersonAdd /> },
        { text: 'Agendas', section: 'agendas', icon: <CalendarToday /> }
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Mon Espace Assistant</Typography>
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

                {activeSection === 'patients' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Création Patients</Typography>
                                {patients.length === 0 ? (
                                    <Typography>Aucun patient créé.</Typography>
                                ) : (
                                    <Box>
                                        {patients.map(patient => (
                                            <Box key={patient.id} sx={{ mb: 1, p: 1, borderBottom: '1px solid #ddd' }}>
                                                <Typography><strong>{patient.nom} {patient.prenom}</strong> - Créé le {patient.dateCreation}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {activeSection === 'agendas' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Agendas</Typography>
                                {agendas.length === 0 ? (
                                    <Typography>Aucun rendez-vous planifié.</Typography>
                                ) : (
                                    <Box>
                                        {agendas.map(agenda => (
                                            <Box key={agenda.id} sx={{ mb: 1, p: 1, borderBottom: '1px solid #ddd' }}>
                                                <Typography><strong>{agenda.medecin}</strong> - {agenda.date} {agenda.heure} : {agenda.patient}</Typography>
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

export default ProfileAssistant;