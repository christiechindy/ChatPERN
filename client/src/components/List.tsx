import React, { useContext } from 'react'
import SearchIcon from "../icons/SearchIcon"
import FriendList from "./FriendList"
import { NavLink } from "react-router-dom";
import { AuthContext, TAuthContextData } from "../context/AuthContext";

const List = () => {
    const {currentUser} = useContext(AuthContext) as TAuthContextData;

    return (
        <div className="list">
            <div className="wrapper">
                <div className="greetings">
                    Hello, {currentUser?.name}👋
                </div>
                <div className="box">
                    <NavLink to={`/room/addFriend`} style={{textDecoration: 'none'}} className={({isActive}) => (isActive ? "active" : "")}>
                    <div className="addFriend row">
                        <div className="icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/1208/1208635.png" alt="add friend" />
                        </div>
                        <div className="text">Add Friend</div>
                    </div>
                    </NavLink>

                    <FriendList/>

                </div>
            </div>
        </div>
    )
}

export default List