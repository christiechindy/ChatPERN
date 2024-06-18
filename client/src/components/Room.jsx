import React, { useRef } from 'react'
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SendPlane from "../icons/SendPlane";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import Avatar from "../icons/Avatar";
import moment from "moment";
import { FriendChatContext } from "../context/FriendChatContext";

const Room = ({socket}) => {
    const location = useLocation();

    const {relation_id} = useParams();
    const {friend_id} = location.state;
    const {currentUser} = useContext(AuthContext);
    const my_id = currentUser.user_id;

    const [friendProfile, setFriendProfile] = useState([]);

    useEffect(() => {
        const fetchFriendProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/friend=${friend_id}`);
                setFriendProfile(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchFriendProfile();

        socket.emit("join_room", relation_id);
    }, [relation_id])

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/messages/${relation_id}`);
                setMessages(res.data);
                console.log("messagesssssss", res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchMessages();
    }, [relation_id])


    /* -----------------SOCKET---------------- */
    const [typingChat, setTypingChat] = useState("");

    const sendMessage = async (e) => {
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

    const buttonSendRef = useRef(null);

    const handleEnter = (e) => {
        if (e.keyCode === 13) {
            buttonSendRef.current.click();
        }
    }

    return (
        <div className="room">
            <div className="wrapper">
            <div className="header">
                <div className="people">
                    <div className="pict left">
                        {friendProfile[0]?.pict === "" ?
                            <Avatar /> :
                            <img src={friendProfile[0]?.pict} className="face" alt={friendProfile[0]?.name} />
                        }
                    </div>
                    <div className="right">
                        <div className="name">{friendProfile[0]?.name}</div>
                        <div className="email">{friendProfile[0]?.email}</div>
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