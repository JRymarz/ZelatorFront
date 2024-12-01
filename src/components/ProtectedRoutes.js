import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useUser} from "../context/UserContext";

function ProtectedRoutes({children}) {
    const {user, loading} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("ProtectedRoutes user:", user);

        if(!loading) {
            if(!user) {
                console.log("Brak usera");
                navigate("/login");
            } else if(user.role !== "MainZelator") {
                console.log("Zła rola");
                navigate("/notAuthorized");
            }
        }
    }, [user, loading, navigate]);

    if(loading) return <div>Ładowanie...</div>;

    return user && user.role === "MainZelator" ? children : null;

}

export default ProtectedRoutes;