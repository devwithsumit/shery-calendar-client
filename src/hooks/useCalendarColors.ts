import { useGetCalendarsQuery } from '@/api/calendarApi';
import { useGetAppCalendarsQuery } from '@/api/appEventApi';
import { useMemo } from 'react';

export const useCalendarColors = () => {
    const { data: googleCalendars = [] } = useGetCalendarsQuery();
    const { data: appCalendars = [] } = useGetAppCalendarsQuery();

    const calendarColorMap = useMemo(() => {
        const map: Record<string, string> = {};

        // Add Google calendar colors
        googleCalendars.forEach(calendar => {
            map[calendar.calendarId] = calendar.backgroundColor || '#25cfa6';
        });

        // Add app-native calendar colors
        appCalendars.forEach(calendar => {
            map[`app-${calendar.id}`] = calendar.backgroundColor || '#3b82f6';
        });

        // Add Shery Events calendar color
        map['shery-events'] = '#27dfb3';

        return map;
    }, [googleCalendars, appCalendars]);

    const primaryCalendarId = useMemo(() => {
        return googleCalendars.find(cal => cal.primary)?.calendarId;
    }, [googleCalendars]);

    const getCalendarColor = (calendarId?: string) => {
        if (!calendarId) return '#25cfa6';
        return calendarColorMap[calendarId] || '#25cfa6';
    };

    return { getCalendarColor, calendarColorMap, primaryCalendarId };
};
