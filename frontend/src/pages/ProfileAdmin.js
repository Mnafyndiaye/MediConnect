import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Grid, Card, CardContent, Typography, Button, TextField, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person, GroupAdd, Storage } from '@mui/icons-material';

// Données simulées
const mockProfile = {
    id: 4,
    nom: 'Durand',
    prenom: 'Paul',
    email: 'paul.durand@example.com',
    telephone: '0567890123',
    adresse: '101 Rue de l’Hôpital, Paris'
};

const mockComptes = [
    { id: 1, type: 'Patient', nom: 'Dupont', prenom: 'Jean', dateCreation: '2023-10-01' },
    { id: 2, type: 'Médecin', nom: 'Martin', prenom: 'Sophie', dateCreation: '2023-11-15' }
];

const mockOrthanc = {
    status: 'En ligne',
    images: 150,
    lastUpdate: '2023-12-01'
};

function ProfileAdmin() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        telephone: '',
        adresse: ''
    });
    const [comptes, setComptes] = useState([]);
    const [orthanc, setOrthanc] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profil');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Charger les données simulées
    useEffect(() => {
        if (user && user.role === 'admin') {
            setLoading(true);
            setTimeout(() => {
                setProfile(mockProfile);
                setFormData({
                    email: mockProfile.email,
                    telephone: mockProfile.telephone,
                    adresse: mockProfile.adresse
                });
                setComptes(mockComptes);
                setOrthanc(mockOrthanc);
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

    if (!user || user.role !== 'admin') return <div>Accès non autorisé</div>;
    if (loading) return <div>Chargement...</div>;

    const menuItems = [
        { text: 'Profil', section: 'profil', icon: <Person /> },
        { text: 'Création Comptes', section: 'comptes', icon: <GroupAdd /> },
        { text: 'Supervision Orthanc', section: 'orthanc', icon: <Storage /> }
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Mon Espace Administrateur</Typography>
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

                {activeSection === 'comptes' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Création Comptes</Typography>
                                {comptes.length === 0 ? (
                                    <Typography>Aucun compte créé.</Typography>
                                ) : (
                                    <Box>
                                        {comptes.map(compte => (
                                            <Box key={compte.id} sx={{ mb: 1, p: 1, borderBottom: '1px solid #ddd' }}>
                                                <Typography><strong>{compte.type}</strong> - {compte.nom} {compte.prenom} (Créé le {compte.dateCreation})</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {activeSection === 'orthanc' && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Supervision Orthanc</Typography>
                                {!orthanc ? (
                                    <Typography>Chargement des données Orthanc...</Typography>
                                ) : (
                                    <>
                                        <Typography><strong>Statut :</strong> {orthanc.status}</Typography>
                                        <Typography><strong>Nombre d’images :</strong> {orthanc.images}</Typography>
                                        <Typography><strong>Dernière mise à jour :</strong> {orthanc.lastUpdate}</Typography>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

export default ProfileAdmin;