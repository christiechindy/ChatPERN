import { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom";
import { AuthContext, TAuthContextData } from "./context/AuthContext"

interface IProps {
    children: any
}

export const ProtectedRoute = ({children}: IProps) => {
    const {currentUser} = useContext(AuthContext) as TAuthContextData;

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
}