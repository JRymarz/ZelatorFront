import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pl";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import {useUser} from "../context/UserContext";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    CircularProgress,
    Paper,
    Button, DialogActions, TextField, DialogContent, DialogTitle, Dialog,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {Link, useNavigate} from "react-router-dom";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", eventDate: "" });

    const loggedUser = useUser();
    const navigate = useNavigate();

    moment.locale("pl");

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const messages = {
        today: "Dzisiaj",
        previous: "Poprzedni",
        next: "Następny",
        month: "Miesiąc",
        week: "Tydzień",
        day: "Dzień",
        agenda: "Agenda",
        date: "Data",
        time: "Czas",
        event: "Wydarzenie",
        noEventsInRange: "Brak wydarzeń w tym zakresie dat.",
        showMore: (total) => `+${total} więcej`,
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:9002/calendar-events", {
                    withCredentials: true,
                });
                const transformedEvents = response.data.map((event) => ({
                    id: event.id,
                    title: event.eventType === "PRAYER"
                        ? `${event.title} - ${event.creatorName}`
                        : event.title,
                    start: new Date(event.eventDate),
                    end: new Date(event.eventDate), // Eventy jednoliniowe mają taką samą datę początku i końca
                    allDay: false,
                    eventType: event.eventType,
                    creatorFullName: event.creatorName,
                }));
                setEvents(transformedEvents);
            } catch (error) {
                setError("Nie udało się pobrać wydarzeń.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);


    const handleCreateEvent = async () => {
        try {
            await axios.post(
                "http://localhost:9002/calendar-events/create",
                { ...newEvent },
                { withCredentials: true }
            );
            setOpenDialog(false);
            setNewEvent({ title: "", eventDate: "" });

            // Odśwież wydarzenia
            const response = await axios.get("http://localhost:9002/calendar-events", {
                withCredentials: true,
            });
            const transformedEvents = response.data.map((event) => ({
                id: event.id,
                title: event.eventType === "PRAYER"
                    ? `${event.title} - ${event.creatorName}`
                    : event.title,
                start: new Date(event.eventDate),
                end: new Date(event.eventDate),
                allDay: false,
                eventType: event.eventType,
                creatorFullName: event.creatorName,
            }));
            setEvents(transformedEvents);
        } catch (error) {
            console.error("Nie udało się dodać wydarzenia:", error);
        }
    };


    const eventStyleGetter = (event) => {
        let backgroundColor = "#3174ad";

        switch (event.eventType) {
            case "MYSTERYCHANGE":
                backgroundColor = "#ff5252";
                break;
            case "MASS":
                backgroundColor = "#93e4c1";
                break;
            case "PRAYER":
                backgroundColor = "#ffc107";
                break;
            case "OTHER":
                backgroundColor = "#9c27b0";
                break;
            default:
                break;
        }

        return {
            style: {
                backgroundColor,
                color: "white",
                borderRadius: "8px",
                border: "none",
                padding: "2px",
            },
        };
    };

    const handleHome = () => navigate("/");
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:9002/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (error) {
            navigate("/login");
        }
    };


    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
    }, []);


    if (loading)
        return (
            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f0f4c3", margin: 0, display: "flex", flexDirection: "column" }}>
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

                    {/*<Box>*/}
                    {/*    <Button color="inherit" onClick={handleLogout}>*/}
                    {/*        Wyloguj się*/}
                    {/*        <LogoutIcon sx={{ fontSize: 40, marginLeft: 1 }}></LogoutIcon>*/}
                    {/*    </Button>*/}
                    {/*</Box>*/}
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: 2,
                    backgroundColor: "#f9fbe7",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
                    Kalendarz Wydarzeń
                </Typography>
                <Paper elevation={3}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                            Dodaj Wydarzenie
                        </Button>
                    </Box>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600, padding: 16 }}
                        eventPropGetter={eventStyleGetter}
                        messages={messages}
                    />
                </Paper>
            </Box>

            <footer
                style={{
                    backgroundColor: "#ff5252",
                    color: "#fff",
                    textAlign: "center",
                    padding: "10px 0",
                    // position: "absolute",
                    // bottom: 0,
                    width: "100%",
                    marginTop: 'auto',
                }}
            >
                <Typography variant="body2">
                    &copy; 2025 Zelator. Autor: Jakub Rymarz.
                </Typography>
            </footer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Dodaj Wydarzenie</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tytuł"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Data i godzina"
                        type="datetime-local"
                        value={newEvent.eventDate}
                        onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Anuluj
                    </Button>
                    <Button onClick={handleCreateEvent} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalendarView;