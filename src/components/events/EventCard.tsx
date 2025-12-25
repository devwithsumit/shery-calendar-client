import { format } from 'date-fns';
import { Clock, MapPin, Video, ExternalLink } from 'lucide-react';
import type { CalendarEvent } from '@/types/calendar';
import { useCalendarColors } from '@/hooks/useCalendarColors';

interface EventCardProps {
    event: CalendarEvent;
    onClick: (event: CalendarEvent) => void;
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
    const { getCalendarColor } = useCalendarColors();
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    const isAllDay = event.startDateTime.includes('00:00:00') && event.endDateTime.includes('23:59:59');
    
    const timeDisplay = isAllDay 
        ? 'All day' 
        : `${format(startDate, 'h:mm a')} – ${format(endDate, 'h:mm a')}`;

    const calendarColor = getCalendarColor(event.calendarId);

    return (
        <div 
            onClick={() => onClick(event)}
            className="group flex items-start gap-3 p-3 rounded-lg cursor-pointer
                hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 
                transition-all duration-200 border border-transparent
                hover:border-border-light dark:hover:border-border-dark"
        >
            {/* Color indicator */}
            <div 
                className="w-1 h-14 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: calendarColor }}
            />
            
            <div className="flex-1 min-w-0">
                {/* Event title */}
                <h3 className="font-medium text-text-light dark:text-text-dark mb-1 
                    group-hover:text-primary transition-colors truncate">
                    {event.summary}
                </h3>
                
                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-text-muted-light 
                    dark:text-text-muted-dark mb-1">
                    <Clock size={14} />
                    <span>{timeDisplay}</span>
                </div>

                {/* Location */}
                {event.location && (
                    <div className="flex items-center gap-2 text-sm text-text-muted-light 
                        dark:text-text-muted-dark mb-1">
                        <MapPin size={14} />
                        <span className="truncate">{event.location}</span>
                    </div>
                )}

                {/* Meet link */}
                {event.meetLink && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Video size={14} />
                        <span className="truncate">Google Meet</span>
                    </div>
                )}

                {/* Description preview */}
                {event.description && (
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark 
                        mt-2 line-clamp-2">
                        {event.description}
                    </p>
                )}
            </div>

            {/* External link icon */}
            {event.htmlLink && (
                <a 
                    href={event.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity
                        text-text-muted-light dark:text-text-muted-dark 
                        hover:text-primary dark:hover:text-primary"
                >
                    <ExternalLink size={16} />
                </a>
            )}
        </div>
    );
};
