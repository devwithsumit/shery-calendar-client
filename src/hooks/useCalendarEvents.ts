import {
    useGetEventsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
} from '@/api/calendarApi';
import { useAppSelector } from './useAppSelector';
import type { CreateEventRequest, UpdateEventRequest } from '@/types/calendar';
import toast from 'react-hot-toast';
import { useMemo } from 'react';

export const useCalendarEvents = () => {
    const enabledCalendarIds = useAppSelector(state => state.calendar.enabledCalendarIds);
    
    // Always pass explicit calendar IDs array (never undefined)
    const queryParams = useMemo(() => ({
        calendarIds: enabledCalendarIds,
        maxResults: 100,
    }), [enabledCalendarIds]);

    const { data: events = [], isLoading, refetch } = useGetEventsQuery(queryParams);
    const [createEventMutation, { isLoading: isCreating }] = useCreateEventMutation();
    const [updateEventMutation, { isLoading: isUpdating }] = useUpdateEventMutation();
    const [deleteEventMutation, { isLoading: isDeleting }] = useDeleteEventMutation();

    const createEvent = async (data: CreateEventRequest) => {
        try {
            await createEventMutation(data).unwrap();
            toast.success('Event created!');
        } catch {
            toast.error('Failed to create event');
        }
    };

    const updateEvent = async (data: UpdateEventRequest) => {
        try {
            await updateEventMutation(data).unwrap();
            toast.success('Event updated!');
        } catch {
            toast.error('Failed to update event');
        }
    };

    const deleteEvent = async (eventId: string) => {
        try {
            await deleteEventMutation(eventId).unwrap();
            toast.success('Event deleted!');
        } catch {
            toast.error('Failed to delete event');
        }
    };

    return {
        events,
        isLoading,
        refetch,
        createEvent,
        updateEvent,
        deleteEvent,
        isCreating,
        isUpdating,
        isDeleting,
    };
};
