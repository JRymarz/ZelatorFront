import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Grid, Typography, CircularProgress } from "@mui/material";

const ChatList = () => {
    const [conversations, setConversations] = useState([]);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const handleConversationClick = (conversation) => {
        const path = conversation.type === "group" ? `/chat/group/${conversation.id}` : `/chat/user/${conversation.id}`;
        navigate(path);
    };

    if (loading) return <CircularProgress />;
    if (error) return <p>{error}</p>;

    return (
        <Grid container spacing={3} sx={{ padding: 2 }}>
            {group && (
                <Grid item xs={12}>
                    <Card
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleConversationClick({ type: "group", id: group.id })}
                    >
                        <CardContent>
                            <Typography variant="h6">{`Grupowa: ${group.name}`}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {conversations.map((conversation) => (
                <Grid item xs={12} sm={6} md={4} key={conversation.id}>
                    <Card
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleConversationClick({ type: "user", id: conversation.id })}
                    >
                        <CardContent>
                            <Typography variant="h6">
                                {`${conversation.firstName} ${conversation.lastName}`}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ChatList;