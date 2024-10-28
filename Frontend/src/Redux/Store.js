import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";
const store = configureStore({
    reducer: {
        Auth : AuthReducer,
    }
});

export default store;