import { useMemo } from 'react';
import { useGetSheryEventsQuery } from '@/api/sheryEventApi';
import { useGetEventsQuery } from '@/api/calendarApi';
import { useGetAppEventsQuery } from '@/api/appEventApi';
import { useAppSelector } from './useAppSelector';
import type { CalendarEvent } from '@/types/calendar';

/**
 * Custom hook to merge Google Calendar events, Shery Events, and App-native Events
 * Returns a unified array of events for calendar display
 */
export const useMergedCalendarEvents = () => {
    const enabledCalendarIds = useAppSelector(state => state.calendar.enabledCalendarIds);
    const enabledAppCalendarIds = useAppSelector(state => state.calendar.enabledAppCalendarIds);
    const showSheryEvents = useAppSelector(state => state.calendar.showSheryEvents);

    // Fetch Google Calendar events from API
    const queryParams = useMemo(() => ({
        calendarIds: enabledCalendarIds,
        maxResults: 100,
    }), [enabledCalendarIds]);

    const { data: googleEvents = [], isLoading: isLoadingGoogle } = useGetEventsQuery(queryParams);

    // Fetch Shery Events from API (no date filter - fetch all)
    const { data: sheryEvents, isLoading: isLoadingShery } = useGetSheryEventsQuery({});

    // Fetch App-native Events
    const { data: appEvents = [], isLoading: isLoadingApp } = useGetAppEventsQuery();

    // Merge events from all sources
    const mergedEvents = useMemo((): CalendarEvent[] => {
        const allEvents: CalendarEvent[] = [];

        // Add Google Calendar events with source
        googleEvents.forEach(event => {
            allEvents.push({
                ...event,
                source: 'GOOGLE' as const,
                calendarId: event.calendarId || 'google-default',
            });
        });

        // Convert Shery Events to CalendarEvent format
        if (showSheryEvents && sheryEvents) {
            const convertedSheryEvents = sheryEvents.map((event) => {
                // Convert ISO string to the format expected by the calendar
                // For all-day events, use date only. For timed events, use full datetime
                const startDateTime = event.isAllDay
                    ? `${event.startTime.split('T')[0]}T00:00:00`
                    : event.startTime;
                const endDateTime = event.isAllDay
                    ? `${event.endTime.split('T')[0]}T23:59:59`
                    : event.endTime;

                return {
                    id: `shery-${event.id}`,
                    calendarId: 'shery-events',
                    source: 'SHERY' as const,
                    summary: event.title,
                    description: event.description || undefined,
                    startDateTime,
                    endDateTime,
                    location: event.location || undefined,
                    creatorEmail: event.createdByName || `User ${event.createdBy}`,
                    isSheryEvent: true,
                } as CalendarEvent;
            });

            allEvents.push(...convertedSheryEvents);
        }

        // Convert App-native Events to CalendarEvent format
        if (appEvents && enabledAppCalendarIds && enabledAppCalendarIds.length > 0) {
            const convertedAppEvents = appEvents
                .filter(event => enabledAppCalendarIds.includes(event.calendarId))
                .map((event) => {
                    const startDateTime = event.isAllDay
                        ? `${event.startTime.split('T')[0]}T00:00:00`
                        : event.startTime;
                    const endDateTime = event.isAllDay
                        ? `${event.endTime.split('T')[0]}T23:59:59`
                        : event.endTime;

                    return {
                        id: `app-${event.id}`,
                        calendarId: `app-${event.calendarId}`,
                        source: 'APP_PERSONAL' as const,
                        summary: event.title,
                        description: event.description || undefined,
                        startDateTime,
                        endDateTime,
                        location: event.location || undefined,
                        meetLink: event.meetingLink || undefined,
                        creatorEmail: event.createdByName || undefined,
                        isSheryEvent: false,
                    } as CalendarEvent;
                });

            allEvents.push(...convertedAppEvents);
        }

        return allEvents;
    }, [googleEvents, sheryEvents, showSheryEvents, appEvents, enabledAppCalendarIds]);

    return {
        events: mergedEvents,
        isLoading: isLoadingGoogle || isLoadingShery || isLoadingApp,
        googleEventsCount: googleEvents.length,
        sheryEventsCount: sheryEvents?.length || 0,
        appEventsCount: appEvents?.length || 0,
    };
};
