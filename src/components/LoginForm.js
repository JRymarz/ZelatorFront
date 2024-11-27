import React, {useState} from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');

        const loginData = {
            email,
            password
        }

        try {
            const response = axios.post('http://localhost:9002/login', loginData);

            console.log(response)
            console.log('przed ifem')
            if(response.status === 200){
                console.log('Wnetrze ifa')
                navigate("/loginSuccess");
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Logowanie się nie powiodło.');
            }
        } catch (error) {
            setError('Niespodziewany błąd');
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