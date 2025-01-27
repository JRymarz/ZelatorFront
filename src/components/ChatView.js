import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";

const ChatView = () => {
    const { type, id } = useParams(); // `type` może być "group" lub "user"
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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
            console.log(response.data);
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
        } catch (err) {
            console.error("Nie udało się wysłać wiadomości", err);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <p>{error}</p>;

    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ maxHeight: "70vh", overflowY: "auto", marginBottom: 2 }}>
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            marginBottom: 1,
                            display: "flex",
                            justifyContent: msg.sender ? "flex-end" : "flex-start",
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                backgroundColor: msg.sender ? "#d1ffd6" : "#f1f1f1",
                                padding: 1,
                                borderRadius: 2,
                                maxWidth: "70%",
                            }}
                        >
                            {msg.message}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
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
        </Box>
    );
};

export default ChatView;