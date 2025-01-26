import React, {useState, useEffect, useCallback} from 'react';
import {Box, Typography, Button, Grid, Paper} from "@mui/material";
import {Link} from 'react-router-dom';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AppBar, Toolbar, TextField, CircularProgress} from "@mui/material";
import {useUser} from "../context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { FormControlLabel, Switch } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer,} from "@mui/material";


const DashboardZelator = () => {
    const [user, setUser] = useState(useUser);

    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/');
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:9002/logout", {}, {withCredentials: true});
            console.log(response.data);

            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Blad przy wylogowywaniu", error);
            navigate('/login');
        }
    };


    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f0f4c3', margin: 0, padding: 0}}>
            <AppBar position="static" sx={{marginBottom: 4, backgroundColor: '#ff5252'}}>
                <Toolbar sx={{
                    maxWidth: '1500px',
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-beetween'
                }}>
                    <Typography sx={{cursor: 'pointer'}} onClick={handleHome}>
                        <img
                            src="/rosaryIco.png"
                            style={{width: 50, height: 50, marginRight: 8}}
                        />
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            flexGrow: 1, cursor: 'pointer',
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 300,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}

                        onClick={handleHome}
                    >
                        Zelator
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/*{user?.role === "Zelator" && (*/}
                            <Button
                                color="inherit"
                                component={Link}
                                to="/zelator"
                                sx={{ mr: 2 }} // Opcjonalnie możesz dodać margines
                            >
                                Pulpit Zelatora
                            </Button>
                        {/*// )}*/}

                        <Button color="inherit" onClick={handleLogout}>
                            Wyloguj się
                            <LogoutIcon sx={{ fontSize: 40, marginLeft: 1 }} />
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: 3,
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: 2,
                width: '800px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <Typography variant="h4" gutterBottom>
                    Pulpit Zelatora
                </Typography>

                <Grid container spacing={3}>
                    {/* Sekcja z linkami do innych stron */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Zarządzanie użytkownikami
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                component={Link} // Link do /create-user
                                to="/create-user"
                                sx={{
                                    borderRadius: '5px',
                                    padding: '10px',
                                    fontSize: '16px',
                                    backgroundColor: '#ff5252',
                                    '&:hover': {
                                        backgroundColor: '#e03e3e'
                                    }
                                }}
                            >
                                Dodaj użytkownika
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Zarządzanie Różą
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                component={Link} // Link do /create-group
                                to="/create-group"
                                sx={{
                                    borderRadius: '5px',
                                    padding: '10px',
                                    fontSize: '16px',
                                    backgroundColor: '#ff5252',
                                    '&:hover': {
                                        backgroundColor: '#e03e3e'
                                    }
                                }}
                            >
                                Stwórz grupę
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Członkowie
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                component={Link} // Link do /members
                                to="/members"
                                sx={{
                                    borderRadius: '5px',
                                    padding: '10px',
                                    fontSize: '16px',
                                    backgroundColor: '#ff5252',
                                    '&:hover': {
                                        backgroundColor: '#e03e3e'
                                    }
                                }}
                            >
                                Zobacz członków
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Moja Róża
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                component={Link} // Link do /my-rose
                                to="/my-rose"
                                sx={{
                                    borderRadius: '5px',
                                    padding: '10px',
                                    fontSize: '16px',
                                    backgroundColor: '#ff5252',
                                    '&:hover': {
                                        backgroundColor: '#e03e3e'
                                    }
                                }}
                            >
                                Szczegóły
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <footer style={{
                backgroundColor: '#ff5252',
                color: '#fff',
                textAlign: 'center',
                padding: '10px 0',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                marginTop: 'auto',
            }}>
                <Typography variant="body2">
                    &copy; 2025 Zelator. Wszystkie prawa zastrzeżone.
                </Typography>
            </footer>
        </div>
    );
};

export default DashboardZelator;