import { AuthContext } from "./AuthContext";
import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

export const FriendChatContext = createContext();

export const FriendChatContextProvider = ({children}) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);

    const {currentUser} = useContext(AuthContext);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/${currentUser.user_id}/friends`);
            setFriends(res.data);
            setLoading(false);
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
        <FriendChatContext.Provider value={{friends, setFriends, fetchFriends, loading}}>
            {children}
        </FriendChatContext.Provider>
    )
}