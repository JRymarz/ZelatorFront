import React, {useEffect, useState} from "react";
import axios from "axios";


function MyRose() {


    const [roseDetails, setRoseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoseDetails = async () => {
            try {
                const response = await axios.get("http://localhost:9002/my-rose",
                    {withCredentials: true}
                );
                setRoseDetails(response.data);
                console.log(response.data)
            } catch (error) {
                setError("Nie udało się pobrać informacji o róży.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoseDetails();
    }, []);

    if(loading) return <p>Ładowanie...</p>;
    if(error) return <p>{error}</p>;

    return (
        <div>
            <h1>Moja róża</h1>
            <h2>{roseDetails.name}</h2>
            <p><strong>Obecna intencja:</strong> {roseDetails.intention.title}</p>
            <p>{roseDetails.intention.description}</p>
            <h3>Członkowie róży:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Tajemnica</th>
                    </tr>
                </thead>
                <tbody>
                {roseDetails.members.map(member => (
                    <tr key={member.id}>
                        <td>{member.firstName}</td>
                        <td>{member.lastName}</td>
                        <td>{member.mystery?.name || "Nie przypisano tajemnicy"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}

export default MyRose;