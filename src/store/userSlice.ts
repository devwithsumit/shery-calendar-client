import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types/auth';

const getInitialState = (): AuthState => {
    const token = localStorage.getItem('sc_token');
    const user = null;

    return {
        user,
        token,
        isAuthenticated: !!token,
    };
};

const userSlice = createSlice({
    name: 'user',
    initialState: getInitialState(),
    reducers: {
        setToken: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('sc_token', action.payload.token);
        },
        setUser: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user;
        },
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('sc_token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('sc_token');
            localStorage.removeItem('sc_theme');
        },
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
    },
});

export const { setToken, setUser, setCredentials, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
