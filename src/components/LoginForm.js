import React, {useState} from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:9002/auth/login", {
                email,
                password,
            });

            if(response.status === 200) {
                navigate('/');
            }
        } catch (error) {
            setError("Invalid credentails");
        }

        // e.preventDefault();
        //
        // const formData = new URLSearchParams();
        // formData.append('username', email);
        // formData.append('password', password);
        //
        // try {
        //     const response = await axios.post('http://localhost:9002/login', formData, {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //         },
        //         withCredentials: true,
        //     });
        //
        //     // console.log('Odpowiedz z backendu: ', response.data);
        //     if(response.status === 200){
        //         navigate('/')
        //     }
        // } catch (error) {
        //     console.error('Błąd logowania: ', error);
        // }
    };

    return(
        <div>
        <form onSubmit={handleSubmit}>
            <h2>Logowanie</h2>
            <div>
                <label htmlFor="email">E-mail:</label>
                <input
                    type="email"
                    // id="email"
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
                    // id="password"
                    value={password}
                    placeholder="hasło"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Zaloguj</button>
        </form>
        {error} && <p>{error}</p>
        </div>
    )

}

export default LoginForm;