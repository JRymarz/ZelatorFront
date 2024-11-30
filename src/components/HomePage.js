import React, {useEffect, useState} from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function HomePage() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrenttUser = async () => {
            try {
                const response = await axios.get("http://localhost:9002/", {withCredentials: true});
                console.log('Zalogowany user:', response.data);
                setUser(response.data);
            } catch (error) {
                console.error('Brak zalogowanego usera', error);
                setUser(null);
            }
        };

        fetchCurrenttUser();
    }, []);


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


    return (
        <div>
            <h1>Zelator</h1>
            {user ? (
                <>
                    <p><strong>E-mail:</strong> {user.email}</p>
                    <button onClick={handleLogout}>Wyloguj się</button>
                </>
            ) : (
                <p>Brak danych.</p>
            )}
        </div>
    );

}

export default HomePage;