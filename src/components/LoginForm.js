import React, {useState} from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {useUser} from "../context/UserContext";


export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {setUser} = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');

        const loginData = {
            email,
            password
        }

        try {
            const response = await axios.post('http://localhost:9002/login', loginData, {withCredentials: true});

            console.log(response)
            console.log('przed ifem')

            const loggedUser = await axios.get("http://localhost:9002/current-user", {withCredentials: true})
            if(response.status === 200){
                console.log('Dane z backendu:', loggedUser.data)
                setUser(loggedUser.data);
                console.log("Ustawiony user: ", loggedUser.data);
                navigate("/");
            }
        } catch (error) {
            if(error.response) {
                setError(error.response.data || 'Logowanie nie powiodło się.');
            } else {
                setError('Niespodziewany błąd');
            }
        }
    }


    return(
        <div>
        <form onSubmit={handleLogin}>
            <h2>Logowanie</h2>
            <div>
                <label htmlFor="email">E-mail:</label>
                <input
                    type="email"
                     id="email"
                    value={email}
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Hasło:</label>
                <input
                    type="password"
                     id="password"
                    value={password}
                    placeholder="hasło"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Zaloguj</button>
        </form>
        {error}
        </div>
    )

}