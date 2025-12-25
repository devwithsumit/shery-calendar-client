import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CalendarEvent, CreateEventRequest, UpdateEventRequest, Calendar } from '@/types/calendar';
import type { SuccessResponse } from '@/types/common';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const calendarApi = createApi({
    reducerPath: 'calendarApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/google/calendar`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('sc_token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Events', 'Calendars'],
    endpoints: (builder) => ({
        getCalendars: builder.query<Calendar[], void>({
            query: () => '/calendars',
            transformResponse: (response: SuccessResponse<Calendar[]>) => response.data,
            providesTags: ['Calendars'],
        }),
        getEvents: builder.query<CalendarEvent[], { calendarIds?: string[]; maxResults?: number }>({
            query: ({ calendarIds, maxResults = 100 }) => {
                const params = new URLSearchParams();
                params.append('maxResults', maxResults.toString());
                if (calendarIds && calendarIds.length > 0) {
                    calendarIds.forEach(id => params.append('calendarIds', id));
                }
                return `/events?${params.toString()}`;
            },
            transformResponse: (response: SuccessResponse<CalendarEvent[]>) => response.data,
            providesTags: ['Events'],
        }),
        getSurroundingEvents: builder.query<CalendarEvent[], void>({
            query: () => '/events/surrounding',
            transformResponse: (response: SuccessResponse<CalendarEvent[]>) => {
                const events = response.data;
                // Sort by start time to ensure chronological order
                return events.sort((a, b) => {
                    const aTime = new Date(a.startDateTime || '').getTime();
                    const bTime = new Date(b.startDateTime || '').getTime();
                    return aTime - bTime;
                });
            },
            providesTags: ['Events'],
        }),
        getEvent: builder.query<CalendarEvent, string>({
            query: (eventId) => `/events/${eventId}`,
            transformResponse: (response: SuccessResponse<CalendarEvent>) => response.data,
        }),
        createEvent: builder.mutation<CalendarEvent, CreateEventRequest>({
            query: (body) => ({ url: '/events', method: 'POST', body }),
            transformResponse: (response: SuccessResponse<CalendarEvent>) => response.data,
            invalidatesTags: ['Events'],
        }),
        updateEvent: builder.mutation<CalendarEvent, UpdateEventRequest>({
            query: ({ eventId, ...body }) => ({
                url: `/events/${eventId}`,
                method: 'PUT',
                body,
            }),
            transformResponse: (response: SuccessResponse<CalendarEvent>) => response.data,
            invalidatesTags: ['Events'],
        }),
        deleteEvent: builder.mutation<void, string>({
            query: (eventId) => ({ url: `/events/${eventId}`, method: 'DELETE' }),
            invalidatesTags: ['Events'],
        }),
    }),
});

export const {
    useGetCalendarsQuery,
    useGetEventsQuery,
    useGetSurroundingEventsQuery,
    useGetEventQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
} = calendarApi;
