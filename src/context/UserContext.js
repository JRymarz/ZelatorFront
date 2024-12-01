import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("http://localhost:9002/current-user", { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.log("Brak zalogowanego usera,", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, loading}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);