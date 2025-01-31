import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useUser} from "../context/UserContext";

function ProtectedRoutesForZelator({children}) {
    const {user, loading} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("ProtectedRoutesForZelator user:", user);

        if(!loading) {
            if(!user) {
                console.log("Brak usera.");
                navigate("/login");
            } else if ((user.role !== "Zelator") && (user.role !== "MainZelator")) {
                console.log("Zła rola.");
                navigate("/notAuthorized");
            }
        }
    }, [user, loading, navigate]);

    if(loading) return <div>Ładowanie...</div>;

    return user && (user.role === "Zelator" || user.role === "MainZelator") ? children : null;

}

export default ProtectedRoutesForZelator;