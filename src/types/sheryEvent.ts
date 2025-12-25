export interface SheryEvent {
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    location?: string;
    createdBy: number;
    createdByName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SheryEventRequest {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    location?: string;
}
