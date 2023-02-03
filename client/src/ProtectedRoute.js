import { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"

export const ProtectedRoute = ({children}) => {
    const {currentUser} = useContext(AuthContext);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
}