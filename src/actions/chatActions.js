import axios from "axios";

export const getChatMessages = (chatRoomId) => async (dispatch) => {
    try {
        const token = localStorage.getItem("psnToken");

        // Используем новый путь с roomId
        const response = await axios.get(`http://localhost:8081/rooms/${chatRoomId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        dispatch({
            type: "SET_CHAT_MESSAGES",
            payload: response.data,
        });
    } catch (error) {
        console.error("Failed to load messages", error);
    }
};
export const getFollowingUsers = () => async (dispatch) => {
    try {
        const token = localStorage.getItem("psnToken");
        const userId = localStorage.getItem("psnUserId");

        if (!token || !userId) {
            console.error("JWT token or user ID is missing");
            return;
        }

        const response = await axios({
            method: "post",
            url: "/api/v1/users/getfollowing",
            headers: {
                Authorization: `${token}`,
            },
            data: {
                id: userId,
            },
        });

        // Убираем дубликаты по id
        const uniquePayload = Array.from(
            new Map(response.data.payload.map((u) => [u.id, u])).values()
        );

        dispatch({ type: "SET_FOLLOWING_USERS", payload: uniquePayload });
    } catch (error) {
        console.error("Error fetching following users:", error);
        dispatch({ type: "SET_FOLLOWING_USERS", payload: [] });
    }
};
