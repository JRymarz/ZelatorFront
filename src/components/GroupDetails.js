import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {
    AppBar,
    Box,
    Button,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const GroupDetails = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:9002/group/${groupId}`, {withCredentials: true})
            .then(response => {
                setGroup(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Błąd podczas pobierania danych grupy:", error);
                setError("Nie udało się załadować danych grupy.");
                setLoading(false);
            });
    }, [groupId]);


    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
    }, []);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:9002/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (error) {
            console.error("Błąd przy wylogowywaniu", error);
            navigate("/login");
        }
    };

    const handleHome = () => {
        navigate("/");
    };

    const handleAppointLeader = (userId) => {
        axios.post(`http://localhost:9002/group/${groupId}/appoint-leader/${userId}`, {}, { withCredentials: true })
            .then((response) => {
                alert("Lider został zmieniony.");
            })
            .catch((error) => {
                console.error("Błąd podczas mianowania lidera:", error);
                alert("Nie udało się zmienić lidera.");
            });
    }


    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#f0f4c3",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column"
        }}>
            <AppBar position="static" sx={{marginBottom: 4, backgroundColor: "#ff5252"}}>
                <Toolbar
                    sx={{
                        maxWidth: "1500px",
                        width: "100%",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{cursor: "pointer"}} onClick={handleHome}>
                        <img src="/rosaryIco.png" style={{width: 50, height: 50, marginRight: 8}}/>
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            flexGrow: 1,
                            cursor: "pointer",
                            mr: 2,
                            display: {xs: "none", md: "flex"},
                            fontFamily: "monospace",
                            fontWeight: 300,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                        onClick={handleHome}
                    >
                        Zelator
                    </Typography>

                    <Box>
                        <Button color="inherit" component={Link} to="/zelator" sx={{mr: 2}}>
                            Pulpit Zelatora
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Wyloguj się
                            <LogoutIcon sx={{fontSize: 40, marginLeft: 1}}/>
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
                <h1>Nazwa grupy: {group.name}</h1>
                <h3>Członkowie grupy:</h3>

                <TableContainer component={Paper} sx={{ width: "100%", marginTop: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Imię</TableCell>
                                <TableCell>Nazwisko</TableCell>
                                <TableCell>Akcja</TableCell> {/* Nowa kolumna */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {group.members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.firstName}</TableCell>
                                    <TableCell>{member.lastName}</TableCell>
                                    <TableCell>
                                        {/* Przycisk "Mianuj Zelatorem" tylko jeśli id członka nie jest równe group.leader.id */}
                                        {member.id !== group.leader?.id && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleAppointLeader(member.id)} // Funkcja do obsługi mianowania
                                            >
                                                Mianuj Zelatorem
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

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
};

export default GroupDetails;