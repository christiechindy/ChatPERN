import { AuthContext } from "./AuthContext";
import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

export const FriendChatContext = createContext();

export const FriendChatContextProvider = ({children}) => {
    const [friends, setFriends] = useState([]);

    const {currentUser} = useContext(AuthContext);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/${currentUser.user_id}/friends`);
            setFriends(res.data);
            console.log("brhsl set friends");
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setFriends([]);
        fetchFriends();
    }, [currentUser])

    return (
        <FriendChatContext.Provider value={{friends, fetchFriends}}>
            {children}
        </FriendChatContext.Provider>
    )
}