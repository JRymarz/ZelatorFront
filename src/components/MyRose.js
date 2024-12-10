import React, {useEffect, useState} from "react";
import axios from "axios";
import {useUser} from "../context/UserContext";
import {AppBar, Toolbar, Typography, Button, Box, TextField, CircularProgress} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { FormControlLabel, Switch } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {MenuItem} from "@mui/material";


function MyRose() {


    const [roseDetails, setRoseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableMysteries, setAvailableMysteries] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedMystery, setSelectedMystery] = useState(null);
    // const {user, loading: userLoading} = useUser();

    useEffect(() => {
        const fetchRoseDetails = async () => {
            try {
                const response = await axios.get("http://localhost:9002/my-rose",
                    {withCredentials: true}
                );
                setRoseDetails(response.data);
                console.log(response.data)
            } catch (error) {
                setError("Nie udało się pobrać informacji o róży.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoseDetails();
    }, []);


    const fetchAvailableMysteries = async (roseId) => {
        try {
            const response = await axios.get(`http://localhost:9002/roses/${roseId}/available-mysteries`,
                {withCredentials: true}
            );

            setAvailableMysteries(response.data);
        } catch (error) {
            alert("Nie udało się pobrać dostępnych tajemnic.");
        }
    };


    const handleAssignMystery = async (memberId) => {
        try {
            if(!selectedMystery) return alert("Wybierz tajemnicę.");
            await axios.patch(`http://localhost:9002/members/${memberId}/assign-mystery?mysteryId=${selectedMystery}`,
                null,
                {
                        withCredentials: true},
                );

            alert("Tajemnica została przypisana.");
            setSelectedMember(null);
            const response = await axios.get('http://localhost:9002/my-rose',
                {withCredentials: true},
                );

            setRoseDetails(response.data);
            setSelectedMember(null);
            setSelectedMystery(null);
        } catch (error) {
            alert("Nie udało się przypisać tajemnicy.");
        }
    };


    const handleRemoveMember = async (memberId) => {
        try {
            const confirmation = window.confirm("Czy na pewno chcesz usunąć tego członka z róży?");
            if(confirmation) {
                await axios.delete(`http://localhost:9002/members/${memberId}/remove`,
                    {withCredentials: true},
                );

                alert("Użytkownik został usunięty z róży.");
                const response = await axios.get("http://localhost:9002/my-rose",
                    {withCredentials: true},
                );

                setRoseDetails(response.data);
            }
        } catch (error) {
            alert("Nie udało się usunąć członka z róży.");
        }
    };

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


    if(loading) return <p>Ładowanie...</p>;
    if(error) return <p>{error}</p>;

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

            <Box sx={{
                padding: 2,
                textAlign: "center",
                marginBottom: 4,
                borderRadius: "8px",
                backgroundColor: "#f9fbe7",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
            }}>
                <h1>Moja róża</h1>
                <h2>{roseDetails.name}</h2>
                <p><strong>Obecna intencja:</strong> {roseDetails.intention.title}</p>
                <p>{roseDetails.intention.description}</p>

                <h3>Członkowie róży:</h3>

                <TableContainer component={Paper} sx={{width: "100%", marginTop: 4}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Imię</TableCell>
                                <TableCell>Nazwisko</TableCell>
                                <TableCell>Tajemnica</TableCell>
                                <TableCell>Akcja</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roseDetails.members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.firstName}</TableCell>
                                    <TableCell>{member.lastName}</TableCell>
                                    <TableCell>{member.mystery?.name || "Nie przypisano tajemnicy"}</TableCell>
                                    <TableCell>
                                        {member.mystery.id === null && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    setSelectedMember(member.id);
                                                    fetchAvailableMysteries(roseDetails.id);
                                                }}
                                                sx={{marginRight: '3px'}}
                                            >
                                                Przypisz tajemnicę
                                            </Button>
                                        )}
                                        {user && user.id !== member.id && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleRemoveMember(member.id)}
                                            >
                                                Usuń z Róży
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {selectedMember && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fff",
                            padding: 3,
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                            width: "300px",
                            textAlign: "center",
                        }}
                    >
                        <h3>Przypisz tajemnicę</h3>
                        <TextField
                            select
                            label="Wybierz tajemnicę"
                            fullWidth
                            value={selectedMystery || ""}
                            onChange={(e) => setSelectedMystery(e.target.value)}
                            sx={{marginBottom: 2}}
                        >
                            {availableMysteries.map((mystery) => (
                                <MenuItem key={mystery.id} value={mystery.id}>
                                    {mystery.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAssignMystery(selectedMember)}
                            >
                                Przypisz
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setSelectedMember(null)}
                            >
                                Anuluj
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>

            {/*<h1>Moja róża</h1>*/}
            {/*<h2>{roseDetails.name}</h2>*/}
            {/*<p><strong>Obecna intencja:</strong> {roseDetails.intention.title}</p>*/}
            {/*<p>{roseDetails.intention.description}</p>*/}
            {/*<h3>Członkowie róży:</h3>*/}
            {/*<table>*/}
            {/*    <thead>*/}
            {/*        <tr>*/}
            {/*            <th>Imię</th>*/}
            {/*            <th>Nazwisko</th>*/}
            {/*            <th>Tajemnica</th>*/}
            {/*            <th>Akcja</th>*/}
            {/*        </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    {roseDetails.members.map(member => (*/}
            {/*        <tr key={member.id}>*/}
            {/*            <td>{member.firstName}</td>*/}
            {/*            <td>{member.lastName}</td>*/}
            {/*            <td>{member.mystery?.name || "Nie przypisano tajemnicy"}</td>*/}
            {/*            <td>*/}
            {/*                {member.mystery.id === null && (*/}
            {/*                    <button*/}
            {/*                        onClick={() => {*/}
            {/*                            setSelectedMember(member.id);*/}
            {/*                            fetchAvailableMysteries(roseDetails.id);*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                     Przypisz tajemnicę*/}
            {/*                    </button>*/}
            {/*                )}*/}
            {/*                {user && user.id !== member.id && (*/}
            {/*                    <button onClick={() => handleRemoveMember(member.id)}>*/}
            {/*                        Usuń członka*/}
            {/*                    </button>*/}
            {/*                )}*/}
            {/*            </td>*/}
            {/*        </tr>*/}
            {/*    ))}*/}
            {/*    </tbody>*/}
            {/*</table>*/}

            {/*{selectedMember && (*/}
            {/*    <div className="modal">*/}
            {/*        <h3>Przypisz tajemnicę</h3>*/}
            {/*        <select onChange={(e) => setSelectedMystery(e.target.value)} value={selectedMystery || ""}>*/}
            {/*            <option value="">Wybierz tajemnicę</option>*/}
            {/*            {availableMysteries.map((mystery) => (*/}
            {/*                <option key={mystery.id} value={mystery.id}>*/}
            {/*                    {mystery.name}*/}
            {/*                </option>*/}
            {/*                ))}*/}
            {/*        </select>*/}
            {/*        <button onClick={() => handleAssignMystery(selectedMember)}>Przypisz</button>*/}
            {/*        <button onClick={() => setSelectedMember(null)}>Anuluj</button>*/}
            {/*    </div>*/}
            {/*)}*/}

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

export default MyRose;