import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/10 backdrop-blur-[5px]"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className={`
                relative w-full ${sizeStyles[size]} max-h-[90vh] overflow-y-auto
                bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl
                border border-border-light dark:border-border-dark
            `}>
                {title && (
                    <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                )}
                <div className="p-4">{children}</div>
            </div>
        </div>,
        document.body
    );
};

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
