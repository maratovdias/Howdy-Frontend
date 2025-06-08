import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatMessages, getFollowingUsers } from "../actions/chatActions";
import { Client } from "@stomp/stompjs";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { Spinner } from "react-bootstrap";

function Chat() {
    const dispatch = useDispatch();
    const chatMessages = useSelector((state) => state.chatReducer.messages);
    const followingUsers = useSelector((state) => state.chatReducer.followingUsers);
    const [message, setMessage] = useState("");
    const [receiver, setReceiver] = useState({ id: "", name: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const stompClientRef = useRef(null);
    const chatRoomIdRef = useRef(null);

    useEffect(() => {
        dispatch(getFollowingUsers()).then(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem("psnToken");
        const userId = localStorage.getItem("psnUserId");

        if (!token || !userId) {
            setError("JWT token or user ID is missing");
            return;
        }

        const client = new Client({
            brokerURL: "ws://localhost:8081/ws/websocket",
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                console.log("✅ WebSocket connected");
                stompClientRef.current = client;

                client.subscribe(`/user/${userId}/queue/messages`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    dispatch({ type: "NEW_MESSAGE", payload: newMessage });
                });

                setError(null);
            },
            onStompError: (error) => {
                console.error("WebSocket error:", error);
                setError("Failed to connect to WebSocket. Retrying...");
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.activate();

        return () => {
            client.deactivate();
            console.log("WebSocket disconnected");
        };
    }, [dispatch]);

    useEffect(() => {
        const senderId = localStorage.getItem("psnUserId");

        if (receiver.id && senderId) {
            const ids = [senderId, receiver.id].sort();
            const chatRoomId = ids.join("_");
            chatRoomIdRef.current = chatRoomId;

            setLoading(true); // Показываем спиннер пока грузим
            dispatch(getChatMessages(chatRoomId))
                .then(() => setLoading(false)) // Скрываем спиннер когда загрузили
                .catch(() => setLoading(false)); // Даже если ошибка — спиннер убрать
        } else {
            dispatch({ type: "CLEAR_MESSAGES" });
        }
    }, [receiver.id, dispatch]);

    useEffect(() => {
        const client = stompClientRef.current;
        const senderId = localStorage.getItem("psnUserId");
        let subscription = null;

        if (client && client.connected && receiver.id) {
            const ids = [senderId, receiver.id].sort();
            const chatRoomId = ids.join("_");
            subscription = client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                dispatch({ type: "NEW_MESSAGE", payload: newMessage });
            });
        }

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                console.log("🛑 Unsubscribed from previous chat");
            }
        };
    }, [receiver.id, dispatch]);

    const handleSendMessage = () => {
        const token = localStorage.getItem("psnToken");
        const senderId = localStorage.getItem("psnUserId");

        if (!receiver.id || !senderId || !token) {
            console.error("Missing sender, receiver, or token");
            return;
        }

        if (!stompClientRef.current || !stompClientRef.current.connected) {
            console.error("WebSocket is not connected");
            return;
        }

        if (message.trim() === "") {
            console.error("Message is empty");
            return;
        }

        const chatMessage = {
            sender: senderId,
            receiver: receiver.id,
            content: message,
        };

        stompClientRef.current.publish({
            destination: `/app/chat/${receiver.id}`,
            body: JSON.stringify(chatMessage),
        });

        setMessage("");
    };
    console.log(chatMessages);
    const currentUserId = localStorage.getItem("psnUserId");
    const chatRoomId1 = currentUserId + '_' + receiver.id;
    const chatRoomId2 = receiver.id + '_' + currentUserId;
    console.log(chatMessages);

    // Filter messages based on the chat room IDs
    const filteredMessages = chatMessages.filter(
        msg => msg.chatRoomId === chatRoomId1 || msg.chatRoomId === chatRoomId2

    );
    console.log(chatMessages);

    return (
        <div className="d-flex" style={{ height: "calc(100vh - 100px)" }}>
            {/* Сайдбар с пользователями */}
            <div className="border-end p-3" style={{ width: "250px", overflowY: "auto" }}>
                <h5 className="mb-3">Users</h5>
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    followingUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`d-flex align-items-center mb-3 p-2 rounded ${receiver.id === user.id ? 'bg-light' : ''}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setReceiver({ id: user.id, name: `${user.firstName} ${user.lastName}` })}
                        >
                            <Hashicon value={user.id} size={40} />
                            <div className="ms-3">
                                <strong>{user.firstName} {user.lastName}</strong>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Основной чат */}
            <div className="flex-grow-1 p-3 d-flex flex-column">
                <h4>Chat {receiver.name && `with ${receiver.name}`}</h4>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="border rounded p-3 flex-grow-1 mb-3" style={{overflowY: "auto"}}>
                    {loading ? (
                        <div className="text-center text-muted">Loading messages...</div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="text-center text-muted">No messages</div>
                    ) : (
                        filteredMessages.map((msg, index) => {
                            const isSentByMe = msg.sender === currentUserId;
                            return (
                                <div key={index}
                                     className={`mb-2 d-flex ${isSentByMe ? "justify-content-end" : "justify-content-start"}`}>
                                    <div className={`p-2 rounded ${isSentByMe ? "bg-success text-white" : "bg-light"}`}
                                         style={{maxWidth: "60%"}}>
                                        <div className="small">{isSentByMe ? "You" : receiver.name || "Other"}</div>
                                        <div>{msg.content}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="d-flex">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-control me-2"
                        placeholder="Type a message..."
                        disabled={!receiver.id}
                    />
                    <button onClick={handleSendMessage} className="btn btn-success" disabled={!receiver.id}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
