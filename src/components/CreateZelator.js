import React, {useState} from "react";
import axios from "axios";


function CreateZelator() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:9002/create-zelator",
                formData,
                {withCredentials: true}
            );
            alert(response.data);
        } catch (error) {
            console.error("Bład podczas tworzenia konta:", error);
            alert("Nie udało się utworzyć konta.");
        }
    };


    return(
        <form onSubmit={handleSubmit}>
            <label>
                Imię:
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </label>
            <label>
                Nazwisko:
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} required  />
            </label>
            <label>
                Hasło:
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </label>
            <button type="submit">Utwórz nowe konto</button>
        </form>
    );

}

export default CreateZelator;