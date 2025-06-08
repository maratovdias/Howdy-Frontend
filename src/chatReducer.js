const initialState = {
    messages: [],
    followingUsers: [],
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CHAT_MESSAGES":
            return {
                ...state,
                messages: action.payload,
            };
        case "NEW_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case "SET_FOLLOWING_USERS":
            return {
                ...state,
                followingUsers: action.payload,
            };
        case "CLEAR_MESSAGES":
            return {
                ...state,
                messages: [],
            };
        default:
            return state;
    }
};

export default chatReducer;