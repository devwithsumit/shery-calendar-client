import { format, startOfWeek, isToday, isSameDay, addDays } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';

// Mobile iOS-style week header component
interface MobileWeekHeaderProps {
    currentDate: Date;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export const MobileWeekHeader = ({ currentDate, selectedDate, onSelectDate }: MobileWeekHeaderProps) => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="mobile-week-header">
            <div className="mobile-week-days">
                {dayLetters.map((letter, idx) => (
                    <span key={idx} className="mobile-day-letter">{letter}</span>
                ))}
            </div>
            <div className="mobile-week-dates">
                {weekDays.map((day, idx) => {
                    const isTodayDate = isToday(day);
                    const isSelected = isSameDay(day, selectedDate);
                    return (
                        <button
                            key={idx}
                            className={`mobile-date-btn ${isTodayDate ? 'is-today' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelectDate(day)}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Mobile day timeline component
interface MobileDayTimelineProps {
    date: Date;
    events: CalendarEvent[];
    onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
    onSelectEvent: (event: CalendarEvent) => void;
}

export const MobileDayTimeline = ({ date, events, onSelectSlot, onSelectEvent }: MobileDayTimelineProps) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Filter events for the selected date
    const dayEvents = events.filter(event => {
        const eventStart = new Date(event.startDateTime);
        return isSameDay(eventStart, date);
    });

    // Get current time indicator position
    const now = new Date();
    const isCurrentDay = isSameDay(date, now);
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimePosition = currentHour * 60 + currentMinutes;

    const formatHour = (hour: number) => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return 'Noon';
        if (hour < 12) return `${hour} AM`;
        return `${hour - 12} PM`;
    };

    const handleSlotClick = (hour: number) => {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(date);
        end.setHours(hour + 1, 0, 0, 0);
        onSelectSlot({ start, end });
    };

    return (
        <div className="mobile-day-timeline">
            {isCurrentDay && (
                <div
                    className="mobile-current-time-indicator"
                    style={{ top: `${(currentTimePosition / 60) * 48}px` }}
                >
                    <span className="mobile-current-time-label">
                        {format(now, 'h:mm')}
                    </span>
                    <div className="mobile-current-time-dot" />
                    <div className="mobile-current-time-line" />
                </div>
            )}
            {hours.map(hour => {
                const hourEvents = dayEvents.filter(event => {
                    const eventStart = new Date(event.startDateTime);
                    return eventStart.getHours() === hour;
                });

                return (
                    <div
                        key={hour}
                        className="mobile-time-slot"
                        onClick={() => handleSlotClick(hour)}
                    >
                        <span className="mobile-time-label">{formatHour(hour)}</span>
                        <div className="mobile-time-slot-content">
                            {hourEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="mobile-event-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectEvent(event);
                                    }}
                                >
                                    {event.summary}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
