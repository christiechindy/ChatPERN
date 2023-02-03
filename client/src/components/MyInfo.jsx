import axios from "axios"
import React, { useContext, useState } from 'react'
import { redirect, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MyInfo = () => {
    const {logout} = useContext(AuthContext);

    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            setErr(err);
            console.log(err);
        }
    }

    return (
        <div className="myaccount">
            <div onClick={handleClick}>Log out</div>
        </div>
    )
}

export default MyInfo