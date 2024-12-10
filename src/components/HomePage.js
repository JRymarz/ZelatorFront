import React, {useEffect, useState} from "react";
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

function HomePage() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrenttUser = async () => {
            try {
                const response = await axios.get("http://localhost:9002/current-user", {withCredentials: true});
                console.log('Zalogowany user:', response.data);
                setUser(response.data);
            } catch (error) {
                console.error('Brak zalogowanego usera', error);
                setUser(null);
            }
        };

        fetchCurrenttUser();
    }, []);


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

    const handleLogin = () => {
        navigate('/login');
    };

    const handleHome = () => {
        navigate('/');
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

                    <Box>
                        {user?.role === "Zelator" && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/zelator"
                            sx={{ mr: 2 }} // Opcjonalnie możesz dodać margines
                        >
                            Pulpit Zelatora
                        </Button>
                        )}

                        {user ? (
                            <Button color="inherit" onClick={handleLogout}>
                                Wyloguj się
                                <LogoutIcon sx={{fontSize: 40, marginLeft: 1}}></LogoutIcon>
                            </Button>
                        ) : (
                            <Button color="inherit" sx={{}} onClick={handleLogin}>
                                Zaloguj się
                                <LoginIcon sx={{fontSize: 40, marginLeft: 1}}></LoginIcon>
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <div style={{
                padding: '20px',
                textAlign: 'center',
                borderRadius: '10px', // Zaokrąglone rogi
                border: '3px solid #ff5252', // Czerwona ramka
                backgroundColor: '#f9fbe7', // Tło dla kontenera
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Opcjonalny cień
                margin: '0 auto', // Centrowanie w poziomie
                maxWidth: '700px'
            }}>
                <h2>Witamy w aplikacji Zelator!</h2>
                <p>Nasza aplikacja pomaga zarządzać grupami modlitewnymi, planować zmiany tajemnic różańcowych i modlić
                    się wspólnie.</p>

                <Button variant="outlined" color="error" onClick={handleLogin}>
                    Zaloguj się, aby zacząć
                </Button>

                <div style={{marginTop: '30px'}}>
                    <h3>Dlaczego warto?</h3>
                    <ul style={{
                        listStyleType: 'none', // Usuwa domyślne punkty
                        padding: 0, // Usuwa domyślne wcięcia
                        marginLeft: '200px'
                    }}>
                        <li style={{
                            display: 'flex', // Umożliwia wyrównanie ikony i tekstu
                            alignItems: 'center', // Wyrównuje ikonę z tekstem
                            marginBottom: '15px', // Odstęp między elementami listy
                        }}>
                            <span style={{
                                width: '30px', // Szerokość ikony
                                height: '30px', // Wysokość ikony
                                borderRadius: '50%', // Zaokrąglenie ikony (okrąg)
                                backgroundColor: '#ff5252', // Tło ikony
                                display: 'flex',
                                justifyContent: 'center', // Centruje ikonę
                                alignItems: 'center', // Centruje ikonę
                                color: 'white', // Kolor ikony
                                marginRight: '10px', // Odstęp od tekstu
                            }}>
                                ✔️
                            </span>
                            Automatyczne przypomnienia o modlitwach.
                        </li>
                        <li style={{
                            display: 'flex', // Umożliwia wyrównanie ikony i tekstu
                            alignItems: 'center', // Wyrównuje ikonę z tekstem
                            marginBottom: '15px', // Odstęp między elementami listy
                        }}>
                            <span style={{
                                width: '30px', // Szerokość ikony
                                height: '30px', // Wysokość ikony
                                borderRadius: '50%', // Zaokrąglenie ikony (okrąg)
                                backgroundColor: '#ff5252', // Tło ikony
                                display: 'flex',
                                justifyContent: 'center', // Centruje ikonę
                                alignItems: 'center', // Centruje ikonę
                                color: 'white', // Kolor ikony
                                marginRight: '10px', // Odstęp od tekstu
                            }}>
                                ✔️
                            </span>
                            Łatwe przypisanie intencji do modlitw.
                        </li>
                        <li style={{
                            display: 'flex', // Umożliwia wyrównanie ikony i tekstu
                            alignItems: 'center', // Wyrównuje ikonę z tekstem
                            marginBottom: '15px', // Odstęp między elementami listy
                        }}>
                            <span style={{
                                width: '30px', // Szerokość ikony
                                height: '30px', // Wysokość ikony
                                borderRadius: '50%', // Zaokrąglenie ikony (okrąg)
                                backgroundColor: '#ff5252', // Tło ikony
                                display: 'flex',
                                justifyContent: 'center', // Centruje ikonę
                                alignItems: 'center', // Centruje ikonę
                                color: 'white', // Kolor ikony
                                marginRight: '10px', // Odstęp od tekstu
                            }}>
                                ✔️
                            </span>
                            Planowanie zmian tajemnic w grupach.
                        </li>
                    </ul>
                </div>
            </div>

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
                    &copy; 2024 Zelator. Wszystkie prawa zastrzeżone.
                </Typography>
            </footer>
        </div>
    );

}

export default HomePage;