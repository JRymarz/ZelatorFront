import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {Box, Typography, TextField, Button, CircularProgress, Paper, Toolbar, AppBar} from "@mui/material";
import {useUser} from "../context/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";
import {useNavigate} from "react-router-dom";

const ChatView = () => {
    const { type, id } = useParams(); // `type` może być "group" lub "user"
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [user, setUser] = useState(useUser());

    const myUser = useUser();
    const currentUserId = myUser.user.id;

    const navigate = useNavigate();


    const markMessagesAsRead = async () => {
        try {
            await axios.patch(
                "http://localhost:9002/chat/mark-as-read",
                null,
                {
                    params: type === "group" ? { groupId: id } : { receiverId: id },
                    withCredentials: true,
                }
            );
        } catch (err) {
            console.error("Nie udało się oznaczyć wiadomości jako przeczytane", err);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get("http://localhost:9002/chat/conversation", {
                params: type === "group" ? { groupId: id } : { userId: id },
                withCredentials: true,
            });
            setMessages(response.data);
        } catch (err) {
            setError("Nie udało się pobrać wiadomości");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAndMarkMessages = async () => {
            await fetchMessages();
            await markMessagesAsRead();
        }

        fetchAndMarkMessages();

        const interval = setInterval(async () => {
            await fetchMessages();
            await markMessagesAsRead();

        }, 3000);

        return () => clearInterval(interval); // Czyszczenie interwału przy odmontowaniu
    }, [type, id]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                "http://localhost:9002/chat/send", // Endpoint do wysyłania wiadomości
                {
                    message: newMessage,
                    receiverId: type === "user" ? id : null,
                    groupId: type === "group" ? id : null,
                },
                { withCredentials: true }
            );

            setMessages((prev) => [...prev, response.data]); // Dodanie nowej wiadomości do listy
            setNewMessage("");
            setHasScrolled(false);
        } catch (err) {
            console.error("Nie udało się wysłać wiadomości", err);
        }
    };


    const formatDate = (timestamp) => {
        const date = new Date(timestamp);

        const padZero = (num) => (num < 10 ? `0${num}` : num);

        const day = padZero(date.getDate());
        const monthNames = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());

        return `${day} ${month} ${year}, ${hours}:${minutes}`;
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


    const [hasScrolled, setHasScrolled] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if(!hasScrolled && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setHasScrolled(true);
        }
    }, [messages]);


    if (loading)
        return (
            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    if (error) return <p>{error}</p>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#f0f4c3",
            }}
        >
            <AppBar position="static" sx={{backgroundColor: "#ff5252", marginBottom: 4}}>
                <Toolbar
                    sx={{
                        maxWidth: "1500px",
                        width: "100%",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{cursor: "pointer"}} onClick={() => navigate("/")}>
                        <img
                            src="/rosaryIco.png"
                            style={{width: 50, height: 50, marginRight: 8}}
                            alt="logo"
                        />
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            flexGrow: 1,
                            cursor: "pointer",
                            fontFamily: "monospace",
                            fontWeight: 300,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                        onClick={() => navigate("/")}
                    >
                        Zelator
                    </Typography>

                    <Box>
                        {/*{user?.role === "Zelator" && (*/}
                        <Button
                            color="inherit"
                            component={Link}
                            to="/zelator"
                            sx={{mr: 2}} // Opcjonalnie możesz dodać margines
                        >
                            Pulpit Zelatora
                        </Button>
                        {/*// )}*/}

                        <Button color="inherit" onClick={handleLogout}>
                            Wyloguj się
                            <LogoutIcon sx={{fontSize: 40, marginLeft: 1}}></LogoutIcon>
                        </Button>
                    </Box>
                    {/*<Button color="inherit" onClick={handleLogout}>*/}
                    {/*    Wyloguj się*/}
                    {/*    <LogoutIcon sx={{ fontSize: 40, marginLeft: 1 }} />*/}
                    {/*</Button>*/}
                </Toolbar>
            </AppBar>

            <Paper
                sx={{
                    maxWidth: "60%",
                    width: "60%",
                    margin: "0 auto",
                    padding: 2,
                    backgroundColor: "#f9fbe7",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    flexGrow: 1
                }}
            >
                <Typography variant="h5" sx={{textAlign: "center", marginBottom: 2}}>
                    Chat
                </Typography>

                {/* Lista wiadomości */}
                <Box
                    sx={{
                        maxHeight: "60vh",
                        width: "100%",
                        overflowY: "auto",
                        padding: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    {messages.map((msg) => {
                        const isMine = msg.senderId === currentUserId;
                        return (
                            <Box
                                key={msg.id}
                                sx={{
                                    display: "flex",
                                    justifyContent: isMine ? "flex-end" : "flex-start",
                                    alignItems: "flex-end"
                                }}
                            >
                                {!isMine && (
                                    <Typography
                                        variant="caption"
                                        sx={{marginRight: 1, color: "#666"}}
                                    >
                                        {msg.senderName}
                                    </Typography>
                                )}
                                <Box
                                    sx={{
                                        backgroundColor: isMine ? "#d1ffd6" : "#f1f1f1",
                                        padding: "10px",
                                        borderRadius: "12px",
                                        maxWidth: "65%",
                                        textAlign: "left",
                                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                                    }}
                                >
                                    <Typography variant="body1">{msg.message}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            marginTop: 1,
                                            fontSize: "0.8em",
                                            color: "#888",
                                            textAlign: "right"
                                        }}
                                    >
                                        {formatDate(msg.timeStamp)}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                    <div ref={messagesEndRef}></div>
                </Box>

                {/* Wysyłanie wiadomości */}
                <Box sx={{display: "flex", gap: 1, marginTop: 2}}>
                    <TextField
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Wpisz wiadomość"
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleSendMessage}>
                        Wyślij
                    </Button>
                </Box>
            </Paper>

            <footer
                style={{
                    backgroundColor: "#ff5252",
                    color: "#fff",
                    textAlign: "center",
                    padding: "10px 0",
                    marginTop: "auto",
                }}
            >
                <Typography variant="body2">
                    &copy; 2025 Zelator. Wszystkie prawa zastrzeżone.
                </Typography>
            </footer>
        </Box>
    );
};

export default ChatView;