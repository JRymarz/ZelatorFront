import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {
    AppBar,
    Box,
    Button, Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:9002/groups", { withCredentials: true })
            .then(response => {
                setGroups(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError("Nie udało się pobrać listy grup.");
                setLoading(false);
            });
    }, []);

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


    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

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

            <Box
                sx={{
                    padding: 2,
                    textAlign: "center",
                    marginBottom: 4,
                    borderRadius: "8px",
                    backgroundColor: "#f9fbe7",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                <h1>Lista Grup</h1>
                {loading ? (
                    <Typography variant="h6" sx={{ marginTop: 4 }}>Ładowanie...</Typography>
                ) : error ? (
                    <Typography variant="h6" sx={{ marginTop: 4, color: "red" }}>{error}</Typography>
                ) : groups.length > 0 ? (
                    <TableContainer component={Paper} sx={{ width: "100%", marginTop: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nazwa Grupy</TableCell>
                                    <TableCell>Akcje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {groups.map((group) => (
                                    <TableRow key={group.groupId}>
                                        <TableCell>{group.name}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component={Link}
                                                to={`/group/${group.groupId}`}
                                            >
                                                Zobacz
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" sx={{ marginTop: 4 }}>Brak dostępnych grup.</Typography>
                )}
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

export default GroupList;