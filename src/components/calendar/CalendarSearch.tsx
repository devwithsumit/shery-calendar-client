import { useState, useMemo, useRef, useEffect } from 'react';
import { SearchField } from '@/components/ui';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';

interface CalendarSearchProps {
    events: CalendarEvent[];
    onEventSelect: (event: CalendarEvent) => void;
}

export const CalendarSearch = ({ events, onEventSelect }: CalendarSearchProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Filter events based on search query
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        return events.filter(event => {
            return (
                event.summary?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query) ||
                event.location?.toLowerCase().includes(query) ||
                event.creatorEmail?.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, events]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        if (showResults) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showResults]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setShowResults(value.trim().length > 0);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowResults(false);
    };

    const handleEventClick = (event: CalendarEvent) => {
        onEventSelect(event);
        setShowResults(false);
        setSearchQuery('');
    };

    const formatEventTime = (event: CalendarEvent) => {
        const start = new Date(event.startDateTime);
        const isAllDay = event.startDateTime.includes('00:00:00') && event.endDateTime.includes('23:59:59');
        
        if (isAllDay) {
            return format(start, 'MMM d, yyyy');
        }
        return format(start, 'MMM d, yyyy · h:mm a');
    };

    return (
        <div className="relative w-full sm:w-64 md:w-80" ref={searchRef}>
            <SearchField
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
                placeholder="Search events..."
                className="w-full"
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2
                    bg-surface-light dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    rounded-lg shadow-lg
                    max-h-96 overflow-y-auto
                    animate-in fade-in slide-in-from-top-2 duration-200">
                    {searchResults.map((event) => (
                        <button
                            key={event.id}
                            type="button"
                            onClick={() => handleEventClick(event)}
                            className="
                                w-full px-4 py-3 text-left
                                hover:bg-surface-light/60 dark:hover:bg-surface-dark/60
                                transition-colors duration-150
                                border-b border-border-light dark:border-border-dark
                                last:border-b-0
                            "
                        >
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-primary mt-1 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-text-light dark:text-text-dark truncate">
                                        {event.summary}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatEventTime(event)}</span>
                                    </div>
                                    {event.location && (
                                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 truncate">
                                            📍 {event.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {showResults && searchResults.length === 0 && searchQuery.trim() && (
                <div className="absolute z-50 w-full mt-2
                    bg-surface-light dark:bg-surface-dark
                    border border-border-light dark:border-border-dark
                    rounded-lg shadow-lg
                    p-4 text-center
                    animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
                        No events found for "{searchQuery}"
                    </p>
                </div>
            )}
        </div>
    );
};
