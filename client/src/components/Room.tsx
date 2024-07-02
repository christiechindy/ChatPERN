import React, { useRef } from 'react'
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SendPlane from "../icons/SendPlane";
import { useContext } from "react";
import { AuthContext, TAuthContextData } from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import Avatar from "../icons/Avatar";
import moment from "moment";
import { ClientToServerEvents, IMessageData, ServerToClientEvents } from '@/socket-interface/interface';
import { Socket } from 'socket.io-client';

interface ISocket {
    socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

interface IFriendProfile {
    email: string,
    name: string,
    pict: string,
}

interface VisibilityTrackerProps {
    onVisibilityChange: (isVisible: boolean) => void;
}

const VisibilityTracker: React.FC<VisibilityTrackerProps> = ({ onVisibilityChange }) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                onVisibilityChange(true);
            } else {
                onVisibilityChange(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Initial check
        handleVisibilityChange();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [onVisibilityChange]);

    return null;
};

const Room = ({socket}: ISocket) => {
    const location = useLocation();

    const {relation_id} = useParams();
    const relationId = Number(relation_id);

    const {friend_id} = location.state;
    const {currentUser} = useContext(AuthContext) as TAuthContextData;
    const my_id = currentUser!.user_id;

    const [friendProfile, setFriendProfile] = useState<IFriendProfile>();

    const fetchFriendProfile = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/friend=${friend_id}`);
            setFriendProfile(res.data);
        } catch(err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchFriendProfile();
        socket.emit("join_room", relationId!);
    }, [relationId])

    const [messages, setMessages] = useState<IMessageData[]>([]);

    const fetchMessages = async (relationId: number) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/messages/${relationId}`);
            setMessages(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (relationId) {
            fetchMessages(relationId);
        }
    }, [relationId])


    /* -----------------SOCKET---------------- */
    const [typingChat, setTypingChat] = useState<string>("");

    const sendMessage = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if (typingChat !== "") {
            const messageData = {
                sent_time: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                sender_id: my_id,
                relation_id: relationId,
                words: typingChat
            }

            socket.emit("send_message", messageData, relationId);
            setMessages(mess => [...mess, messageData]);
            await axios.post(`${process.env.REACT_APP_API}/sendmessage`, messageData);
            setTypingChat("");
        }
    }

    const [isFriendOnline, setIsFriendOnline] = useState<boolean>(false);
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages(mess => [...mess, data]);
        })

        socket.on("receive_status", (data) => {
            setIsFriendOnline(data);
        })
    }, [socket])

    const buttonSendRef = useRef<HTMLDivElement>(null);
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            buttonSendRef.current?.click();
        }
    }

    const [isOnline, setIsOnline] = useState<boolean>(false);
    const handleOnlineChange = (isOnline: boolean) => {
        setIsOnline(isOnline);
        socket.emit("set_online_status", isOnline, relationId);
    }

    return (
        <div className="room">
            <VisibilityTracker onVisibilityChange={handleOnlineChange} />
            <div className="wrapper">
            <div className="header">
                <div className="people">
                    <div className="pict left">
                        {friendProfile?.pict === "" ?
                            <Avatar /> :
                            <img src={friendProfile?.pict} className="face" alt={friendProfile?.name} />
                        }
                    </div>
                    <div className="right">
                        <div className="name">{friendProfile?.name}</div>
                        <div className="email">{friendProfile?.email}</div>
                    </div>
                </div>
                <div className="status">
                    {isFriendOnline ? 
                        <div className="online">Online</div>
                        :
                        <div className="offline">Offline</div>
                    }
                </div>
            </div>
            <div>
            <div className="messages">
                {messages.map((message,i) => (
                    <div key={i} className={message.sender_id === my_id ? "bubbleChat right" : "bubbleChat left"}>
                        <div className="message">{message.words}</div>
                        <div className="info">
                            {/* <div className="read">Read</div> */}
                            <div className="time">{message.sent_time}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="typing">
                <input type="text" placeholder="Type a message" onChange={e => setTypingChat(e.target.value)} onKeyDown={e => handleEnter(e)} value={typingChat}/>
                <div className="sendBtn" ref={buttonSendRef} onClick={sendMessage}><SendPlane /></div>
            </div>
            </div>
            </div>
        </div>
    )
}

export default Room