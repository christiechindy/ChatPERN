import axios from "axios";
import React from 'react'
import { useContext } from "react";
import { useState } from "react"
import { AuthContext } from "../context/AuthContext";

const AddFriend = () => {
    const {currentUser} = useContext(AuthContext);

    const [fEmail, setFEmail] = useState("");
    const [status, setStatus] = useState(null);

    const addHandler = async (e) => {
        e.preventDefault();
        console.log("button add is clcike");

        let user = await axios.post("http://localhost:5000/userid_of_email", {email: fEmail});
        
        user = user.data;

        if (user === "not found") {
            setStatus("Sorry, that email hasn't been registered in our app");
            setFEmail("");
            return;
        } else {
            setStatus("");
        }

        setFEmail("");
        
        await axios.post("http://localhost:5000/inv/addFriend", {
            person1: currentUser.user_id,
            person2: user,
        })
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