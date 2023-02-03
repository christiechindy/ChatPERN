import React from 'react'
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Avatar from "../icons/Avatar";
import { FriendChatContext } from "../context/FriendChatContext";

const FriendList = () => {
    const {friends} = useContext(FriendChatContext);

    return (
        <>
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
                        <div className="lastMessage">{friend.words}</div>
                        </div>
                        <div className="time">{friend.time_sent}</div>
                    </div>
                </div>
                </NavLink>
            ))}
        </>
    )
}

export default FriendList