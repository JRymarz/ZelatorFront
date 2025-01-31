import React, {useState, useEffect} from "react";
import axios from "axios";
import {useUser} from "../context/UserContext";
import {Link, useNavigate} from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Button,
    Box
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';


const PlanMysteryChange = () => {
    const {user} = useUser();
    const [intentions, setIntentions] = useState([]);
    const [members, setMembers] = useState([]);
    const [mysteries, setMysteries] = useState([]);
    const [currentGroupIntention, setCurrentGroupIntention] = useState(null);
    const [intentionId, setIntentionId] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [autoAssign, setAutoAssign] = useState(false);
    const [memberMysteries, setMemberMysteries] = useState({});

    const [loggedUser, setLoggedUser] = useState(useUser());
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:9002/intentions", {withCredentials: true})
            .then(response => {
                console.log(response.data)
                setIntentions(Array.isArray(response.data) ? response.data : []);
                // setIntentions(response.data);
        })
            .catch(error => {
                console.log("Błąd przy pobieraniu intencji:", error);
            });

        if(user && user.group) {
            axios.get("http://localhost:9002/my-rose", {withCredentials: true})
                .then(response => {
                    setMembers(response.data.members);
                    setCurrentGroupIntention(response.data.intention);
                })
                .catch(error => {
                    console.log("Błąd przy pobieraniu członków grupy:", error);
                });
        }

        axios.get("http://localhost:9002/mysteries", {withCredentials: true})
            .then(response => {
                setMysteries(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.log("Bład przy pobieraniu tajemnic:", error);
            });
    }, [user, memberMysteries]);


    const handleMysteryChange = (memberId, mysteryId) => {
        setMemberMysteries((prevState) => {
            const updatedState = {
                ...prevState,
                [memberId]: mysteryId,
            };

            Object.entries(updatedState).forEach(([id, assingedMystery]) => {
                if(id !== String(memberId) && assingedMystery === mysteryId) {
                    updatedState[id] = "";
                }
            });

            return updatedState;
        });
    };

    const getAvailableMysteries = (memberId) => {
        const assignedMysteries = Object.entries(memberMysteries)
            .filter(([id]) => id !== String(memberId))
            .map(([, mysteryId]) => mysteryId);

        return mysteries.filter(
            (mystery) =>
                !assignedMysteries.includes(mystery.id) &&
                mystery.id !== members.find((member) => member.id === memberId)?.mystery.id
        )
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if(!user || !user.group) {
            alert("Zelator nie zarządza żadną grupą.");
            return;
        }

        const payload = {
            groupId: user.group.id,
            intentionId,
            eventDate,
            autoAssign,
            memberMysteries: autoAssign ? null : memberMysteries,
        };

        axios.post("http://localhost:9002/mystery-change/plan",
            payload, {
            withCredentials: true
            })
            .then(response => {
                alert("Zmiana tajemnic została zaplanowana");
            })
            .catch(error => {
                alert("Błąd podczas planowania zmiany tajemnic");
            });
    };

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
    }, []);


    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:9002/logout", {}, {withCredentials: true});
            console.log(response.data);

            setLoggedUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Blad przy wylogowywaniu", error);
            navigate('/login');
        }
    };

    const handleHome = () => {
        navigate('/');
    };


    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f0f4c3", display: "flex", flexDirection: "column" }}>

            {/* Navbar */}
            <AppBar position="static" sx={{ marginBottom: 4, backgroundColor: "#ff5252" }}>
                <Toolbar sx={{ maxWidth: "1500px", width: "100%", margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                        <img src="/rosaryIco.png" style={{ width: 50, height: 50, marginRight: 8 }} alt="logo" />
                    </Typography>
                    <Typography variant="h4" sx={{
                        flexGrow: 1, cursor: "pointer",
                        fontFamily: "monospace",
                        fontWeight: 300,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none"
                    }} onClick={() => navigate("/")}>
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

                    {/*<Button color="inherit" onClick={() => console.log("Wyloguj")}>*/}
                    {/*    Wyloguj się*/}
                    {/*    <LogoutIcon sx={{ fontSize: 40, marginLeft: 1 }} />*/}
                    {/*</Button>*/}
                </Toolbar>
            </AppBar>

            {/* Formularz */}
            <Container maxWidth="md">
                <Paper sx={{ padding: 4, borderRadius: "8px", boxShadow: 3 }}>
                    <Typography variant="h5" gutterBottom align="center">
                        Zaplanuj zmianę tajemnic
                    </Typography>
                    <form onSubmit={handleSubmit}>

                        {/* Wybór intencji */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Intencja</InputLabel>
                            <Select value={intentionId} onChange={(e) => setIntentionId(e.target.value)} required>
                                <MenuItem value="">Wybierz intencję</MenuItem>
                                {intentions
                                    .filter((intention) => intention.id !== currentGroupIntention?.id)
                                    .map((intention) => (
                                        <MenuItem key={intention.id} value={intention.id}>
                                            {intention.title}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        {/* Wybór daty i godziny */}
                        <FormControl fullWidth margin="normal">
                            <Typography variant="body1" gutterBottom>Data i godzina</Typography>
                            <input
                                type="datetime-local"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    fontSize: "16px"
                                }}
                            />
                        </FormControl>

                        {/* Checkbox automatycznego przypisania */}
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={autoAssign} onChange={(e) => setAutoAssign(e.target.checked)} />}
                                label="Automatyczne przypisanie tajemnic"
                            />
                        </FormGroup>

                        {/* Przypisanie tajemnic dla członków */}
                        {!autoAssign && (
                            <Box sx={{ marginTop: 2 }}>
                                <Typography variant="h6">Przypisanie tajemnic dla członków grupy:</Typography>
                                {members.map((member) => (
                                    <FormControl key={member.id} fullWidth margin="normal">
                                        <InputLabel>{member.firstName} {member.lastName}</InputLabel>
                                        <Select
                                            value={memberMysteries[member.id] || ""}
                                            onChange={(e) => handleMysteryChange(member.id, e.target.value)}
                                            required
                                        >
                                            <MenuItem value="">Wybierz tajemnicę</MenuItem>
                                            {getAvailableMysteries(member.id).map((mystery) => (
                                                <MenuItem key={mystery.id} value={mystery.id}>
                                                    {mystery.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ))}
                            </Box>
                        )}

                        {/* Przycisk submit */}
                        <Box sx={{ marginTop: 3, textAlign: "center" }}>
                            <Button variant="contained" color="error" type="submit" sx={{ marginRight: 2 }}>
                                Zaplanuj zmianę
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => navigate("/")}>
                                Anuluj
                            </Button>
                        </Box>

                    </form>
                </Paper>
            </Container>

            {/* Stopka */}
            <footer style={{
                backgroundColor: "#ff5252",
                color: "#fff",
                textAlign: "center",
                padding: "10px 0",
                width: "100%",
                marginTop: "auto",
            }}>
                <Typography variant="body2">
                    &copy; 2025 Zelator. Autor: Jakub Rymarz.
                </Typography>
            </footer>
        </div>
    );


    // return(
    //     <form onSubmit={handleSubmit}>
    //         <div>
    //             <label>Intencja:</label>
    //             <select
    //                 value={intentionId}
    //                 onChange={(e) => setIntentionId(e.target.value)}
    //                 required
    //             >
    //                 <option value="">Wybierz intencję</option>
    //                 {intentions
    //                     .filter((intention) => intention.id !== currentGroupIntention?.id)
    //                     .map((intention) => (
    //                     <option key={intention.id} value={intention.id}>
    //                         {intention.title}
    //                     </option>
    //                 ))}
    //             </select>
    //         </div>
    //
    //         <div>
    //             <label>Data i godzina:</label>
    //             <input
    //                 type="datetime-local"
    //                 value={eventDate}
    //                 onChange={(e) => setEventDate(e.target.value)}
    //                 required
    //             />
    //         </div>
    //
    //         <div>
    //             <label>
    //                 <input
    //                     type="checkbox"
    //                     checked={autoAssign}
    //                     onChange={(e) => setAutoAssign(e.target.checked)}
    //                 />
    //                 Automatyczne przypisanie tajemnic
    //             </label>
    //         </div>
    //
    //         {!autoAssign && (
    //             <div>
    //                 <h3>Przypisanie tajemnic dla członków grupy:</h3>
    //                 {members.map((member) => (
    //                     <div key={member.id}>
    //                         <label>{member.firstName} {member.lastName}:</label>
    //                         <select
    //                             value={memberMysteries[member.id] || ""}
    //                             onChange={(e) => handleMysteryChange(member.id, e.target.value)}
    //                             required
    //                         >
    //                             <option value="">Wybierz tajemnicę</option>
    //                             {getAvailableMysteries(member.id).map(
    //                                 (mystery) => (
    //                                     <option
    //                                         key={mystery.id}
    //                                         value={mystery.id}
    //                                     >
    //                                         {mystery.name}
    //                                     </option>
    //                                 )
    //                             )}
    //                         </select>
    //                     </div>
    //                 ))}
    //             </div>
    //         )}
    //
    //         <button type="submit">Zaplanuj zmianę tajemnic</button>
    //     </form>
    // );

};

export default PlanMysteryChange;