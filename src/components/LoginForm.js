import React, {useState} from "react";
import axios from 'axios'


function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:9002/login', {
                email,
                password
            });

            console.log('Odpowiedz z backendu: ', response.data);
        } catch (error) {
            console.error('Błąd logowania: ', error);
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>Logowanie</h2>
            <div>
                <label htmlFor={email}>E-mail:</label>
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
    )

}

export default LoginForm;