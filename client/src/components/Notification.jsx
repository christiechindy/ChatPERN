import axios from "axios";
import React, { useContext } from 'react'
import { useState } from "react";
import { useEffect } from "react";
import { FriendChatContext } from "../context/FriendChatContext";
import Avatar from "../icons/Avatar"
import Loading from "./Loading";

const Notification = ({invs, loading, setLoading}) => {
    const [invsdata, setInvsdata] = useState([]);

    useEffect(() => {
        const getInvsData = async () => {
            setInvsdata([]);
            for (let i = 0; i < invs.length; i++) {        
                const invsender = await axios.post("http://localhost:5000/inv/data", {id: invs[i].person1})

                setInvsdata([
                    ...invsdata,
                    {
                        user_id: invsender.data[0].user_id,
                        name: invsender.data[0].name,
                        pict: invsender.data[0].pict,
                        request_time: invs[i].request_time,
                        to_relation_id: invs[i].relation_id
                    }
                ])
            }
            setLoading(false);
        }
        getInvsData();
    }, [])

    const {fetchFriends} = useContext(FriendChatContext);

    const confirmHandler = async (relation_id, user_id) => {
        await axios.post("http://localhost:5000/inv/acc", {relation_id});

        //setTodos(todos.filter(todo => todo.id !== todoId))
        setInvsdata(invsdata => invsdata.filter(data => data.user_id !== user_id));
        // setTodos(todos => todos.filter(todo => todo._id !== data._id));

        fetchFriends();
    }

    const refuseHandler = async (relation_id, user_id) => {
        console.log("refuseee")
        await axios.post("http://localhost:5000/inv/refuse", {relation_id});
        setInvsdata(invsdata => invsdata.filter(data => data.user_id !== user_id));
    }

    return (
        <div className="notifbox">
            <h1>Permintaan Pertemanan {invsdata.length}</h1>
            {loading ? <Loading /> : ""}
            {invsdata?.map(inv => (
                <div className="inv" key={inv.user_id}>
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
                        <button onClick={() => confirmHandler(inv.to_relation_id)} >Confirm</button>
                        <button onClick={() => refuseHandler(inv.to_relation_id, inv.user_id)}>Refuse</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Notification