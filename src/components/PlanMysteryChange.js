import React, {useState, useEffect} from "react";
import axios from "axios";
import {useUser} from "../context/UserContext";


const PlanMysteryChange = () => {
    const {user} = useUser();
    const [intentions, setIntentions] = useState([]);
    const [intentionId, setIntentionId] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [autoAssign, setAutoAssign] = useState(false);

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
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        if(!user || !user.group) {
            alert("Zelator nie zarządza żadną grupą.");
            return;
        }

        axios.post("http://localhost:9002/mystery-change/plan",
            {
                groupId: user.group.id,
                intentionId,
                eventDate,
                autoAssign
            }, {
            withCredentials: true
            })
            .then(response => {
                alert("Zmiana tajemnic została zaplanowana");
            })
            .catch(error => {
                alert("Błąd podczas planowania zmiany tajemnic");
            });
    };


    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label>Intencja:</label>
                <select
                    value={intentionId}
                    onChange={(e) => setIntentionId(e.target.value)}
                    required
                >
                    <option value="">Wybierz intencję</option>
                    {intentions.map((intention) => (
                        <option key={intention.id} value={intention.id}>
                            {intention.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Data i godzina:</label>
                <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={autoAssign}
                        onChange={(e) => setAutoAssign(e.target.checked)}
                    />
                    Automatyczne przypisanie tajemnic
                </label>
            </div>

            <button type="submit">Zaplanuj zmianę tajemnic</button>
        </form>
    )

}

export default PlanMysteryChange;