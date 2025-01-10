import React, {useState, useEffect} from "react";
import axios from "axios";
import {useUser} from "../context/UserContext";


const PlanMysteryChange = () => {
    const {user} = useUser();
    const [intentions, setIntentions] = useState([]);
    const [members, setMembers] = useState([]);
    const [mysteries, setMysteries] = useState([]);
    const [currentGroupIntention, setCurrentGroupIntention] = useState(null);
    const [intentionId, setIntentionId] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [autoAssign, setAutoAssign] = useState(false);
    const [memberMysteries, setMemberMysteries] = useState({});

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

        if(user && user.group) {
            axios.get("http://localhost:9002/my-rose", {withCredentials: true})
                .then(response => {
                    setMembers(response.data.members);
                    setCurrentGroupIntention(response.data.intention);
                })
                .catch(error => {
                    console.log("Błąd przy pobieraniu członków grupy:", error);
                });
        }

        axios.get("http://localhost:9002/mysteries", {withCredentials: true})
            .then(response => {
                setMysteries(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.log("Bład przy pobieraniu tajemnic:", error);
            });
    }, [user, memberMysteries]);


    const handleMysteryChange = (memberId, mysteryId) => {
        setMemberMysteries((prevState) => {
            const updatedState = {
                ...prevState,
                [memberId]: mysteryId,
            };

            Object.entries(updatedState).forEach(([id, assingedMystery]) => {
                if(id !== String(memberId) && assingedMystery === mysteryId) {
                    updatedState[id] = "";
                }
            });

            return updatedState;
        });
    };

    const getAvailableMysteries = (memberId) => {
        const assignedMysteries = Object.entries(memberMysteries)
            .filter(([id]) => id !== String(memberId))
            .map(([, mysteryId]) => mysteryId);

        return mysteries.filter(
            (mystery) =>
                !assignedMysteries.includes(mystery.id) &&
                mystery.id !== members.find((member) => member.id === memberId)?.mystery.id
        )
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if(!user || !user.group) {
            alert("Zelator nie zarządza żadną grupą.");
            return;
        }

        const payload = {
            groupId: user.group.id,
            intentionId,
            eventDate,
            autoAssign,
            memberMysteries: autoAssign ? null : memberMysteries,
        };

        axios.post("http://localhost:9002/mystery-change/plan",
            payload, {
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
                    {intentions
                        .filter((intention) => intention.id !== currentGroupIntention?.id)
                        .map((intention) => (
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

            {!autoAssign && (
                <div>
                    <h3>Przypisanie tajemnic dla członków grupy:</h3>
                    {members.map((member) => (
                        <div key={member.id}>
                            <label>{member.firstName} {member.lastName}:</label>
                            <select
                                value={memberMysteries[member.id] || ""}
                                onChange={(e) => handleMysteryChange(member.id, e.target.value)}
                                required
                            >
                                <option value="">Wybierz tajemnicę</option>
                                {getAvailableMysteries(member.id).map(
                                    (mystery) => (
                                        <option
                                            key={mystery.id}
                                            value={mystery.id}
                                        >
                                            {mystery.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    ))}
                </div>
            )}

            <button type="submit">Zaplanuj zmianę tajemnic</button>
        </form>
    );

};

export default PlanMysteryChange;