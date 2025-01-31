import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Badge,
    Tooltip,
    Avatar,
    DialogTitle,
    DialogContent,
    Dialog
} from "@mui/material";
import {Link} from 'react-router-dom';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AppBar, Toolbar} from "@mui/material";
import {useUser} from "../context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';
import {NotificationsActive} from "@mui/icons-material";


const DashboardZelator = () => {
    const [user, setUser] = useState(useUser);
    const [areUnread, setAreUnread] = useState(false);
    const [areRequests, setAreRequests] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [intention, setIntention] = useState(null);
    const [mystery, setMystery] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [nextEvent, setNextEvent] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchNoti = async () => {
            try {
                const response = await axios.get('http://localhost:9002/chat/notifications',
                    {withCredentials: true});

                setNotifications(response.data);

                const unread = response.data.some(notification => !notification.isRead);
                setHasUnreadNotifications(unread);
            } catch (error) {
                console.error("Blad wczytywania notyfikacji");
            }
        };

        fetchNoti();

        const intervalId = setInterval(fetchNoti, 5000);

        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                const reponse = await axios.get('http://localhost:9002/calendar-events/next',
                    {withCredentials: true});

                setNextEvent(reponse.data);
            } catch (error) {
                console.error("Błąd: ", error.message);
            }
        };

        fetchNextEvent();

        const intervalId = setInterval(fetchNextEvent, 60000);

        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await axios.get("http://localhost:9002/members-status", {
                    withCredentials: true,
                });

                setGroupMembers(response.data);
            } catch (error) {
                console.error("Bład: ", error.message);
            }
        };

        fetchGroupMembers();
    }, []);


    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:9002/intention-mystery", {
                    withCredentials: true,
                });

                if(response.status === 200) {
                    const data = await response.data;
                    setIntention(data.intention?.title || "Brak przypisania do róży");
                    setMystery(data.mystery?.name || "Brak przypisanej tajemnicy");
                } else {
                    console.error("Bład podczas pobierania danych");
                }
            } catch (error) {
                console.error("Nieoczekiwany bład: ", error.message);
            }
        };
        
        fetchData();
    }, []);


    const formatDateTime = () => {
        const days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
        const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
        const day = days[currentTime.getDay()];
        const date = currentTime.getDate();
        const month = months[currentTime.getMonth()];
        const year = currentTime.getFullYear();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');

        return `${day}, ${date} ${month} ${year} - ${hours}:${minutes}`;
    };


    useEffect(() => {
        const fetchAreUnread = async () => {
            try {
                const response = await axios.get("http://localhost:9002/chat/are-unread", {
                    withCredentials: true,
                });

                setAreUnread(response.data);
            } catch (error) {
                console.error("Nie udało się pobrać nieprzeczytanych");
            }
        };

        const intervalId = setInterval(fetchAreUnread, 3000);

        return () => clearInterval(intervalId);
    })


    useEffect(() => {
        const fetchAreRequests = async () => {
            try {
                const response = await axios.get("http://localhost:9002/mass-request/are-unchecked", {
                    withCredentials: true,
                });
                
                setAreRequests(response.data);
            } catch (error) {
                console.error("Nie udało się pobrać requestów");
            }
        };

        const intervalId = setInterval(fetchAreRequests, 3000);

        return () => clearInterval(intervalId);
    }, []);


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


    const handleReminder = (memberId) => {
        if(window.confirm("Czy chcesz wysłać przypomnienie o modlitwie?")) {
            sendReminder(memberId);
        }
    };


    const sendReminder = async (memberId) => {
        try {
            await axios.post(`http://localhost:9002/chat/notifications/reminder/${memberId}`,
                {},
                {withCredentials: true});

            alert("Przypomnienie wysłane!");
        } catch(error) {
            console.error("Bład wysyłania przypomnienia:", error);
            alert("Nie udało się wysłać przypomnienia.");
        }
    }

    const handleNotificationClick = async () => {
        try {
            await axios.post('http://localhost:9002/chat/read-notifications', {}, {
                withCredentials: true,
            });

            setHasUnreadNotifications(false);
            setOpenDialog(true);
        } catch (error) {
            console.error("Błąd podczas oznaczania powiadomień jako przeczytane");
        }
    };


    return (
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
                marginRight: 'auto',
                marginBottom: '2',
            }}>
                <Typography variant="h4" gutterBottom>
                    Pulpit Zelatora
                </Typography>

                <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasUnreadNotifications} // Kropka jest widoczna tylko, jeśli są nieprzeczytane powiadomienia
                    sx={{ cursor: 'pointer' }}
                    onClick={handleNotificationClick}
                >
                    <NotificationsActive sx={{ fontSize: 40 }} />
                </Badge>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Powiadomienia</DialogTitle>
                    <DialogContent>
                        {notifications.map((notification, index) => (
                            <Typography key={index}>
                                {notification.message}
                            </Typography>
                        ))}
                    </DialogContent>
                </Dialog>

                <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3, marginBottom: 3 }}>
                    <Typography variant="h6"><strong>Obecna data i godzina:</strong> {formatDateTime(currentTime)}</Typography>
                    <Typography variant="h6"><strong>Zalogowano jako:</strong> {user.user.firstName} {user.user.lastName} ({user.user.email})</Typography>
                    <Typography variant="h6"><strong>Dzisiejsza intencja:</strong> {intention}</Typography>
                    <Typography variant="h6"><strong>Twoja tajemnica:</strong> {mystery}</Typography>

                    {nextEvent ? (
                        <>
                            <Typography variant="h6"><strong>Najbliższe wydarzenie:</strong></Typography>
                            <Typography variant="body1"><strong>Tytuł:</strong> {nextEvent.title}</Typography>
                            <Typography variant="body1"><strong>Data:</strong> {new Date(nextEvent.eventDate).toLocaleString()}</Typography>
                        </>
                    ) : (
                        <Typography variant="h6">Brak nadchodzących wydarzeń</Typography>
                    )}

                </Paper>

                {user.user.group && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "relative", // Potrzebne do ustawienia róż wokół środka
                            height: 250, // Wysokość kontenera
                            width: 250, // Szerokość kontenera
                            margin: "0 auto",
                            mt: 3,
                            mb: 5, // Dodaje odstęp od kafelków
                        }}
                    >
                        {groupMembers.map((member, index) => {
                            const angle = (index / groupMembers.length) * 2 * Math.PI; // Obliczenie kąta dla każdej róży
                            const radius = 100; // Promień okręgu
                            const x = radius * Math.cos(angle); // Współrzędna X
                            const y = radius * Math.sin(angle); // Współrzędna Y

                            return (
                                <Tooltip key={member.id} title={`${member.firstName} ${member.lastName}`} arrow>
                                    <Avatar
                                        sx={{
                                            bgcolor: member.status ? "#ff5252" : "black",
                                            width: 40,
                                            height: 40,
                                            cursor: (member.id === user.user.id || member.status) ? "default" : "pointer",
                                            position: "absolute",
                                            left: `calc(50% + ${x}px - 20px)`, // Ustawienie środka na podstawie pozycji X
                                            top: `calc(50% + ${y}px - 20px)`, // Ustawienie środka na podstawie pozycji Y
                                            transition: "transform 0.2s ease-in-out",
                                            "&:hover": {
                                                transform: (member.id !== user.user.id && !member.status) ? "scale(1.1)" : "none",
                                            },
                                        }}
                                        onClick={() =>
                                            (member.id !== user.user.id && !member.status) && handleReminder(member.id)
                                        }
                                    >
                                        🌹
                                    </Avatar>
                                </Tooltip>
                            );
                        })}
                    </Box>
                )}

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

                    {!user.user.group && (
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
                    )}

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

                    {user.user.group && (
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
                    )}

                    {user.user.group && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Kalendarz
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    component={Link}
                                    to="/calendar"
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
                                    Zobacz wydarzenia
                                </Button>
                            </Paper>
                        </Grid>
                    )}

                    {user.user.group && (
                        <Grid item xs={12} md={6}>
                            <Badge
                                color="error"
                                variant="dot"
                                overlap="rectangular"
                                invisible={!areUnread}
                                sx={{ width: "100%" }}
                            >
                                <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3, width: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Chat
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        component={Link}
                                        to="/chat"
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
                                        Przeglądaj konwersacje
                                    </Button>
                                </Paper>
                            </Badge>
                        </Grid>
                    )}

                    {user.user.role === 'MainZelator' && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Zarządzanie Zelatorami
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    component={Link}
                                    to="/create-zelator"
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
                                    Dodaj Zelatora
                                </Button>
                            </Paper>
                        </Grid>
                    )}

                    {user.user.group && (
                        <Grid item xs={12} md={6}>
                            <Badge
                                color="error"
                                variant="dot"
                                overlap="rectangular"
                                invisible={!areRequests}
                                sx={{ width: "100%" }}
                            >
                            <Paper sx={{ padding: 3, borderRadius: '8px', boxShadow: 3, width: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Msze Święte
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    component={Link}
                                    to="/masses"
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
                                    Zobacz prośby
                                </Button>
                            </Paper>
                            </Badge>
                        </Grid>
                    )}


                </Grid>
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

export default DashboardZelator;