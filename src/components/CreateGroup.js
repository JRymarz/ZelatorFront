import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, Box, TextField, CircularProgress} from "@mui/material";
import {useUser} from "../context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';


function CreateGroup() {
    const [formData, setFormData] = useState({
        name: "",
        intentionId: "",
    });

    const [intentionList, setIntentionList] = useState([]);

    useEffect(() => {
        const fetchIntentions = async () => {
            try {
                const response = await axios.get("http://localhost:9002/intentions", {withCredentials: true});
                setIntentionList(response.data);
            } catch (error) {
                console.error("Bład podczas pobierania intencji:", error);
            }
        };

        fetchIntentions();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:9002/groups/create",
                formData,
                {withCredentials: true},
            );
            alert(response.data);
        } catch (error) {
            alert("Nie udało się utworzyń nowej róży.");
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
                <h2>Utwórz nową Różę</h2>

                <form onSubmit={handleSubmit}>
                    {/*<label>*/}
                    {/*    Nazwa grupy:*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="name"*/}
                    {/*        value={formData.name}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</label>*/}
                    <TextField
                        label="Nazwa grupy"
                        variant="outlined"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    {/*<label>*/}
                    {/*    Intencja:*/}
                    {/*    <select*/}
                    {/*        name="intentionId"*/}
                    {/*        value={formData.intentionId}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    >*/}
                    {/*        <option value="">Wybierz intencję</option>*/}
                    {/*        {intentionList.map((intention) => (*/}
                    {/*            <option key={intention.id} value={intention.id}>*/}
                    {/*                {intention.title}*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </select>*/}
                    {/*</label>*/}
                    <TextField
                        select
                        label="Intencja"
                        variant="outlined"
                        name="intentionId"
                        value={formData.intentionId}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={{marginBottom: 2}}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value=""></option>
                        {intentionList.map((intention) => (
                            <option key={intention.id} value={intention.id}>
                                {intention.title}
                            </option>
                        ))}
                    </TextField>
                    {/*<button type="submit">Utwórz Różę</button>*/}
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        sx={{width: '100%', marginTop: '20px'}}
                    >
                        Utwórz Różę
                    </Button>
                </form>
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

export default CreateGroup;