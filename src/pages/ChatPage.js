import { useEffect, useState } from "react";

function ChatPage() {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("psnToken");

        if (!token) {
            console.error("JWT token is missing");
            return;
        }

        fetch("http://localhost:8081/api/chats", {
            headers: { Authorization: `${token}` },
        })
            .then(response => response.json())
            .then(data => setChats(data.payload))
            .catch(error => console.error("Ошибка загрузки чатов:", error));
    }, []);

    return (
        <div>
            <h1>Чат</h1>
            <ul>
                {chats.map(chat => (
                    <li key={chat.id}>{chat.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default ChatPage;
