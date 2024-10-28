import { createSlice } from "@reduxjs/toolkit";

const AuthReducer = createSlice({
    name: "Auth",
    initialState: {
        user: null,
        loading: false,
        token: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
    }}
});

export const { setUser, setLoading, setToken } = AuthReducer.actions;
export default AuthReducer.reducer;