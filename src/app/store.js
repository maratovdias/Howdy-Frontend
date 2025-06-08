import { configureStore } from "@reduxjs/toolkit";
import followingPostReducer from "../feature/followingPost/followingPostSlice";
import followingAccountReducer from "../feature/followingAccounts/followingAccountSlice";
import checkProfileReducer from "../feature/checkProfile/checkProfileSlice";
import chatReducer from "../chatReducer"; // Импортируйте редюсер чата


export const store = configureStore({
    reducer: {
        followingPostReducer: followingPostReducer,
        followingAccountReducer: followingAccountReducer,
        checkProfileReducer: checkProfileReducer,
        chatReducer,
    },
});