import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import calendarReducer from './calendarSlice';
import { authApi } from '@/api/authApi';
import { calendarApi } from '@/api/calendarApi';
import { sheryEventApi } from '@/api/sheryEventApi';
import { adminApi } from '@/api/adminApi';
import { appEventApi } from '@/api/appEventApi';
import { notificationApi } from '@/api/notificationApi';

export const store = configureStore({
    reducer: {
        user: userReducer,
        calendar: calendarReducer,
        [authApi.reducerPath]: authApi.reducer,
        [calendarApi.reducerPath]: calendarApi.reducer,
        [sheryEventApi.reducerPath]: sheryEventApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [appEventApi.reducerPath]: appEventApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(calendarApi.middleware)
            .concat(sheryEventApi.middleware)
            .concat(adminApi.middleware)
            .concat(appEventApi.middleware)
            .concat(notificationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
