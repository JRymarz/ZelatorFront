import React, {useEffect, useState} from "react";
import axios from 'axios';
import axiosInstance from "../axiosConfig";

function HomePage() {
    const [email, setEmail] = useState('');

    useEffect(() => {
        axiosInstance.get('http://localhost:9002/', {withCredentials: false})
            .then(response => {
                setEmail(response.data);
            })
            .catch(error => {
                console.error("Problem z pobraniem usera:", error);
            });
    }, []);

    return (
        <div>
            <h1>Zelator</h1>
            <p>{email}</p>
        </div>
    );

}

export default HomePage;