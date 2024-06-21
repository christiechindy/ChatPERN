import { AuthContext, TAuthContextData } from "./AuthContext";
import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import axios from "axios";

export type TFriendChatContextData = {
    friends: TFriends[];
    setFriends: React.Dispatch<React.SetStateAction<TFriends[]>>;
    fetchFriends: () => Promise<void>;
    loading: boolean;
}

export type TFriends = {
    friend_id: number;
    name: string;
    pict?: string;
    relation_id: number;
}

export const FriendChatContext = createContext<TFriendChatContextData|null>(null);

interface IProps {
    children: ReactNode
}

export const FriendChatContextProvider = ({children}: IProps) => {
    const [friends, setFriends] = useState<TFriends[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const {currentUser} = useContext(AuthContext) as TAuthContextData;

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/${currentUser!.user_id}/friends`);
            setFriends(res.data);
            console.log("frinedssssss", res.data);
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