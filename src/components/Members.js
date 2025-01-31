import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AppBar, Toolbar, Typography, Button, Box, TextField, CircularProgress} from "@mui/material";
import {useUser} from "../context/UserContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { FormControlLabel, Switch } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";


function Members() {
    const [members, setMembers] = useState([]);
    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        hasGroup: "",
        groupId: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [userGroup, setUserGroup] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:9002/current-user", {withCredentials: true});
            if(response.data.group) {
                setUserGroup(response.data.group);
            }
        } catch (error) {
            console.log("Błąd pobierania danych użytkownika");
        }
    }, []);

    const fetchMembers =  useCallback(async (page = 0) => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                ...filters,
                page,
                size: 10,
            };
            const response = await axios.get("http://localhost:9002/members", {
                params,
                withCredentials: true,
            });

            console.log(response.data);

            setMembers(response.data.content);
            setCurrentPage(response.data.pageable.pageNumber);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setError("Nie udało się pobrać użystkowników.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchUserData()
        fetchMembers();
    }, [filters, fetchUserData, fetchMembers]);

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };

    const handlePageChange = (page) => {
        if(page >= 0 && page < totalPages) {
            fetchMembers(page);
        }
    };


    const assignToGroup = async (memberId) => {
        if(!userGroup) {
            navigate("/create-group");
        } else {
            try {
                console.log(userGroup.id);
                await axios.patch(`http://localhost:9002/members/${memberId}/assign`,
                    userGroup.id,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                alert("Użytkownik został przypisany do twojej róży.");
                fetchMembers(currentPage);
            } catch (error) {
                alert("Nie udało się przypisać użytkownika.");
            }
        }
    };


    const [user, setUser] = useState(useUser);

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
                </Toolbar>
            </AppBar>

            <Box sx={{
                padding: 2,
                textAlign: 'center',
                marginBottom: 4,
                borderRadius: '8px',
                backgroundColor: '#f9fbe7',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <h1>Lista użytkowników</h1>

                <Box sx={{marginBottom: 3}}>
                    <TextField
                        label="Imię"
                        variant="outlined"
                        name="firstName"
                        value={filters.firstName}
                        onChange={handleFilterChange}
                        sx={{marginBottom: 2}}
                    />
                    <TextField
                        label="Nazwisko"
                        variant="outlined"
                        name="lastName"
                        value={filters.lastName}
                        onChange={handleFilterChange}
                        sx={{marginBottom: 2}}
                    />
                    <TextField
                        label="Grupa"
                        variant="outlined"
                        name="groupId"
                        value={filters.groupId}
                        onChange={handleFilterChange}
                        sx={{marginBottom: 2}}
                    />
                    <Box sx={{marginBottom: 2}}>
                        {/*<label>Ma grupę?</label>*/}
                        {/*<select*/}
                        {/*    name="hasGroup"*/}
                        {/*    value={filters.hasGroup}*/}
                        {/*    onChange={handleFilterChange}*/}
                        {/*>*/}
                        {/*    <option value="">Wszyscy</option>*/}
                        {/*    <option value="true">Tak</option>*/}
                        {/*    <option value="false">Nie</option>*/}
                        {/*</select>*/}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={filters.hasGroup === "true"}
                                    onChange={(e) => handleFilterChange({
                                        target: {
                                            name: "hasGroup",
                                            value: e.target.checked ? "true" : "false"
                                        }
                                    })}
                                    name="hasGroup"
                                    color="error"
                                />
                            }
                            label="Czy należy do róży?"
                            sx={{marginBottom: 2}}
                        />
                    </Box>
                    <Button variant="contained" color="error" onClick={() => fetchMembers(1)}>
                        Filtruj
                    </Button>
                </Box>

                {loading ? (
                    <CircularProgress/>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        {/*<table style={{ width: '100%', marginTop: 4 }}>*/}
                        {/*    <thead>*/}
                        {/*    <tr>*/}
                        {/*        <th>Imię</th>*/}
                        {/*        <th>Nazwisko</th>*/}
                        {/*        <th>Email</th>*/}
                        {/*        <th>Róża</th>*/}
                        {/*        <th>Akcja</th>*/}
                        {/*    </tr>*/}
                        {/*    </thead>*/}
                        {/*    <tbody>*/}
                        {/*    {members.map((member) => (*/}
                        {/*        <tr key={member.id}>*/}
                        {/*            <td>{member.firstName}</td>*/}
                        {/*            <td>{member.lastName}</td>*/}
                        {/*            <td>{member.email}</td>*/}
                        {/*            <td>{member.group ? member.group.name : "Brak przypisania do róży"}</td>*/}
                        {/*            <td>*/}
                        {/*                {!member.group ? (*/}
                        {/*                    <Button variant="contained" color="error" onClick={() => assignToGroup(member.id)}>*/}
                        {/*                        Przypisz do mojej róży*/}
                        {/*                    </Button>*/}
                        {/*                ) : null}*/}
                        {/*            </td>*/}
                        {/*        </tr>*/}
                        {/*    ))}*/}
                        {/*    </tbody>*/}
                        {/*</table>*/}
                        <TableContainer component={Paper} sx={{width: '100%', marginTop: 4}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imię</TableCell>
                                        <TableCell>Nazwisko</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Róża</TableCell>
                                        <TableCell>Akcja</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {members.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>{member.firstName}</TableCell>
                                            <TableCell>{member.lastName}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>{member.group ? member.group.name : "Brak przypisania do róży"}</TableCell>
                                            <TableCell>
                                                {!member.group ? (
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => assignToGroup(member.id)}
                                                    >
                                                        Przypisz do mojej róży
                                                    </Button>
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{marginTop: 3}}>
                            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 0}>
                                Poprzednia
                            </Button>
                            <span> Strona {currentPage + 1} z {totalPages} </span>
                            <Button onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}>
                                Następna
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
            {/*<form>*/}
            {/*    <label>*/}
            {/*        Imię:*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="firstName"*/}
            {/*            value={filters.firstName}*/}
            {/*            onChange={handleFilterChange}*/}
            {/*        />*/}
            {/*    </label>*/}
            {/*    <label>*/}
            {/*        Nazwisko:*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="lastName"*/}
            {/*            value={filters.lastName}*/}
            {/*            onChange={handleFilterChange}*/}
            {/*        />*/}
            {/*    </label>*/}
            {/*    <label>*/}
            {/*        Ma grupę?*/}
            {/*        <select*/}
            {/*            name="hasGroup"*/}
            {/*            value={filters.hasGroup}*/}
            {/*            onChange={handleFilterChange}*/}
            {/*        >*/}
            {/*            <option value="">Wszyscy</option>*/}
            {/*            <option value="true">Tak</option>*/}
            {/*            <option value="false">Nie</option>*/}
            {/*        </select>*/}
            {/*    </label>*/}
            {/*    <label>*/}
            {/*        Grupa:*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="groupId"*/}
            {/*            value={filters.groupId}*/}
            {/*            onChange={handleFilterChange}*/}
            {/*        />*/}
            {/*    </label>*/}
            {/*    <button*/}
            {/*        type="button"*/}
            {/*        onClick={() => fetchMembers(1)}*/}
            {/*    >*/}
            {/*        Filtruj*/}
            {/*    </button>*/}
            {/*</form>*/}

            {/*{loading? (*/}
            {/*    <p>Ładowanie...</p>*/}
            {/*) : error ? (*/}
            {/*    <p>{error}</p>*/}
            {/*) : (*/}
            {/*    <>*/}
            {/*        <table>*/}
            {/*            <thead>*/}
            {/*                <tr>*/}
            {/*                    <th>Imię</th>*/}
            {/*                    <th>Nazwisko</th>*/}
            {/*                    <th>Email</th>*/}
            {/*                    <th>Róża</th>*/}
            {/*                    <th>Akcja</th>*/}
            {/*                </tr>*/}
            {/*            </thead>*/}
            {/*            <tbody>*/}
            {/*            {members.map((member) => (*/}
            {/*                <tr key={member.id}>*/}
            {/*                    <td>{member.firstName}</td>*/}
            {/*                    <td>{member.lastName}</td>*/}
            {/*                    <td>{member.email}</td>*/}
            {/*                    <td>{member.group ? member.group.name : "Brak przypisania do róży"}</td>*/}
            {/*                    <td>*/}
            {/*                        {!member.group ? (*/}
            {/*                            <button onClick={() => assignToGroup(member.id)}>*/}
            {/*                                Przypisz do mojej róży*/}
            {/*                            </button>*/}
            {/*                        ) : null}*/}
            {/*                    </td>*/}
            {/*                </tr>*/}
            {/*            ))}*/}
            {/*            </tbody>*/}
            {/*        </table>*/}

            {/*        <div>*/}
            {/*            <button onClick={() => handlePageChange(currentPage - 1)}>Poprzednia</button>*/}
            {/*            <span>*/}
            {/*                Strona {currentPage + 1} z {totalPages}*/}
            {/*            </span>*/}
            {/*            <button onClick={() => handlePageChange(currentPage + 1)}>Następna</button>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}

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

}

export default Members;