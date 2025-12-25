import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium mb-1.5 text-text-light dark:text-text-dark"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`
                        w-full px-3 py-2 rounded-lg border text-sm resize-none
                        bg-surface-light dark:bg-surface-dark
                        border-border-light dark:border-border-dark
                        text-text-light dark:text-text-dark
                        placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark
                        focus:ring-2 focus:ring-primary focus:border-transparent
                        transition-colors duration-200
                        ${error ? 'border-red-500 focus:ring-red-500' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
