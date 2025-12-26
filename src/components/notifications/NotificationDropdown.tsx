import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '@/api/notificationApi';
import { NotificationItem } from './NotificationItem';
import { useEffect, useRef } from 'react';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
    const { data: notifications = [], isLoading } = useGetNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-96 bg-surface-light dark:bg-surface-dark rounded-lg 
                shadow-lg border border-border-light dark:border-border-dark z-50 max-h-150
                flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <h3 className="font-semibold text-text-light dark:text-text-dark">
                    Notifications
                </h3>
                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-primary dark:text-primary hover:underline"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
                {isLoading ? (
                    <div className="p-8 text-center text-text-muted-light dark:text-text-muted-dark">
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-text-muted-light dark:text-text-muted-dark">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))
                )}
            </div>
        </div>
    );
};
