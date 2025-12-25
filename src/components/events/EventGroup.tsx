import { format, isSameDay } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';
import { EventCard } from './EventCard';

interface EventGroupProps {
    date: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
}

export const EventGroup = ({ date, events, onEventClick }: EventGroupProps) => {
    const isToday = isSameDay(date, new Date());

    return (
        <div className="flex gap-4 mb-4">
            {/* Date column */}
            <div className="w-20 flex-shrink-0 text-right pt-3">
                <div className={`inline-flex flex-col items-center ${isToday ? 'text-primary' : ''}`}>
                    <span className={`text-3xl font-semibold ${
                        isToday 
                            ? 'text-white bg-primary rounded-full w-12 h-12 flex items-center justify-center' 
                            : 'text-text-light dark:text-text-dark'
                    }`}>
                        {format(date, 'd')}
                    </span>
                    <span className="text-xs uppercase tracking-wide mt-1 text-text-muted-light 
                        dark:text-text-muted-dark">
                        {format(date, 'EEE')}
                    </span>
                </div>
            </div>

            {/* Events column */}
            <div className="flex-1 border-l border-border-light dark:border-border-dark pl-4">
                {events.length === 0 ? (
                    <div className="text-text-muted-light dark:text-text-muted-dark 
                        text-sm italic py-4">
                        No events scheduled
                    </div>
                ) : (
                    <div className="space-y-2">
                        {events.map(event => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                onClick={onEventClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
