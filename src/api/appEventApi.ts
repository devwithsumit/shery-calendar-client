import type { AppEvent, CreateAppEventRequest, UpdateAppEventRequest } from '@/types/appEvent';
import type { AppCalendar } from '@/types/calendar';
import type { SuccessResponse } from '@/types/common';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const appEventApi = createApi({
    reducerPath: 'appEventApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/app`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('sc_token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['AppEvents', 'AppCalendars'],
    endpoints: (builder) => ({
        // Calendar endpoints
        getAppCalendars: builder.query<AppCalendar[], void>({
            query: () => '/calendars',
            transformResponse: (response: SuccessResponse<AppCalendar[]>) => response.data,
            providesTags: ['AppCalendars'],
        }),

        // Event endpoints
        getAppEvents: builder.query<AppEvent[], void>({
            query: () => '/events',
            transformResponse: (response: SuccessResponse<AppEvent[]>) => response.data,
            providesTags: ['AppEvents'],
        }),
        createAppEvent: builder.mutation<AppEvent, CreateAppEventRequest>({
            query: (body) => ({ url: '/events', method: 'POST', body }),
            transformResponse: (response: SuccessResponse<AppEvent>) => response.data,
            invalidatesTags: ['AppEvents'],
        }),
        updateAppEvent: builder.mutation<AppEvent, { id: number; data: UpdateAppEventRequest }>({
            query: ({ id, data }) => ({ url: `/events/${id}`, method: 'PUT', body: data }),
            transformResponse: (response: SuccessResponse<AppEvent>) => response.data,
            invalidatesTags: ['AppEvents'],
        }),
        deleteAppEvent: builder.mutation<void, number>({
            query: (id) => ({ url: `/events/${id}`, method: 'DELETE' }),
            invalidatesTags: ['AppEvents'],
        }),
    }),
});

export const {
    useGetAppCalendarsQuery,
    useGetAppEventsQuery,
    useCreateAppEventMutation,
    useUpdateAppEventMutation,
    useDeleteAppEventMutation,
} = appEventApi;
