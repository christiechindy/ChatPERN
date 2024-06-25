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

const Room = ({socket}: ISocket) => {
    const location = useLocation();

    const {params} = useParams();
    const relation_id = Number(params);

    const {friend_id} = location.state;
    const {currentUser} = useContext(AuthContext) as TAuthContextData;
    const my_id = currentUser!.user_id;

    const [friendProfile, setFriendProfile] = useState<IFriendProfile>();

    const fetchFriendProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/friend=${friend_id}`);
            console.log("friend Profile", res.data);
            setFriendProfile(res.data);
        } catch(err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchFriendProfile();
        socket.emit("join_room", relation_id!);
    }, [relation_id])

    const [messages, setMessages] = useState<IMessageData[]>([]);

    const fetchMessages = async (relation_id: number) => {
        try {
            const res = await axios.get(`http://localhost:5000/messages/${relation_id}`);
            setMessages(res.data);
            console.log("messagesssssss", res.data);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (relation_id) {
            fetchMessages(relation_id);
        }
    }, [relation_id])


    /* -----------------SOCKET---------------- */
    const [typingChat, setTypingChat] = useState<string>("");

    const sendMessage = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if (typingChat !== "") {
            const messageData = {
                sent_time: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                sender_id: my_id,
                relation_id,
                words: typingChat
            }

            socket.emit("send_message", messageData, relation_id);
            setMessages(mess => [...mess, messageData]);
            await axios.post("http://localhost:5000/sendmessage", messageData);
            setTypingChat("");
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages(mess => [...mess, data]);
        })
    }, [socket])

    const buttonSendRef = useRef<HTMLDivElement>(null);

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            buttonSendRef.current?.click();
        }
    }

    return (
        <div className="room">
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
                    online
                </div>
            </div>
            <div>
            <div className="messages">
                {messages.map(message => (
                    <div className={message.sender_id === my_id ? "bubbleChat right" : "bubbleChat left"}>
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