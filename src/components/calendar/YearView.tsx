import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';
import { useCalendarColors } from '@/hooks/useCalendarColors';

interface YearViewProps {
    date: Date;
    events: CalendarEvent[];
    onSelectDate: (date: Date) => void;
    onSelectEvent: (event: CalendarEvent) => void;
}

export const YearView = ({ date, events, onSelectDate }: YearViewProps) => {
    const { getCalendarColor } = useCalendarColors();
    const year = date.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    const getEventsForDate = (day: Date) => {
        return events.filter(event => {
            const eventStart = new Date(event.startDateTime);
            return isSameDay(eventStart, day);
        });
    };

    const renderMonth = (monthDate: Date) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = endOfWeek(monthEnd);
        const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

        return (
            <div key={monthDate.getMonth()} className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-lg p-3 border border-border-light dark:border-border-dark">
                <h3 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2 text-center">
                    {format(monthDate, 'MMMM')}
                </h3>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-xs text-center text-text-muted-light dark:text-text-muted-dark font-medium">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                        const dayEvents = getEventsForDate(day);
                        const isCurrentMonth = isSameMonth(day, monthDate);
                        const isTodayDate = isToday(day);
                        const hasEvents = dayEvents.length > 0;

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => onSelectDate(day)}
                                className={`
                                    relative aspect-square text-xs rounded flex flex-col items-center justify-center
                                    transition-all duration-200
                                    ${isCurrentMonth
                                        ? 'text-text-light dark:text-text-dark hover:bg-primary/10'
                                        : 'text-text-muted-light/40 dark:text-text-muted-dark/40'
                                    }
                                    ${isTodayDate ? 'bg-primary text-white font-bold hover:bg-primary' : ''}
                                `}
                            >
                                <span className="z-10">{format(day, 'd')}</span>
                                {hasEvents && isCurrentMonth && (
                                    <div className="absolute bottom-0.5 flex gap-0.5">
                                        {dayEvents.slice(0, 3).map((event, i) => (
                                            <div
                                                key={i}
                                                className="w-1 h-1 rounded-full"
                                                style={{ backgroundColor: getCalendarColor(event.calendarId) }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-200px)] min-h-125 overflow-y-auto p-4 
            backdrop-blur-[10px] bg-bg-light/0 rounded-lg">
            {/* <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4 text-center">
                {year}
            </h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {months.map(renderMonth)}
            </div>
        </div>
    );
};
