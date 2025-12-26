import { Bell } from 'lucide-react';
import { useState } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import { useGetNotificationsQuery } from '@/api/notificationApi';

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notifications = [] } = useGetNotificationsQuery();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700/90
                    transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-text-light dark:text-text-dark/90" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center 
                        px-1.5 py-0.5 text-xs font-bold leading-none text-white transform 
                        translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-4.5">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};
