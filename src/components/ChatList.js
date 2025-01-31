import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {
    Card,
    CardContent,
    Grid,
    Typography,
    CircularProgress,
    Box,
    Toolbar,
    AppBar,
    Button,
    Badge
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {useUser} from "../context/UserContext";

const ChatList = () => {
    const [conversations, setConversations] = useState([]);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unread, setUnread] = useState({unreadGroupConversation: false, unreadUserConversations: []});
    const navigate = useNavigate();
    const [user, setUser] = useState(useUser);


    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get("http://localhost:9002/chat/conversations", {
                    withCredentials: true,
                });
                setGroup(response.data.group);
                setConversations(response.data.members);
            } catch (err) {
                setError("Nie udało się pobrać danych");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);


    useEffect(() => {
        const fetchUnreadMessages = async () => {
            try {
                const response = await axios.get("http://localhost:9002/chat/unread-conversations", {
                    withCredentials: true,
                });
                
                setUnread(response.data);
            } catch (error) {
                console.error("Nie udało się pobrać nieprzeczytanych");
            }
        };

        const intervalId = setInterval(fetchUnreadMessages, 3000);

        return () => clearInterval(intervalId);
    }, []);


    const handleConversationClick = (conversation) => {
        const path = conversation.type === "group" ? `/chat/group/${conversation.id}` : `/chat/user/${conversation.id}`;
        navigate(path);
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


    if (loading)
        return (
            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    if (error) return <p>{error}</p>;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f0f4c3", margin: "0", padding: "0", display: "flex", flexDirection: "column" }}>
            <AppBar position="static" sx={{ backgroundColor: "#ff5252", marginBottom: 4 }}>
                <Toolbar
                    sx={{
                        maxWidth: "1500px",
                        width: "100%",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                        <img
                            src="/rosaryIco.png"
                            style={{ width: 50, height: 50, marginRight: 8 }}
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
                    {/*<Button color="inherit" onClick={handleLogout}>*/}
                    {/*    Wyloguj się*/}
                    {/*    <LogoutIcon sx={{ fontSize: 40, marginLeft: 1 }} />*/}
                    {/*</Button>*/}
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
                    Lista konwersacji
                </Typography>
                <Grid container spacing={3} alignItems="stretch">
                    {group && (
                        <Grid item xs={12}>
                            <Badge
                                color="error"
                                variant="dot"
                                overlap="rectangular"
                                invisible={!unread.unreadGroupConversation}
                                sx={{ width: "100%" }} // Dodajemy szerokość, aby nie zmieniało układu
                            >
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        height: "100%",
                                        width: "100%",
                                        cursor: "pointer",
                                        backgroundColor: unread.unreadGroupConversation ? "#ffebee" : "#fff",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                    }}
                                    onClick={() =>
                                        handleConversationClick({ type: "group", id: group.id })
                                    }
                                >
                                    <CardContent>
                                        <Typography variant="h6">{`${group.name}`}</Typography>
                                    </CardContent>
                                </Card>
                            </Badge>
                        </Grid>
                    )}

                    {conversations.map((conversation) => (
                        <Grid item xs={12} sm={6} md={4} key={conversation.id} sx={{ display: "flex" }}>
                            <Badge
                                color="error"
                                variant="dot"
                                overlap="rectangular"
                                invisible={!unread.unreadUserConversations.includes(conversation.id)}
                                sx={{ width: "100%" }} // Zapewnia pełne pokrycie
                            >
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        height: "100%",
                                        width: "100%",
                                        cursor: "pointer",
                                        backgroundColor: unread.unreadUserConversations.includes(conversation.id) ? "#ffebee" : "#fff",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "scale(1.05)" },
                                    }}
                                    onClick={() =>
                                        handleConversationClick({
                                            type: "user",
                                            id: conversation.id,
                                        })
                                    }
                                >
                                    <CardContent>
                                        <Typography variant="h6">
                                            {`${conversation.firstName} ${conversation.lastName}`}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Badge>
                        </Grid>
                    ))}
                </Grid>
            </Box>

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
                    &copy; 2025 Zelator. Autor: Jakub Rymarz.
                </Typography>
            </footer>
        </div>
    );
};

export default ChatList;