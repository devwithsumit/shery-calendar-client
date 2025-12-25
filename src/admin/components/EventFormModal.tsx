import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Button, Checkbox } from '@/components/ui';
import type { SheryEvent, SheryEventRequest } from '@/types/sheryEvent';

interface EventFormModalProps {
    event: SheryEvent | null;
    onClose: () => void;
    onSubmit: (event: SheryEventRequest) => void;
    isLoading?: boolean;
}

export const EventFormModal = ({ event, onClose, onSubmit, isLoading }: EventFormModalProps) => {
    const [formData, setFormData] = useState<SheryEventRequest>({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        isAllDay: false,
        location: '',
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description || '',
                startTime: event.startTime,
                endTime: event.endTime,
                isAllDay: event.isAllDay,
                location: event.location || '',
            });
        }
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Attach time to dates for all-day events
        const submitData = { ...formData };
        if (formData.isAllDay) {
            submitData.startTime = `${formData.startTime.split('T')[0]}T00:00:00`;
            submitData.endTime = `${formData.endTime.split('T')[0]}T23:59:59`;
        }
        
        onSubmit(submitData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <Modal 
            isOpen={true} 
            onClose={onClose} 
            title={event ? 'Edit Event' : 'Create Event'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                    label="Title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Event title"
                    required 
                />
                
                <Textarea 
                    label="Description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={3}
                    placeholder="Optional"
                />

                <Input 
                    label="Location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="Optional"
                />

                <Checkbox 
                    label="All Day Event" 
                    name="isAllDay" 
                    variant="basic"
                    checked={formData.isAllDay} 
                    onChange={handleChange} 
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input 
                        label="Start Time" 
                        type={formData.isAllDay ? 'date' : 'datetime-local'}
                        name="startTime" 
                        value={
                            formData.isAllDay
                                ? formData.startTime.split('T')[0]
                                : formData.startTime
                        }
                        onChange={handleChange} 
                        required 
                    />
                    
                    <Input 
                        label="End Time" 
                        type={formData.isAllDay ? 'date' : 'datetime-local'}
                        name="endTime" 
                        value={
                            formData.isAllDay
                                ? formData.endTime.split('T')[0]
                                : formData.endTime
                        }
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" isLoading={isLoading}>
                        {event ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
