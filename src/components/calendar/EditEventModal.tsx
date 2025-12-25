import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Checkbox, Button } from '@/components/ui';
import { formatDateTimeLocal, getUserTimeZone } from './utils';
import type { CalendarEvent, UpdateEventRequest } from '@/types/calendar';

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: CalendarEvent;
    onUpdate: (data: UpdateEventRequest) => void;
    isUpdating?: boolean;
}

export const EditEventModal = ({ isOpen, onClose, event, onUpdate, isUpdating }: EditEventModalProps) => {
    const timeZone = getUserTimeZone();
    const [formData, setFormData] = useState({
        summary: event.summary || '',
        description: event.description || '',
        startDateTime: formatDateTimeLocal(new Date(event.startDateTime)),
        endDateTime: formatDateTimeLocal(new Date(event.endDateTime)),
        location: event.location || '',
        createMeetLink: !!event.meetLink,
    });

    useEffect(() => {
        setFormData({
            summary: event.summary || '',
            description: event.description || '',
            startDateTime: formatDateTimeLocal(new Date(event.startDateTime)),
            endDateTime: formatDateTimeLocal(new Date(event.endDateTime)),
            location: event.location || '',
            createMeetLink: !!event.meetLink,
        });
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({ eventId: event.id, ...formData, timeZone });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Event" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Title" name="summary" value={formData.summary} onChange={handleChange} required />
                <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={2} />
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Start" type="datetime-local" name="startDateTime" value={formData.startDateTime} onChange={handleChange} required />
                    <Input label="End" type="datetime-local" name="endDateTime" value={formData.endDateTime} onChange={handleChange} required />
                </div>
                <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
                <Checkbox variant='basic' label="Google Meet link" name="createMeetLink" checked={formData.createMeetLink} onChange={handleChange} />
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button type="submit" size="sm" isLoading={isUpdating}>Save</Button>
                </div>
            </form>
        </Modal>
    );
};
