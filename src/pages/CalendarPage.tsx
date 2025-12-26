import { useState } from 'react';
import type { View } from 'react-big-calendar';
import { addMonths, subMonths, addWeeks, subWeeks, addYears, subYears } from 'date-fns';
import { CalendarView, CalendarToolbar, EventFormModal, ViewEventModal, EditEventModal } from '@/components/calendar';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useMergedCalendarEvents } from '@/hooks/useMergedCalendarEvents';
import { useCreateAppEventMutation, useUpdateAppEventMutation, useDeleteAppEventMutation, useGetAppCalendarsQuery } from '@/api/appEventApi';
import { useCreateSheryEventMutation, useUpdateSheryEventMutation, useDeleteSheryEventMutation } from '@/api/sheryEventApi';
import type { CalendarEvent, CalendarSlotInfo, CreateEventRequest, UpdateEventRequest } from '@/types/calendar';
import toast from 'react-hot-toast';

type CalendarViewType = View | 'year';
type CalendarType = 'personal' | 'shery' | 'google';

export const CalendarPage = () => {
    const [view, setView] = useState<CalendarViewType>('month');
    const [date, setDate] = useState(new Date());
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<CalendarSlotInfo | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    // Google Calendar hooks
    const { createEvent: createGoogleEvent, updateEvent: updateGoogleEvent, deleteEvent: deleteGoogleEvent, isCreating: isCreatingGoogle, isUpdating: isUpdatingGoogle, isDeleting: isDeletingGoogle } = useCalendarEvents();

    // App-native Calendar hooks
    const [createAppEvent, { isLoading: isCreatingApp }] = useCreateAppEventMutation();
    const [updateAppEvent, { isLoading: isUpdatingApp }] = useUpdateAppEventMutation();
    const [deleteAppEvent, { isLoading: isDeletingApp }] = useDeleteAppEventMutation();

    // Shery Events hooks
    const [createSheryEvent, { isLoading: isCreatingShery }] = useCreateSheryEventMutation();
    const [updateSheryEvent, { isLoading: isUpdatingShery }] = useUpdateSheryEventMutation();
    const [deleteSheryEvent, { isLoading: isDeletingShery }] = useDeleteSheryEventMutation();

    const { data: appCalendars = [] } = useGetAppCalendarsQuery();
    const { events, isLoading } = useMergedCalendarEvents();

    const isCreating = isCreatingGoogle || isCreatingApp || isCreatingShery;
    const isUpdating = isUpdatingGoogle || isUpdatingApp || isUpdatingShery;
    const isDeleting = isDeletingGoogle || isDeletingApp || isDeletingShery;

    // Get user's personal calendar
    const personalCalendar = appCalendars.find(c => c.type === 'PERSONAL' && c.isOwner);

    const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
        if (action === 'TODAY') return setDate(new Date());

        let nav;
        if (view === 'month') {
            nav = action === 'NEXT' ? addMonths : subMonths;
        } else if (view === 'week') {
            nav = action === 'NEXT' ? addWeeks : subWeeks;
        } else {
            nav = action === 'NEXT' ? addYears : subYears;
        }

        setDate(nav(date, 1));
    };

    const handleSelectSlot = (slotInfo: CalendarSlotInfo) => {
        setSelectedSlot(slotInfo);
        setCreateModalOpen(true);
    };

    const handleCreateEvent = async (data: CreateEventRequest, calendarType: CalendarType) => {
        try {
            if (calendarType === 'google') {
                await createGoogleEvent(data);
            } else if (calendarType === 'shery') {
                await createSheryEvent({
                    title: data.summary,
                    description: data.description,
                    startTime: data.startDateTime,
                    endTime: data.endDateTime,
                    isAllDay: !data.startDateTime.includes('T'),
                    location: data.location,
                });
                toast.success('Shery event created!');
            } else {
                // Personal calendar - use user's personal calendar ID
                if (!personalCalendar) {
                    throw new Error('Personal calendar not found');
                }
                await createAppEvent({
                    calendarId: personalCalendar.id,
                    title: data.summary,
                    description: data.description,
                    startTime: data.startDateTime,
                    endTime: data.endDateTime,
                    isAllDay: !data.startDateTime.includes('T'),
                    location: data.location,
                    meetingLink: data.createMeetLink ? 'pending' : undefined,
                }).unwrap();
                toast.success('Personal event created!');
            }
            setCreateModalOpen(false);
            setSelectedSlot(null);
        } catch (error) {
            console.error('Failed to create event:', error);
            // TODO: Add toast notification
            toast.error('Failed to create event');
        }
    };

    const handleUpdateEvent = async (data: UpdateEventRequest) => {
        if (!selectedEvent) return;

        try {
            // Route to correct API based on event source
            switch (selectedEvent.source) {
                case 'GOOGLE':
                    await updateGoogleEvent(data);
                    break;

                case 'APP_PERSONAL': {
                    // Extract numeric ID from 'app-123' format
                    const numericId = parseInt(selectedEvent.id.replace('app-', ''));
                    await updateAppEvent({
                        id: numericId,
                        data: {
                            title: data.summary,
                            description: data.description,
                            startTime: data.startDateTime,
                            endTime: data.endDateTime,
                            isAllDay: !data.startDateTime.includes('T'),
                            location: data.location,
                            meetingLink: data.createMeetLink ? 'pending' : undefined,
                        }
                    }).unwrap();
                    toast.success('Personal event updated!');
                    break;
                }

                case 'SHERY': {
                    // Extract numeric ID from 'shery-123' format
                    const numericId = parseInt(selectedEvent.id.replace('shery-', ''));
                    await updateSheryEvent({
                        id: numericId,
                        data: {
                            title: data.summary,
                            description: data.description,
                            startTime: data.startDateTime,
                            endTime: data.endDateTime,
                            isAllDay: !data.startDateTime.includes('T'),
                            location: data.location,
                        }
                    }).unwrap();
                    toast.success('Shery event updated!');
                    break;
                }

                default:
                    throw new Error(`Unknown event source: ${selectedEvent.source}`);
            }

            setEditModalOpen(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error('Failed to update event:', error);
            // TODO: Add toast notification
            toast.error('Failed to update event');
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent || !confirm('Delete this event?')) return;

        try {
            // Route to correct API based on event source
            switch (selectedEvent.source) {
                case 'GOOGLE':
                    await deleteGoogleEvent(selectedEvent.id);
                    break;

                case 'APP_PERSONAL': {
                    // Extract numeric ID from 'app-123' format
                    const numericId = parseInt(selectedEvent.id.replace('app-', ''));
                    await deleteAppEvent(numericId).unwrap();
                    break;
                }

                case 'SHERY': {
                    // Extract numeric ID from 'shery-123' format
                    const numericId = parseInt(selectedEvent.id.replace('shery-', ''));
                    await deleteSheryEvent(numericId).unwrap();
                    break;
                }

                default:
                    throw new Error(`Unknown event source: ${selectedEvent.source}`);
            }

            setSelectedEvent(null);
        } catch (error) {
            console.error('Failed to delete event:', error);
            // TODO: Add toast notification
        }
    };

    const handleEditClick = () => {
        setEditModalOpen(true);
    };

    const handleSearchEventSelect = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setEditModalOpen(false);
    };

    if (isLoading) return <CalendarSkeleton />;

    const isAllDaySlot = view === 'month';

    return (
        <div className="p-4 md:p-6">

            <CalendarToolbar date={date} view={view} onViewChange={setView} onNavigate={handleNavigate} onAddEvent={() => setCreateModalOpen(true)}
                events={events}
                onEventSelect={handleSearchEventSelect} />
            <CalendarView events={events} view={view} date={date} onViewChange={setView} onDateChange={setDate} onSelectSlot={handleSelectSlot} onSelectEvent={setSelectedEvent} />

            <EventFormModal isOpen={createModalOpen} onClose={() => { setCreateModalOpen(false); setSelectedSlot(null); }} onSubmit={handleCreateEvent} isLoading={isCreating} initialStart={selectedSlot?.start} initialEnd={selectedSlot?.end} isAllDay={isAllDaySlot} />

            {selectedEvent && !editModalOpen && (
                <ViewEventModal isOpen onClose={() => setSelectedEvent(null)} event={selectedEvent} onEdit={handleEditClick} onDelete={handleDeleteEvent} isDeleting={isDeleting} />
            )}

            {selectedEvent && editModalOpen && (
                <EditEventModal isOpen onClose={() => setEditModalOpen(false)} event={selectedEvent} onUpdate={handleUpdateEvent} isUpdating={isUpdating} />
            )}
        </div>
    );
};

const CalendarSkeleton = () => (
    <div className={`p-4 md:p-6 animate-pulse`}>
        <div className={`h-10 bg-gray-200/50 dark:bg-surface-dark/30 backdrop-blur-md dark:border dark:border-border-dark border-border-light rounded mb-4 w-1/3`} />
        <div className={`h-125 bg-gray-200/50 dark:bg-surface-dark/30 backdrop-blur-md dark:border dark:border-border-dark border-border-light rounded`} />
    </div>
);

export default CalendarPage;
