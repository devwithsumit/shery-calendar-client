import { useState } from 'react';
import {
    useGetSheryEventsQuery,
    useCreateSheryEventMutation,
    useUpdateSheryEventMutation,
    useDeleteSheryEventMutation,
} from '@/api/sheryEventApi';
import type { SheryEvent, SheryEventRequest } from '@/types/sheryEvent';
import { EventFormModal } from '../components/EventFormModal';
import { EventFilters } from '../components/EventFilters';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { SearchField, Button } from '@/components/ui';

export const SheryEventsManagement = () => {
    const { data: user } = useGetCurrentUserQuery();
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const [filterParams, setFilterParams] = useState<{ startTime?: string; endTime?: string }>({});
    const { data: events, isLoading } = useGetSheryEventsQuery(filterParams);
    const [createEvent, { isLoading: isCreating }] = useCreateSheryEventMutation();
    const [updateEvent, { isLoading: isUpdating }] = useUpdateSheryEventMutation();
    const [deleteEvent] = useDeleteSheryEventMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<SheryEvent | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCreate = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (event: SheryEvent) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = async (eventId: number) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(eventId).unwrap();
            } catch (error) {
                console.error('Failed to delete event:', error);
            }
        }
    };

    const handleSubmit = async (eventData: SheryEventRequest) => {
        try {
            if (editingEvent) {
                await updateEvent({ id: editingEvent.id, data: eventData }).unwrap();
            } else {
                await createEvent(eventData).unwrap();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save event:', error);
        }
    };

    const handleFilterChange = (startTime?: string, endTime?: string) => {
        setFilterParams({ startTime, endTime });
    };

    const handleClearFilters = () => {
        setFilterParams({});
    };

    const filteredEvents = events?.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.createdByName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg text-text-light dark:text-text-dark">Loading events...</div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex gap-3 flex-wrap items-center">
                <div className="flex-1 min-w-62.5">
                    <SearchField
                        onClear={() => setSearchQuery('')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.toString())}
                    />
                </div>
                <Button onClick={handleCreate} size="md">
                    Create Event
                </Button>
            </div>

            <div className="mb-4">
                <EventFilters
                    onFilterChange={handleFilterChange}
                    onClear={handleClearFilters}
                />
            </div>

            <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-lg border border-border-light dark:border-border-dark overflow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-bg-light/50 dark:bg-bg-dark/50 border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Start Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    End Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Created By
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light/50 dark:divide-border-dark/50">
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-text-muted-light dark:text-text-muted-dark">
                                        No events found
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap max-w-45">
                                            <div className="text-sm font-medium truncate text-text-light dark:text-text-dark">{event.title}</div>
                                            {event.description && (
                                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark truncate max-w-xs">
                                                    {event.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                            {event.isAllDay ? (
                                                'All Day'
                                            ) : (
                                                new Date(event.startTime).toLocaleString()
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                            {event.isAllDay ? (
                                                'All Day'
                                            ) : (
                                                new Date(event.endTime).toLocaleString()
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-40 truncate whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                            {event.location || '-'}
                                        </td>
                                        <td className="px-6 py-4 max-w-30 truncate whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                            {event.createdByName || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleEdit(event)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                                {isSuperAdmin && (
                                                    <Button
                                                        onClick={() => handleDelete(event.id)}
                                                        variant="danger"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <EventFormModal
                    event={editingEvent}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    isLoading={editingEvent ? isUpdating : isCreating}
                />
            )}
        </>
    );
};