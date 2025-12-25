
export interface AppEvent {
    id: number;
    calendarId: number;
    calendarName: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    location?: string;
    meetingLink?: string;
    createdByName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppEventRequest {
    calendarId: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    isAllDay?: boolean;
    location?: string;
    meetingLink?: string;
}

export interface UpdateAppEventRequest {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    isAllDay?: boolean;
    location?: string;
    meetingLink?: string;
}
