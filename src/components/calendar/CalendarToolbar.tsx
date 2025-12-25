import { Button, Select } from '@/components/ui';
import type { View } from 'react-big-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarSearch } from './CalendarSearch';
import type { CalendarEvent } from '@/types/calendar';

type CalendarView = View | 'year';

interface CalendarToolbarProps {
    date: Date;
    view: CalendarView;
    onViewChange: (view: CalendarView) => void;
    onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
    onAddEvent: () => void;
    events: CalendarEvent[];
    onEventSelect: (event: CalendarEvent) => void;
}

const viewOptions = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
];

export const CalendarToolbar = ({
    date,
    view,
    onViewChange,
    onNavigate,
    events,
    onEventSelect,
}: CalendarToolbarProps) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Left: Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')}>
                    Today
                </Button>
                <div className="flex items-center">
                    <button
                        onClick={() => onNavigate('PREV')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-200/30 rounded-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onNavigate('NEXT')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-200/30 rounded-lg"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <h2 className="sm:text-lg font-semibold ml-2">
                    {view === 'year' ? format(date, 'yyyy') : format(date, 'MMMM yyyy')}
                </h2>
            </div>


            {/* Right: View Toggle */}
            <div className="flex items-center gap-3">
                {/* Center: Search (separate row on mobile) */}
                <div className="w-full sm:w-auto order-last sm:order-0">
                    <CalendarSearch events={events} onEventSelect={onEventSelect} />
                </div>
                <Select
                    options={viewOptions}
                    value={view}
                    onChange={(e) => onViewChange(e.target.value as CalendarView)}
                    className="w-24!"
                />
                {/* <Button onClick={onAddEvent} size="md">
                    <Plus className="w-4 h-4 mr-1" /> Add Event
                </Button> */}
            </div>
        </div>
    );
};
