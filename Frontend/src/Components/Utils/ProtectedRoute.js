import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.Auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/");
        }
    }, []);

    return (
        <>
            {children}
        </>
    )
};
export default ProtectedRoute;