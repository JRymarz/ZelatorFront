import React, {useState} from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {useUser} from "../context/UserContext";
import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';


export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {setUser} = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');

        const loginData = {
            email,
            password
        }

        try {
            const response = await axios.post('http://localhost:9002/login', loginData, {withCredentials: true});

            console.log(response)
            console.log('przed ifem')

            const loggedUser = await axios.get("http://localhost:9002/current-user", {withCredentials: true})
            if(response.status === 200){
                console.log('Dane z backendu:', loggedUser.data)
                setUser(loggedUser.data);
                console.log("Ustawiony user: ", loggedUser.data);
                navigate("/");
            }
        } catch (error) {
            if(error.response) {
                setError(error.response.data || 'Logowanie nie powiodło się.');
            } else {
                setError('Niespodziewany błąd');
            }
        }
    };

    const handleHome = () => {
        navigate('/');
    };


    return(
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
                        {/*<HomeSharp sx={{fontSize: 50, marginRight: 1}}> </HomeSharp>*/}
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
                </Toolbar>
            </AppBar>

            <div style={{
                padding: '20px',
                paddingRight: '40px',
                textAlign: 'center',
                borderRadius: '10px', // Zaokrąglone rogi
                border: '3px solid #ff5252', // Czerwona ramka
                backgroundColor: '#f9fbe7', // Tło dla kontenera
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Opcjonalny cień
                margin: '0 auto', // Centrowanie w poziomie
                maxWidth: '500px',
            }}>
                <h2>Logowanie</h2>

                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="hasło"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        sx={{width: '100%', marginTop: '20px'}}
                    >
                        Zaloguj
                    </Button>
                </form>
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
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
    )

}