import axios from "axios";
import React from 'react'
import { useContext } from "react";
import { useState } from "react"
import { AuthContext, TAuthContextData } from "../context/AuthContext";

const AddFriend = () => {
    const {currentUser} = useContext(AuthContext) as TAuthContextData;

    const [fEmail, setFEmail] = useState<string>("");
    const [status, setStatus] = useState<string|null>(null);

    const addHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const ax = await axios.post(`${process.env.REACT_APP_API}/inv/addFriend`, {
            email: fEmail,
            person1: currentUser!.user_id
        })

        setStatus(ax?.data);

        setFEmail("");
    }

    return (
        <div className="addFriend room">
            <h1>Wanna chat your Friend?</h1>
            <label>Your friend's email <br />
            <input type="email" placeholder="Email" value={fEmail} onChange={e => setFEmail(e.target.value)} onFocus={() => setStatus("")} />
            </label>
            <button onClick={addHandler}>Add Friend</button>
            {status ? <p className="error">{status}</p> : ""}
        </div>
    )
}

export default AddFriend