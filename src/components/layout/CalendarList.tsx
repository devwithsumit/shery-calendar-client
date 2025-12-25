import { useEffect } from 'react';
import { useGetCalendarsQuery } from '@/api/calendarApi';
import { useGetAppCalendarsQuery } from '@/api/appEventApi';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { toggleCalendar, setEnabledCalendars, toggleSheryEvents, toggleAppCalendar, setEnabledAppCalendars } from '@/store/calendarSlice';
import type { Calendar, AppCalendar } from '@/types/calendar';
import { Calendar as CalendarIcon, Building2, User } from 'lucide-react';
import { Checkbox } from '@/components/ui';

export const CalendarList = () => {
    const { data: googleCalendars = [], isLoading: googleLoading } = useGetCalendarsQuery();
    const { data: appCalendars = [], isLoading: appLoading } = useGetAppCalendarsQuery();
    const { enabledCalendarIds, enabledAppCalendarIds = [], firstLoad, showSheryEvents } = useAppSelector(state => state.calendar);
    const dispatch = useAppDispatch();

    // Initialize Google calendars as enabled on first load
    useEffect(() => {
        if (googleCalendars.length > 0 && enabledCalendarIds.length === 0 && firstLoad) {
            dispatch(setEnabledCalendars(googleCalendars.map(c => c.calendarId)));
        }
    }, [googleCalendars, enabledCalendarIds.length, dispatch, firstLoad]);

    // Initialize app calendars as enabled on first load
    useEffect(() => {
        if (appCalendars.length > 0 && enabledAppCalendarIds.length === 0 && firstLoad) {
            dispatch(setEnabledAppCalendars(appCalendars.map(c => c.id)));
        }
    }, [appCalendars, enabledAppCalendarIds?.length, dispatch]);

    const isGoogleCalendarEnabled = (calendarId: string) => {
        if (enabledCalendarIds.length === 0) return false;
        return enabledCalendarIds.includes(calendarId);
    };

    const isAppCalendarEnabled = (calendarId: number) => {
        if (!enabledAppCalendarIds || enabledAppCalendarIds.length === 0) return false;
        return enabledAppCalendarIds.includes(calendarId);
    };

    const handleGoogleToggle = (calendarId: string) => {
        dispatch(toggleCalendar(calendarId));
    };

    const handleAppCalendarToggle = (calendarId: number) => {
        dispatch(toggleAppCalendar(calendarId));
    };

    const isLoading = googleLoading || appLoading;

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                        Calendars
                    </span>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 bg-gray-200/50 dark:bg-surface-dark/30 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    // Separate app calendars by type
    const personalCalendars = appCalendars.filter(c => c.type === 'PERSONAL');
    const sheryCalendars = appCalendars.filter(c => c.type === 'SHERY');

    return (
        <div>
            {/* My Calendars Section - Personal + Shery Events toggle */}
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                        My Calendars
                    </span>
                </div>

                {/* Personal Calendars */}
                <div className="space-y-1 mb-2">
                    {personalCalendars.map((calendar: AppCalendar) => {
                        const isEnabled = isAppCalendarEnabled(calendar.id);
                        const bgColor = calendar.backgroundColor || '#10b981';

                        return (
                            <label
                                key={`app-${calendar.id}`}
                                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer
                                hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 
                                transition-colors group"
                            >
                                <Checkbox
                                    bgColor={bgColor}
                                    checked={isEnabled}
                                    onChange={() => handleAppCalendarToggle(calendar.id)}
                                />
                                <User size={14} className="text-green-600 dark:text-green-400" />
                                <span className={`text-sm truncate flex-1 ${isEnabled
                                    ? 'text-text-light dark:text-text-dark'
                                    : 'text-text-muted-light dark:text-text-muted-dark opacity-60'
                                    }`}>
                                    {calendar.name}
                                </span>
                            </label>
                        );
                    })}
                </div>

                {/* Shery Events Toggle */}
                <div className="space-y-1">
                    <label
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer
                        hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 
                        transition-colors group"
                    >
                        <Checkbox
                            // bgColor={'#2563eb'}
                            checked={showSheryEvents}
                            onChange={() => dispatch(toggleSheryEvents())}
                        />
                        <Building2 size={14} className="text-blue-600 dark:text-blue-400" />
                        <span className={`text-sm truncate flex-1 ${showSheryEvents
                            ? 'text-text-light dark:text-text-dark'
                            : 'text-text-muted-light dark:text-text-muted-dark opacity-60'
                            }`}>
                            Shery Events
                        </span>
                    </label>
                </div>

                {/* Shery Calendars (admin only) */}
                {sheryCalendars.length > 0 && (
                    <div className="space-y-1 mt-2">
                        {sheryCalendars.map((calendar: AppCalendar) => {
                            const isEnabled = isAppCalendarEnabled(calendar.id);
                            const bgColor = calendar.backgroundColor || '#3b82f6';

                            return (
                                <label
                                    key={`app-${calendar.id}`}
                                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer
                                    hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 
                                    transition-colors group"
                                >
                                    <Checkbox
                                        bgColor={bgColor}
                                        checked={isEnabled}
                                        onChange={() => handleAppCalendarToggle(calendar.id)}
                                    />
                                    <Building2 size={14} className="text-blue-600 dark:text-blue-400" />
                                    <span className={`text-sm truncate flex-1 ${isEnabled
                                        ? 'text-text-light dark:text-text-dark'
                                        : 'text-text-muted-light dark:text-text-muted-dark opacity-60'
                                        }`}>
                                        {calendar.name}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Google Calendars Section */}
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                        Other Calendars
                    </span>
                </div>

                <div className="space-y-1">
                    {googleCalendars.map((calendar: Calendar) => {
                        const isEnabled = isGoogleCalendarEnabled(calendar.calendarId);
                        const bgColor = calendar.backgroundColor || '#25cfa6';

                        return (
                            <label
                                key={calendar.calendarId}
                                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer
                                hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 
                                transition-colors group"
                            >
                                <Checkbox
                                    bgColor={bgColor}
                                    checked={isEnabled}
                                    onChange={() => handleGoogleToggle(calendar.calendarId)}
                                />

                                {/* Calendar color indicator */}
                                {/* <div
                                className="w-3 h-3 rounded-sm shrink-0"
                                style={{ backgroundColor: bgColor }}
                            /> */}

                                {/* Calendar name */}
                                <span className={`text-sm truncate flex-1 ${isEnabled
                                    ? 'text-text-light dark:text-text-dark'
                                    : 'text-text-muted-light dark:text-text-muted-dark opacity-60'
                                    }
                                ${calendar.primary ? 'underline decoration-[0.8px] decoration-primary underline-offset-2' : ''
                                    }
                                `}>
                                    {calendar.summary}
                                    {calendar.primary && (
                                        <span className="ml-1 text-xs text-primary">(Primary)</span>
                                    )}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
