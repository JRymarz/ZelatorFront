import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, Box, TextField, CircularProgress} from "@mui/material";
import {useUser} from "../context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';



function CreateUser() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:9002/create-user",
                formData,
                {withCredentials: true}
            );
            alert(response.data);
        } catch (error) {
            console.error("Bład podczas tworzenia konta użytkownika:", error);
            alert("Nie udało się utworzyć konta użytkownika.");
        }
    };

    const navigate = useNavigate();
    const [user, setUser] = useState(useUser);

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


    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
    }, []);


    return(
        <div style={{minHeight: '100vh', backgroundColor: '#f0f4c3', margin: 0, padding: 0, display: "flex", flexDirection: "column"}}>
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
                            <LogoutIcon sx={{fontSize: 40, marginLeft: 1}}></LogoutIcon>
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <div style={{
                padding: '20px',
                paddingRight: '40px',
                textAlign: 'center',
                borderRadius: '10px',
                border: '3px solid #ff5252',
                backgroundColor: '#f9fbe7',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                margin: '0 auto',
                maxWidth: '500px',
            }}>
                <h2>Utwórz nowe konto użytkownika</h2>

                <form onSubmit={handleSubmit}>
                    {/*<label>*/}
                    {/*    Imię:*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="firstName"*/}
                    {/*        value={formData.firstName}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</label>*/}
                    <TextField
                        label="Imię"
                        variant="outlined"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    {/*<label>*/}
                    {/*    Nazwisko:*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="lastName"*/}
                    {/*        value={formData.lastName}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</label>*/}
                    <TextField
                        label="Nazwisko"
                        variant="outlined"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    {/*<label>*/}
                    {/*    Email:*/}
                    {/*    <input*/}
                    {/*        type="email"*/}
                    {/*        name="email"*/}
                    {/*        value={formData.email}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</label>*/}
                    <TextField
                        label="Email"
                        variant="outlined"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    {/*<label>*/}
                    {/*    Hasło*/}
                    {/*    <input*/}
                    {/*        type="password"*/}
                    {/*        name="password"*/}
                    {/*        value={formData.password}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</label>*/}
                    <TextField
                        label="Hasło"
                        variant="outlined"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{marginBottom: 2}}
                    />

                    {/*<button type="submit">Utwórz konto użytkownika</button>*/}
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        sx={{width: '100%', marginTop: '20px'}}
                    >
                        Utwórz konto
                    </Button>
                </form>
            </div>

            <footer style={{
                backgroundColor: '#ff5252',
                color: '#fff',
                textAlign: 'center',
                padding: '10px 0',
                width: '100%',
                marginTop: 'auto',
            }}>
                <Typography variant="body2">
                    &copy; 2025 Zelator. Autor: Jakub Rymarz.
                </Typography>
            </footer>
        </div>
    );

}

export default CreateUser;