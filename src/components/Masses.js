import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

function Masses() {
    const [massRequests, setMassRequests] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMassRequests = async () => {
            try {
                const response = await axios.get("http://localhost:9002/mass-requests", { withCredentials: true });
                setMassRequests(response.data);
            } catch (error) {
                setError("Nie udało się pobrać listy próśb o zamówienie Mszy Świętych.");
            } finally {
                setLoading(false);
            }
        };

        fetchMassRequests();
    }, []);

    const handleHome = () => {
        navigate("/");
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:9002/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (error) {
            console.error("Błąd przy wylogowywaniu", error);
            navigate("/login");
        }
    };

    const updateRequestStatus = async (id, newStatus) => {
        try {
            let endpoint = "";

            if (newStatus === "APPROVED") {
                endpoint = `http://localhost:9002/mass-requests/${id}/approve`;
            } else if (newStatus === "REJECTED") {
                endpoint = `http://localhost:9002/mass-requests/${id}/reject`;
            } else {
                console.error("Nieobsługiwany status:", newStatus);
                return;
            }

            await axios.post(endpoint, {}, { withCredentials: true });

            // Aktualizacja stanu na froncie
            setMassRequests((prev) =>
                prev.map((request) => (request.id === id ? { ...request, status: newStatus } : request))
            );
        } catch (error) {
            console.error("Błąd przy aktualizacji statusu:", error);
        }
    };

    const getRowBackgroundColor = (status) => {
        switch (status) {
            case "APPROVED":
                return "#93e4c1";
            case "REJECTED":
                return "#ff5252";
            default:
                return "#ffffff";
        }
    };

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f0f4c3", margin: 0, padding: 0 }}>
            <AppBar position="static" sx={{ marginBottom: 4, backgroundColor: "#ff5252" }}>
                <Toolbar
                    sx={{
                        maxWidth: "1500px",
                        width: "100%",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{ cursor: "pointer" }} onClick={handleHome}>
                        <img src="/rosaryIco.png" style={{ width: 50, height: 50, marginRight: 8 }} />
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            flexGrow: 1,
                            cursor: "pointer",
                            mr: 2,
                            display: { xs: "none", md: "flex" },
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
                        <Button color="inherit" component={Link} to="/zelator" sx={{ mr: 2 }}>
                            Pulpit Zelatora
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Wyloguj się
                            <LogoutIcon sx={{ fontSize: 40, marginLeft: 1 }} />
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
                <h1>Prośby o zamówienie Mszy Świętych</h1>

                {massRequests ? (
                    <TableContainer component={Paper} sx={{ width: "100%", marginTop: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Autor</TableCell>
                                    <TableCell>Intencja</TableCell>
                                    <TableCell>Data prośby</TableCell>
                                    <TableCell>Data Mszy</TableCell>
                                    <TableCell>Akcje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {massRequests.map((request) => (
                                    <TableRow
                                        key={request.id}
                                        sx={{
                                            backgroundColor: getRowBackgroundColor(request.status),
                                        }}
                                    >
                                        <TableCell>
                                            {request.user.firstName} {request.user.lastName}
                                        </TableCell>
                                        <TableCell>{request.intention}</TableCell>
                                        <TableCell>
                                            {new Date(request.requestDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {request.massDate
                                                ? new Date(request.massDate).toLocaleDateString()
                                                : "Nie ustalono"}
                                        </TableCell>
                                        <TableCell>
                                            {request.status === "PENDING" && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        sx={{ mr: 1 }}
                                                        onClick={() => updateRequestStatus(request.id, "APPROVED")}
                                                    >
                                                        Zaakceptuj
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => updateRequestStatus(request.id, "REJECTED")}
                                                    >
                                                        Odrzuć
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" sx={{ marginTop: 4 }}>
                        Brak próśb o zamówienie Mszy Świętych.
                    </Typography>
                )}
            </Box>

            <footer
                style={{
                    backgroundColor: "#ff5252",
                    color: "#fff",
                    textAlign: "center",
                    padding: "10px 0",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    marginTop: "auto",
                }}
            >
                <Typography variant="body2">&copy; 2025 Zelator. Wszystkie prawa zastrzeżone.</Typography>
            </footer>
        </div>
    );
}

export default Masses;