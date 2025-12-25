import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    // primary: 'bg-primary text-white hover:bg-primary-hover',
    // secondary: 'bg-surface-dark text-white hover:bg-gray-700 dark:bg-gray-600',
    // outline: 'border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800',
    // danger: 'bg-red-500 text-white hover:bg-red-600',
    // ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',

    primary: 'bg-primary text-white hover:bg-primary-hover dark:bg-primary dark:text-white dark:hover:bg-primary-hover',
    secondary: 'bg-surface-dark text-white hover:bg-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500',
    outline: 'border border-border-light text-gray-700 hover:bg-gray-50 dark:border-border-dark dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700',
    ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
                    inline-flex items-center justify-center font-medium rounded-lg
                    transition-colors duration-200 cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${variantStyles[variant]}
                    ${sizeStyles[size]}
                    ${className}
                `}
                {...props}
            >
                {isLoading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
