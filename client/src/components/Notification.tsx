import axios from "axios";
import React, { useContext } from 'react'
import { useState } from "react";
import { useEffect } from "react";
import { FriendChatContext, TFriendChatContextData } from "../context/FriendChatContext";
import Avatar from "../icons/Avatar"
import Loading from "./Loading";
import { IInvs } from "./Sidebar";

interface IProps {
    invs: IInvs[],
    setInvs: React.Dispatch<React.SetStateAction<IInvs[]>>,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const Notification = ({invs, setInvs, loading, setLoading}: IProps) => {
    const {fetchFriends} = useContext(FriendChatContext) as TFriendChatContextData;

    const confirmHandler = async (relation_id: number, user_id: number) => {
        await axios.post("http://localhost:5000/inv/acc", {relation_id});

        setInvs(invs => invs.filter(data => data.person1 !== user_id));

        fetchFriends();
    }

    const refuseHandler = async (relation_id: number, user_id: number) => {
        console.log("refuseee")
        await axios.post("http://localhost:5000/inv/refuse", {relation_id});
        setInvs(invs => invs.filter(data => data.person1 !== user_id));
    }

    return (
        <div className="notifbox">
            <h1>Permintaan Pertemanan {invs.length}</h1>
            {loading ? <Loading /> : ""}
            {invs?.map(inv => (
                <div className="inv" key={inv.person1}>
                    <div className="sender">
                        <div className="icon">
                        {inv.pict ? <img src={inv.pict} alt="Sender" /> : <Avatar/> }
                        </div>
                        <div className="name_time">
                            <div className="name">{inv.name}</div>
                            <div className="time">{inv.request_time}</div>
                        </div>
                    </div>
                    <div className="actionBtn">
                        <button onClick={() => confirmHandler(inv.relation_id, inv.person1)} >Confirm</button>
                        <button onClick={() => refuseHandler(inv.relation_id, inv.person1)}>Refuse</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Notification