import { useMemo, useState } from 'react';
import { parseISO, startOfDay } from 'date-fns';
import { useMergedCalendarEvents } from '@/hooks/useMergedCalendarEvents';
import { EventGroup } from '@/components/events';
import { ViewEventModal } from '@/components/calendar';
import type { CalendarEvent } from '@/types/calendar';
import { Calendar, Filter } from 'lucide-react';

export const EventsListing = () => {
    const { events, isLoading } = useMergedCalendarEvents();
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Group events by date
    const groupedEvents = useMemo(() => {
        if (!events) return [];

        const groups = new Map<string, CalendarEvent[]>();

        events.forEach(event => {
            const date = startOfDay(parseISO(event.startDateTime));
            const dateKey = date.toISOString();

            if (!groups.has(dateKey)) {
                groups.set(dateKey, []);
            }
            groups.get(dateKey)!.push(event);
        });

        // Convert to array and sort by date
        return Array.from(groups.entries())
            .map(([dateKey, events]) => ({
                date: parseISO(dateKey),
                events: events.sort((a, b) =>
                    new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
                ),
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [events]);

    if (isLoading) {
        return <EventsListingSkeleton />;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto overflow-y-auto h-[calc(100vh-70px)]">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl 
                        flex items-center justify-center">
                        <Calendar className="text-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">
                            Schedule
                        </h1>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            {events?.length || 0} events scheduled
                        </p>
                    </div>
                </div>

                {/* Future: Add filters */}
                {/* <button className="p-2 rounded-lg border border-border-light dark:border-border-dark
                    hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors">
                    <Filter size={20} className="text-text-muted-light dark:text-text-muted-dark" />
                </button> */}
            </div>

            {/* Events list */}
            <div className="backdrop-blur-[10px] bg-surface-light/50 dark:bg-surface-dark/50 
                rounded-xl border border-border-light dark:border-border-dark p-4 md:p-6">
                {groupedEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto mb-4 text-text-muted-light 
                            dark:text-text-muted-dark opacity-50" />
                        <p className="text-text-muted-light dark:text-text-muted-dark">
                            No events found
                        </p>
                    </div>
                ) : (
                    <div>
                        {groupedEvents.map(({ date, events }) => (
                            <EventGroup
                                key={date.toISOString()}
                                date={date}
                                events={events}
                                onEventClick={setSelectedEvent}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* View Event Modal */}
            {selectedEvent && (
                <ViewEventModal
                    isOpen
                    onClose={() => setSelectedEvent(null)}
                    event={selectedEvent}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    isDeleting={false}
                />
            )}
        </div>
    );
};

const EventsListingSkeleton = () => (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-pulse">
        <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200/50 dark:bg-surface-dark/30 rounded-xl" />
            <div>
                <div className="h-8 w-32 bg-gray-200/50 dark:bg-surface-dark/30 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-200/50 dark:bg-surface-dark/30 rounded" />
            </div>
        </div>
        <div className="backdrop-blur-[10px] bg-surface-light/50 dark:bg-surface-dark/50 
            rounded-xl border border-border-light dark:border-border-dark p-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 mb-6">
                    <div className="w-20 h-16 bg-gray-200/50 dark:bg-surface-dark/30 rounded" />
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200/50 dark:bg-surface-dark/30 rounded w-3/4" />
                        <div className="h-3 bg-gray-200/50 dark:bg-surface-dark/30 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default EventsListing;