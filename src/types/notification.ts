export type NotificationType = 'EVENT_CREATED' | 'EVENT_UPDATED' | 'EVENT_DELETED';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    referenceId: number;
    isRead: boolean;
    createdAt: string;
}
