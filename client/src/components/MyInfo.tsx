import axios from "axios"
import React, { useContext, useState } from 'react'
import { redirect, useNavigate } from "react-router-dom";
import { AuthContext, TAuthContextData } from "../context/AuthContext";

const MyInfo = () => {
    const {logout} = useContext(AuthContext) as TAuthContextData;
    const navigate = useNavigate();

    const handleLogOut = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        try {
            await logout();
            navigate("/login");
        } catch (err:any) {
            console.log(err);
        }
    }

    return (
        <div className="myaccount">
            <div onClick={handleLogOut}>Log out</div>
        </div>
    )
}

export default MyInfo