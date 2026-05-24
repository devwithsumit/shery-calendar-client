import { useGetCurrentUserQuery } from "@/api/authApi";
import type { User } from "@/types/auth";
import { useMemo, useState } from "react";

interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
    timeZone?: string;
    meetLink?: string;
    htmlLink?: string;
}

interface EventFormData {
    summary: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    timeZone: string;
    createMeetLink: boolean;
}

const initialFormData: EventFormData = {
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    timeZone: 'Asia/Kolkata',
    createMeetLink: false,
};

const TestDashboard = () => {
    const { data } = useGetCurrentUserQuery();
    const user: User | undefined = useMemo(() => data, [data]);

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<EventFormData>(initialFormData);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('sc_token')}`
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleListEvents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/calendar/events?maxResults=5`, {
                method: 'GET',
                headers: authHeaders
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setEvents(data.data || []);
            showMessage('success', `Loaded ${data.data?.length || 0} events`);
        } catch (error) {
            console.error('Error fetching events:', error);
            showMessage('error', 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = editingEventId
            ? `${baseUrl}/calendar/events/${editingEventId}`
            : `${baseUrl}/calendar/events`;

        const method = editingEventId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log('Event saved:', data);

            showMessage('success', editingEventId ? 'Event updated!' : 'Event created!');
            setFormData(initialFormData);
            setEditingEventId(null);
            handleListEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            showMessage('error', 'Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (event: CalendarEvent) => {
        setEditingEventId(event.id);
        setFormData({
            summary: event.summary || '',
            description: event.description || '',
            startDateTime: event.startDateTime ? event.startDateTime.slice(0, 16) : '',
            endDateTime: event.endDateTime ? event.endDateTime.slice(0, 16) : '',
            location: event.location || '',
            timeZone: event.timeZone || 'Asia/Kolkata',
            createMeetLink: !!event.meetLink,
        });
    };

    const handleDelete = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/calendar/events/${eventId}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            showMessage('success', 'Event deleted!');
            handleListEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            showMessage('error', 'Failed to delete event');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingEventId(null);
        setFormData(initialFormData);
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div className="p-5 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                {user?.picture && (
                    <img
                        src={user?.picture}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full"
                    />
                )}
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome, {user?.name?.split(" ")[0] || 'User'}!
                    </h1>
                    <p className="text-gray-600">{user?.username}</p>
                </div>
            </div>

            {/* Message Toast */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Form */}
                <div className="border border-gray-300 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingEventId ? '✏️ Edit Event' : '➕ Create New Event'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Summary *</label>
                            <input
                                type="text"
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2"
                                placeholder="Event title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                rows={2}
                                placeholder="Event description"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start *</label>
                                <input
                                    type="datetime-local"
                                    name="startDateTime"
                                    value={formData.startDateTime}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End *</label>
                                <input
                                    type="datetime-local"
                                    name="endDateTime"
                                    value={formData.endDateTime}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                placeholder="Event location"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="createMeetLink"
                                checked={formData.createMeetLink}
                                onChange={handleInputChange}
                                id="createMeetLink"
                                className="w-4 h-4"
                            />
                            <label htmlFor="createMeetLink" className="text-sm">
                                Create Google Meet link
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : editingEventId ? 'Update Event' : 'Create Event'}
                            </button>
                            {editingEventId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Events List */}
                <div className="border border-gray-300 p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">📅 Upcoming Events (Top 5)</h2>
                        <button
                            onClick={handleListEvents}
                            disabled={loading}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {events.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No events loaded. Click "Refresh" to fetch events.
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-blue-600">
                                                {event.summary || 'No Title'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                📍 {event.location || 'No location'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                🕐 {formatDateTime(event.startDateTime)} - {formatDateTime(event.endDateTime)}
                                            </p>
                                            {event.meetLink && (
                                                <a
                                                    href={event.meetLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-green-600 hover:underline"
                                                >
                                                    🎥 Join Meet
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestDashboard;