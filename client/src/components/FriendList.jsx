import React from 'react'
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import Avatar from "../icons/Avatar";
import { FriendChatContext } from "../context/FriendChatContext";
import Loading from "./Loading";

const FriendList = () => {
    const {friends, loading} = useContext(FriendChatContext);

    return (
        <>
            {loading ? <Loading /> : ""}
            {friends?.map(friend => (
                <NavLink 
                    to={`/room/${friend.relation_id}`} 
                    style={{textDecoration: 'none'}} 
                    className={({isActive}) => (isActive ? "active" : "")}
                    state={{friend_id: friend.friend_id}}
                >
                <div className="row" key={friend.relation_id}>
                    <div className="icon">
                        {friend.pict ?
                        <img src={friend.pict} alt={friend.name} className="face" /> :
                        <Avatar />
                    }

                    </div>
                    <div className="text">
                        <div className="text-left">
                            <div className="name">{friend.name} </div>
                        </div>
                    </div>
                </div>
                </NavLink>
            ))}
        </>
    )
}

export default FriendList