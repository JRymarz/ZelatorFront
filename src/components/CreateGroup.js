import React, {useState, useEffect} from "react";
import axios from "axios";


function CreateGroup() {
    const [formData, setFormData] = useState({
        name: "",
        intentionId: "",
    });

    const [intentionList, setIntentionList] = useState([]);

    useEffect(() => {
        const fetchIntentions = async () => {
            try {
                const response = await axios.get("http://localhost:9002/intentions", {withCredentials: true});
                setIntentionList(response.data);
            } catch (error) {
                console.error("Bład podczas pobierania intencji:", error);
            }
        };

        fetchIntentions();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:9002/groups/create",
                formData,
                {withCredentials: true},
            );
            alert(response.data);
        } catch (error) {
            alert("Nie udało się utworzyń nowej róży.");
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <label>
                Nazwa grupy:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Intencja:
                <select
                    name="intentionId"
                    value={formData.intentionId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Wybierz intencję</option>
                    {intentionList.map((intention) => (
                        <option key={intention.id} value={intention.id}>
                            {intention.title}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit">Utwórz Różę</button>
        </form>
    )

}

export default CreateGroup;