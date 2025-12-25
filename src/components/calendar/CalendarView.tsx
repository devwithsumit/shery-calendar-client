import { useState, useMemo, useEffect, useCallback } from 'react';
import type { View } from 'react-big-calendar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isToday } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { CalendarEvent } from '@/types/calendar';
import { toCalendarEvent, getEventStyle } from './utils';
import { MobileWeekHeader, MobileDayTimeline } from './MobileWeekView';
import { YearView } from './YearView';
import { useCalendarColors } from '@/hooks/useCalendarColors';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';
import '@/styles/calendar-week.css';
import '@/styles/calendar-events.css';

export type { CalendarView as CalendarViewType };

type CalendarView = View | 'year';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Custom week header component for desktop
const CustomWeekHeader = ({ date }: { date: Date }) => {
    const dayName = format(date, 'EEE');
    const dayNumber = format(date, 'd');
    const isTodayDate = isToday(date);

    return (
        <div className="week-header-custom">
            <span className="week-header-day">{dayName}</span>
            <span className={`week-header-date ${isTodayDate ? 'today' : ''}`}>
                {dayNumber}
            </span>
        </div>
    );
};

interface CalendarViewProps {
    events: CalendarEvent[];
    view: CalendarView;
    date: Date;
    onViewChange: (view: CalendarView) => void;
    onDateChange: (date: Date) => void;
    onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
    onSelectEvent: (event: CalendarEvent) => void;
}

export const CalendarView = ({
    events,
    view,
    date,
    onViewChange,
    onDateChange,
    onSelectSlot,
    onSelectEvent,
}: CalendarViewProps) => {
    const { calendarColorMap, primaryCalendarId } = useCalendarColors();
    const calendarEvents = useMemo(() => events.map(event => toCalendarEvent(event, primaryCalendarId)), [events, primaryCalendarId]);
    const [selectedMobileDate, setSelectedMobileDate] = useState(date);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth < 640
    );

    const eventStyleGetter = useCallback((event: any) => {
        return getEventStyle(event, calendarColorMap);
    }, [calendarColorMap]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle year view
    if (view === 'year') {
        return (
            <YearView
                date={date}
                events={events}
                onSelectDate={onDateChange}
                onSelectEvent={onSelectEvent}
            />
        );
    }

    if (view === 'week' && isMobile) {
        return (
            <div className="h-[calc(100vh-200px)] min-h-125 calendar-wrapper mobile-week-view relative
                backdrop-blur-xl bg-bg-light/5 z-10 rounded-lg overflow-hidden">
                <MobileWeekHeader
                    currentDate={date}
                    selectedDate={selectedMobileDate}
                    onSelectDate={setSelectedMobileDate}
                />
                <MobileDayTimeline
                    date={selectedMobileDate}
                    events={events}
                    onSelectSlot={onSelectSlot}
                    onSelectEvent={onSelectEvent}
                />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-200px)] min-h-125 calendar-wrapper relative
            backdrop-blur-[10px] bg-bg-light/3 z-10 rounded-lg">
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                view={view}
                views={['month', 'week']}
                date={date}
                onView={onViewChange}
                onNavigate={onDateChange}
                selectable
                onSelectSlot={onSelectSlot}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => onSelectEvent(event.resource)}
                popup
                style={{ height: '100%' }}
                components={{ week: { header: CustomWeekHeader } }}
            />
        </div>
    );
};
