import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { Filter, X } from 'lucide-react';

interface EventFiltersProps {
    onFilterChange: (startTime?: string, endTime?: string) => void;
    onClear: () => void;
}

export const EventFilters = ({ onFilterChange, onClear }: EventFiltersProps) => {
    const [showFilters, setShowFilters] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isUpcoming, setIsUpcoming] = useState(false);

    const handleApplyFilters = () => {
        const start = startDate ? `${startDate}T00:00:00` : undefined;
        const end = endDate ? `${endDate}T23:59:59` : undefined;
        onFilterChange(start, end);
    };

    const handleClearFilters = () => {
        setStartDate('');
        setEndDate('');
        onClear();
    };

    const handleUpcoming = () => {
        if (isUpcoming) {
            handleClearFilters();
            setIsUpcoming(false);
            return;
        }
        const now = new Date().toISOString();
        setIsUpcoming(true);
        onFilterChange(now, undefined);
    };

    return (
        <div className="space-y-3">
            <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
            >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {showFilters && (
                <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark space-y-3">
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={handleUpcoming} size="sm" variant={'outline'}
                            className={isUpcoming ? 'border-primary dark:border-primary' : ''}>
                            Upcoming Events
                        </Button>
                        <Button onClick={handleClearFilters} size="sm" variant="outline">
                            <X className="w-4 h-4 mr-1" />
                            Clear Filters
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <Button onClick={handleApplyFilters} size="sm" className="w-full">
                        Apply Date Range
                    </Button>
                </div>
            )}
        </div>
    );
};
