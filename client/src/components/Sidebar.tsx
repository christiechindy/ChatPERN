import axios from "axios";
import React from 'react'
import { useContext } from "react";
import { useState } from "react"
import { AuthContext, TAuthContextData } from "../context/AuthContext";
import NotifBell from "../icons/NotifBell"
import MyInfo from "./MyInfo";
import Notification from "./Notification";

export interface IInvs {
    person1: number,
    person2: number,
    relation_id: number,
    request_time: string,
    status: boolean,
    name: string,
    pict: string,
}

const Sidebar = () => {
    const [showNotif, setShowNotif] = useState<boolean>(false);
    const [invs, setInvs] = useState<IInvs[]>([]);
    const [loading, setLoading] = useState(false);

    const {currentUser} = useContext(AuthContext) as TAuthContextData;

    const notifClicked = async () => {
        if (showNotif) {
            setShowNotif(false)
        } else {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/inv/lists", {id: currentUser!.user_id});
            setInvs(res.data);
            setLoading(false)
            console.log("invssss", res.data);

            setShowNotif(true);
        }
    }

    const [showProfil, setShowProfil] = useState(false);

    return (
        <div className="sidebar">
            <div className="notif" onClick={notifClicked}>
                <NotifBell />
            </div>
            {showNotif ? <Notification invs={invs} setInvs={setInvs} loading={loading} setLoading={setLoading} /> : ""}
            <div className="profil" onClick={() => setShowProfil(!showProfil)}>
                <img src="http://assets.kompasiana.com/items/album/2017/12/20/gettyimages-dot-com-baby-face-5a3a78d1cf01b432266bbca4.jpg" alt="people" className="face" />
            </div>
            {showProfil ? <MyInfo /> : ""}
        </div>
    )
}

export default Sidebar