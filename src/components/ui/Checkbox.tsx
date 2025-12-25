import type { InputHTMLAttributes } from 'react';
import { forwardRef, useEffect } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    variant?: 'basic' | 'border';
    bgColor?: 'primary' | string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', id, variant = 'border', bgColor = 'primary', ...props }, ref) => {
        const checkboxId = id || label?.toLowerCase().replace(/\s/g, '-');

        const applyVariantStyles = () => {
            switch (variant) {
                case 'basic':
                    return `w-4 h-4 rounded border-2 cursor-pointer
                        border-border-light dark:border-border-dark
                        focus:ring-0 accent-primary
                        bg-surface-light dark:bg-surface-dark`;
                default:
                    return `w-4 h-4 cursor-pointer rounded
                            appearance-none outline-none

                            /* unchecked */
                            border-2

                            /* checked */
                            checked:border-2

                            /* checkmark */
                            checked:before:content-['✔']
                            checked:before:text-black
                            checked:before:flex
                            checked:before:-translate-y-0.5
                            checked:before:-rotate-8
                            checked:before:items-center
                            checked:before:justify-center
                            checked:before:text-xs

                            /* focus */
                            focus:ring-0 focus:outline-none`;
            }
        }
        const toggleCheckbox = (e: React.MouseEvent<HTMLInputElement>) => {
            e.currentTarget.classList.toggle('bg-transparent!')
        }
        return (
            <div className="flex items-center gap-2">
                <input
                    ref={ref}
                    onClick={toggleCheckbox}
                    type="checkbox"
                    id={checkboxId}
                    className={`
                        custom-checkbox
                        ${applyVariantStyles()}
                        ${className}
                    `}
                    style={{
                        borderColor: bgColor === 'primary' ? 'var(--color-primary)' : bgColor,
                        backgroundColor: bgColor === 'primary' ? 'var(--color-primary)' : bgColor,
                        '--cb-color': bgColor === 'primary'
                            ? 'var(--color-primary)'
                            : bgColor,
                    } as React.CSSProperties}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="text-sm text-text-light dark:text-text-dark cursor-pointer"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
