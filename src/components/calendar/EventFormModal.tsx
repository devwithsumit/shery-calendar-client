import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Checkbox, Button } from '@/components/ui';
import { formatDateForAllDay, formatDateForAllDayEnd, formatDateTimeLocal, getUserTimeZone } from './utils';
import type { CreateEventRequest } from '@/types/calendar';
import { addHours, isFuture, isToday } from 'date-fns';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { Calendar, Building2, CalendarDays } from 'lucide-react';

type CalendarType = 'personal' | 'sage' | 'google';

interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateEventRequest, calendarType: CalendarType) => void;
    isLoading?: boolean;
    initialStart?: Date;
    initialEnd?: Date;
    isAllDay?: boolean;
}

export const EventFormModal = ({ isOpen, onClose, onSubmit, isLoading, initialStart, initialEnd, isAllDay = true }: EventFormModalProps) => {
    const { data: user } = useGetCurrentUserQuery();
    const timeZone = getUserTimeZone();
    const [showTime, setShowTime] = useState(!isAllDay);
    const [formData, setFormData] = useState(() => getInitialFormData(initialStart, initialEnd, isAllDay));
    const [selectedCalendar, setSelectedCalendar] = useState<CalendarType>('personal');

    const canUseSheryCalendar = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    const canUseGoogleCalendar = initialStart && (isToday(initialStart) || isFuture(initialStart));

    useEffect(() => {
        if (initialStart) {
            setShowTime(!isAllDay);
            setFormData(getInitialFormData(initialStart, initialEnd, isAllDay));
            setSelectedCalendar('personal'); // Reset to default
        }
    }, [initialStart, initialEnd, isAllDay]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, timeZone }, selectedCalendar);
    };

    const getCalendarLabel = () => {
        switch (selectedCalendar) {
            case 'personal': return 'This event will be added to your Personal calendar';
            case 'sage': return 'This event will be added to Sage Events';
            case 'google': return 'This event will be added to Google Calendar';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Event" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Calendar Selector */}
                <div className="space-y-2">
                    {/* <label className="text-sm font-medium text-text-light dark:text-text-dark">Add to calendar</label> */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() => setSelectedCalendar('personal')}
                            className={`flex text-sm items-center gap-2 px-4 py-1.5 rounded-lg border transition-all ${selectedCalendar === 'personal'
                                ? 'bg-surface-light/0 text-white border-primary'
                                : 'bg-surface-light/50 dark:bg-surface-dark/50 border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary'
                                }`}
                        >
                            <Calendar size={16} />
                            Personal
                        </button>

                        {canUseSheryCalendar && (
                            <button
                                type="button"
                                onClick={() => setSelectedCalendar('sage')}
                                className={`flex text-sm items-center gap-2 px-4 py-1.5 rounded-lg border transition-all ${selectedCalendar === 'sage'
                                    ? 'bg-surface-light/0 text-white border-primary'
                                    : 'bg-surface-light/50 dark:bg-surface-dark/50 border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary'
                                    }`}
                            >
                                <Building2 size={16} />
                                Sage Events
                            </button>
                        )}

                        {canUseGoogleCalendar && (
                            <button
                                type="button"
                                onClick={() => setSelectedCalendar('google')}
                                className={`flex text-sm items-center gap-2 px-4 py-1.5 rounded-lg border transition-all ${selectedCalendar === 'google'
                                    ? 'bg-surface-light/0 text-white border-primary'
                                    : 'bg-surface-light/50 dark:bg-surface-dark/50 border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary'
                                    }`}
                            >
                                <CalendarDays size={16} />
                                Google
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{getCalendarLabel()}</p>
                </div>

                <Input label="Title" name="summary" value={formData.summary} onChange={handleChange} placeholder="Event title" required />
                <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={2} placeholder="Optional" />

                {!showTime && (
                    <button type="button" onClick={() => setShowTime(true)} className="text-sm text-primary hover:underline">
                        + Add time
                    </button>
                )}

                {showTime && (
                    <div className="grid sm:grid-cols-2 gap-3">
                        <Input label="Start" type="datetime-local" name="startDateTime" value={formData.startDateTime} onChange={handleChange} required />
                        <Input label="End" type="datetime-local" name="endDateTime" value={formData.endDateTime} onChange={handleChange} required />
                    </div>
                )}

                <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Optional" />

                {selectedCalendar === 'google' && (
                    <Checkbox label="Create Google Meet link" name="createMeetLink" variant='basic' checked={formData.createMeetLink} onChange={handleChange} />
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button type="submit" size="sm" isLoading={isLoading}>Create</Button>
                </div>
            </form>
        </Modal>
    );
};

function getInitialFormData(start?: Date, end?: Date, isAllDay?: boolean) {
    if (!start) return { summary: '', description: '', startDateTime: '', endDateTime: '', location: '', createMeetLink: false };

    if (isAllDay) {
        return { summary: '', description: '', startDateTime: formatDateForAllDay(start), endDateTime: formatDateForAllDayEnd(start), location: '', createMeetLink: false };
    }

    const endTime = end || addHours(start, 1);
    return { summary: '', description: '', startDateTime: formatDateTimeLocal(start), endDateTime: formatDateTimeLocal(endTime), location: '', createMeetLink: false };
}
