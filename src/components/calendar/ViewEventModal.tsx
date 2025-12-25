import { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import { formatEventDetails, formatDisplayDateTime } from './utils';
import type { CalendarEvent } from '@/types/calendar';
import { Copy, Check, MapPin, Video, Calendar, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ViewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: CalendarEvent;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting?: boolean;
}

export const ViewEventModal = ({ isOpen, onClose, event, onEdit, onDelete, isDeleting }: ViewEventModalProps) => {
    const [copied, setCopied] = useState(false);
    const isSheryEvent = event.isSheryEvent || false;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(formatEventDetails(event));
        setCopied(true);
        toast.success('Event details copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event.summary} size="md">
            <div className="space-y-4">
                {/* Shery Event Badge */}
                {isSheryEvent && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg w-fit">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Institute Event</span>
                    </div>
                )}

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm dark:text-white">{formatDisplayDateTime(event)}</p>
                    </div>
                </div>

                {/* Location */}
                {event.location && (
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <p className="text-sm dark:text-gray-300">{event.location}</p>
                    </div>
                )}

                {/* Google Meet - only for Google Calendar events */}
                {!isSheryEvent && event.meetLink && (
                    <div className="flex items-start gap-3">
                        <Video className="w-5 h-5 text-primary mt-0.5" />
                        <a href={event.meetLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Join Google Meet
                        </a>
                        <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}

                {/* Actions - only show for Google Calendar events */}
                {!isSheryEvent && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <Button variant="danger" size="sm" onClick={onDelete} isLoading={isDeleting}>Delete</Button>
                            <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
                        </div>
                    </div>
                )}

                {/* Note for Shery Events */}
                {isSheryEvent && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Institute events can only be managed by administrators in the Admin Panel.
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
