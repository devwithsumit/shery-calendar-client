export type EventSource = 'GOOGLE' | 'APP_PERSONAL' | 'SHERY';

export interface CalendarEvent {
    id: string;
    calendarId: string;
    source: EventSource;
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
    timeZone?: string;
    meetLink?: string;
    htmlLink?: string;
    status?: string;
    attendees?: EventAttendee[];
    creatorEmail?: string;
    created?: string;
    updated?: string;
    isSheryEvent?: boolean;
}

export interface EventAttendee {
    email: string;
    displayName?: string;
    responseStatus?: string;
    organizer?: boolean;
}

export interface CreateEventRequest {
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
    timeZone?: string;
    createMeetLink?: boolean;
    attendeeEmails?: string[];
}

export interface UpdateEventRequest extends CreateEventRequest {
    eventId: string;
}

export interface CalendarSlotInfo {
    start: Date;
    end: Date;
}

export interface Calendar {
    calendarId: string;
    summary: string;
    description?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    accessRole?: string;
    primary?: boolean;
    selected?: boolean;
    readOnly?: boolean;
    timeZone?: string;
}

// App-native calendar types
export interface AppCalendar {
    id: number;
    name: string;
    type: 'SHERY' | 'PERSONAL';
    backgroundColor?: string;
    foregroundColor?: string;
    isReadOnly?: boolean;
    isOwner: boolean;
    createdAt: string;
}
