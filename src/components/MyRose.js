import React, {useEffect, useState} from "react";
import axios from "axios";
import {useUser} from "../context/UserContext";


function MyRose() {


    const [roseDetails, setRoseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableMysteries, setAvailableMysteries] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedMystery, setSelectedMystery] = useState(null);
    const {user, loading: userLoading} = useUser();

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


    const fetchAvailableMysteries = async (roseId) => {
        try {
            const response = await axios.get(`http://localhost:9002/roses/${roseId}/available-mysteries`,
                {withCredentials: true}
            );

            setAvailableMysteries(response.data);
        } catch (error) {
            alert("Nie udało się pobrać dostępnych tajemnic.");
        }
    };


    const handleAssignMystery = async (memberId) => {
        try {
            if(!selectedMystery) return alert("Wybierz tajemnicę.");
            await axios.patch(`http://localhost:9002/members/${memberId}/assign-mystery?mysteryId=${selectedMystery}`,
                null,
                {
                        withCredentials: true},
                );

            alert("Tajemnica została przypisana.");
            setSelectedMember(null);
            const response = await axios.get('http://localhost:9002/my-rose',
                {withCredentials: true},
                );

            setRoseDetails(response.data);
            setSelectedMember(null);
            setSelectedMystery(null);
        } catch (error) {
            alert("Nie udało się przypisać tajemnicy.");
        }
    };


    const handleRemoveMember = async (memberId) => {
        try {
            const confirmation = window.confirm("Czy na pewno chcesz usunąć tego członka z róży?");
            if(confirmation) {
                await axios.delete(`http://localhost:9002/members/${memberId}/remove`,
                    {withCredentials: true},
                );

                alert("Użytkownik został usunięty z róży.");
                const response = await axios.get("http://localhost:9002/my-rose",
                    {withCredentials: true},
                );

                setRoseDetails(response.data);
            }
        } catch (error) {
            alert("Nie udało się usunąć członka z róży.");
        }
    };


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
                        <th>Akcja</th>
                    </tr>
                </thead>
                <tbody>
                {roseDetails.members.map(member => (
                    <tr key={member.id}>
                        <td>{member.firstName}</td>
                        <td>{member.lastName}</td>
                        <td>{member.mystery?.name || "Nie przypisano tajemnicy"}</td>
                        <td>
                            {member.mystery.id === null && (
                                <button
                                    onClick={() => {
                                        setSelectedMember(member.id);
                                        fetchAvailableMysteries(roseDetails.id);
                                    }}
                                >
                                 Przypisz tajemnicę
                                </button>
                            )}
                            {user && user.id !== member.id && (
                                <button onClick={() => handleRemoveMember(member.id)}>
                                    Usuń członka
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedMember && (
                <div className="modal">
                    <h3>Przypisz tajemnicę</h3>
                    <select onChange={(e) => setSelectedMystery(e.target.value)} value={selectedMystery || ""}>
                        <option value="">Wybierz tajemnicę</option>
                        {availableMysteries.map((mystery) => (
                            <option key={mystery.id} value={mystery.id}>
                                {mystery.name}
                            </option>
                            ))}
                    </select>
                    <button onClick={() => handleAssignMystery(selectedMember)}>Przypisz</button>
                    <button onClick={() => setSelectedMember(null)}>Anuluj</button>
                </div>
            )}
        </div>
    );

}

export default MyRose;