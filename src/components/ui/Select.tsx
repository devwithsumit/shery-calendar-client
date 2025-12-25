import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    className?: string;
    id?: string;
}

export const Select = ({ options, value, onChange, label, className = '', id }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: { value: optionValue }
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
        }
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col gap-1" ref={selectRef}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium text-text-light dark:text-text-dark"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    id={selectId}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full px-3 py-1.5 pr-10
                        bg-surface-light dark:bg-surface-dark
                        border border-border-light dark:border-border-dark
                        rounded-lg
                        text-text-light dark:text-text-dark text-left
                        focus:outline-none focus:ring-2 focus:ring-primary/50
                        transition-all duration-200
                        cursor-pointer
                        hover:bg-surface-light/80 dark:hover:bg-surface-dark/80
                        ${className}
                    `}
                >
                    {selectedOption.label}
                </button>
                <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted-light dark:text-text-muted-dark pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 top-full
                        bg-surface-light dark:bg-surface-dark
                        border border-border-light dark:border-border-dark
                        rounded-lg shadow-lg p-1
                        overflow-hidden transition-all
                        animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    w-full my-px px-3 py-1.5 text-left rounded
                                    transition-colors duration-150
                                    ${option.value === value
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-text-light dark:text-text-dark hover:bg-primary/10'
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

Select.displayName = 'Select';
