import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SheryEvent, SheryEventRequest } from '@/types/sheryEvent';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const sheryEventApi = createApi({
    reducerPath: 'sheryEventApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/shery-events`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('sc_token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['SheryEvents'],
    endpoints: (builder) => ({
        getSheryEvents: builder.query<SheryEvent[], { startTime?: string; endTime?: string }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params.startTime) searchParams.append('startTime', params.startTime);
                if (params.endTime) searchParams.append('endTime', params.endTime);
                const queryString = searchParams.toString();
                return queryString ? `?${queryString}` : '';
            },
            providesTags: ['SheryEvents'],
        }),
        createSheryEvent: builder.mutation<SheryEvent, SheryEventRequest>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SheryEvents'],
        }),
        updateSheryEvent: builder.mutation<SheryEvent, { id: number; data: SheryEventRequest }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['SheryEvents'],
        }),
        deleteSheryEvent: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SheryEvents'],
        }),
    }),
});

export const {
    useGetSheryEventsQuery,
    useCreateSheryEventMutation,
    useUpdateSheryEventMutation,
    useDeleteSheryEventMutation,
} = sheryEventApi;
