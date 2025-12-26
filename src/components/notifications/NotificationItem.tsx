import type { Notification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { useMarkAsReadMutation } from '@/api/notificationApi';

interface NotificationItemProps {
    notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    const [markAsRead] = useMarkAsReadMutation();

    const handleClick = () => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'EVENT_CREATED':
                return 'text-green-600 dark:text-green-400';
            case 'EVENT_UPDATED':
                return 'text-blue-600 dark:text-blue-400';
            case 'EVENT_DELETED':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]';
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`p-3 border-b border-border-light dark:border-border-dark cursor-pointer 
                hover:bg-surface-light dark:hover:bg-surface-dark transition-colors
                ${!notification.isRead ? '' : 'opacity-60'}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm ${getTypeColor(notification.type)}`}>
                        {notification.title}
                    </h4>
                    <p className="text-sm text-text-light dark:text-text-dark mt-1">
                        {notification.message}
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                </div>
                {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
                )}
            </div>
        </div>
    );
};
