import { Link, useLocation } from 'react-router-dom';
import { Calendar, CalendarDays, Shield } from 'lucide-react';
import { CalendarList } from './CalendarList';
// import { useAppSelector } from '@/hooks/useAppSelector';
import { useGetCurrentUserQuery } from '@/api/authApi';

interface SidebarProps {
    collapsed?: boolean;
}

export const Sidebar = ({ collapsed = false }: SidebarProps) => {
    const location = useLocation();
    const { data: user } = useGetCurrentUserQuery();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    const menuItems = [
        // { name: 'Dashboard', icon: <BarChart3 size={20} />, href: '/dashboard' },
        { name: 'Calendar', icon: <Calendar size={20} />, href: '/calendar' },
        { name: 'Events', icon: <CalendarDays size={20} />, href: '/events' },
    ];

    const adminItems = [
        { name: 'Admin Panel', icon: <Shield size={20} />, href: '/admin/shery-events' },
    ];

    return (
        <aside
            className={`hidden lg:block  border-border-light transition-all duration-300
                dark:border-border-dark bg-bg-light/50 dark:bg-bg-dark/50 border-r
                ${collapsed ? 'w-14 overflow-hidden' : 'w-16 lg:w-56'}`}
        >
            <div className="p-2 flex flex-col h-full justify-between">
                {/* Placeholder for future sidebar content */}
                <div className="hidden lg:block text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {/* Menu items will go here */}
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                title={item.name}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors
                                    ${isActive
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                        : 'hover:bg-gray-200 dark:hover:bg-surface-dark/70 text-text-light dark:text-text-dark'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                    }`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Admin items - only show for ADMIN and SUPER_ADMIN */}
                    {isAdmin && (
                        <>
                            <div className="my-2 border-t border-gray-300 dark:border-gray-600" />
                            {adminItems.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        title={item.name}
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors
                                            ${isActive
                                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                                : 'hover:bg-gray-200 dark:hover:bg-surface-dark/70 text-text-light dark:text-text-dark'
                                            }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                            }`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Calendar List - only show when not collapsed */}
                {!collapsed && <CalendarList />}
            </div>
        </aside>
    );
};
