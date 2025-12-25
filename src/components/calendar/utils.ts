import { format } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';

/**
 * Convert API CalendarEvent to react-big-calendar event format
 */
export const toCalendarEvent = (event: CalendarEvent, primaryCalendarId?: string) => {
    const start = new Date(event.startDateTime);
    const isAllDay = event.startDateTime.includes('00:00:00') && event.endDateTime.includes('23:59:59');
    const isPrimaryCalendar = event.calendarId === primaryCalendarId;

    // Add time to title only for non-all-day events from primary calendar
    const title = (isAllDay || !isPrimaryCalendar)
        ? event.summary
        : `${format(start, 'h:mm a')} - ${event.summary}`;

    return {
        id: event.id,
        title,
        start,
        end: new Date(event.endDateTime),
        resource: event, // Keep original data for modals
        calendarId: event.calendarId, // Pass calendar ID for styling
    };
};

/**
 * Get event style based on calendar color
 */
export const getEventStyle = (event: any, calendarColorMap: Record<string, string>) => {
    const calendarId = event.resource?.calendarId || event.calendarId;
    const backgroundColor = calendarColorMap[calendarId] || '#25cfa6'; // Use primary theme color

    return {
        style: {
            backgroundColor,
            borderColor: backgroundColor,
            color: '#ffffff',
        },
    };
};

/**
 * Format date-time for input[type="datetime-local"]
 */
export const formatDateTimeLocal = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Parse datetime-local input to ISO string
 */
export const toISOString = (dateTimeLocal: string): string => {
    const date = new Date(dateTimeLocal);
    return date.toISOString();
};

/**
 * Get user's timezone
 */
export const getUserTimeZone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Format event details for copying to clipboard
 */
export const formatEventDetails = (event: CalendarEvent): string => {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const timeZone = getUserTimeZone();

    const dateStr = format(start, 'EEEE, MMMM d');
    const startTime = format(start, 'h:mm a');
    const endTime = format(end, 'h:mm a');

    let details = `${event.summary}\n${dateStr} · ${startTime} – ${endTime}\nTime zone: ${timeZone}`;

    if (event.meetLink) {
        details += `\n\nGoogle Meet joining info\nVideo call link: ${event.meetLink}`;
    }

    if (event.location) {
        details += `\n\nLocation: ${event.location}`;
    }

    return details;
};

/**
 * Format date for all-day event (start of day)
 */
export const formatDateForAllDay = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00`;
};

/**
 * Format date for all-day event end (end of day)
 */
export const formatDateForAllDayEnd = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T23:59`;
};

/**
 * Format event date/time for display in ViewEventModal
 */
export const formatDisplayDateTime = (event: CalendarEvent): string => {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const dateStr = format(start, 'EEEE, MMMM d, yyyy');
    const startTime = format(start, 'h:mm a');
    const endTime = format(end, 'h:mm a');
    return `${dateStr} · ${startTime} – ${endTime}`;
};
