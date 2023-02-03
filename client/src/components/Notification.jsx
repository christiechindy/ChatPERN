import axios from "axios";
import React, { useContext } from 'react'
import { useState } from "react";
import { useEffect } from "react";
import { FriendChatContext } from "../context/FriendChatContext";
import Avatar from "../icons/Avatar"

const Notification = ({invs}) => {
    const [invsdata, setInvsdata] = useState([]);

    useEffect(() => {
        console.log("how mny times useeffect is called");
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
        }
        getInvsData();
    }, [])

    const {fetchFriends} = useContext(FriendChatContext);

    const confirmHandler = async (relation_id, user_id) => {
        await axios.post("http://localhost:5000/inv/acc", {relation_id});

        //setTodos(todos.filter(todo => todo.id !== todoId))
        setInvsdata(invsdata.filter(data => data.user_id !== user_id));

        fetchFriends();
    }

    const refuseHandler = (relation_id) => {

    }

    return (
        <div className="notifbox">
            <h1>Permintaan Pertemanan {invsdata.length}</h1>
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