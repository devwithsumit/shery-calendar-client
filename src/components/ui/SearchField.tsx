import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFieldProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
    className?: string;
}

export const SearchField = ({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    className = ''
}: SearchFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={`relative ${className}`}>
            <div onClick={() => inputRef.current?.focus()}
                className={`
                flex items-center gap-2 px-3 py-2 backdrop-blur-xl
                bg-surface-light/30 dark:bg-surface-dark/30
                border border-border-light dark:border-border-dark
                rounded-lg
                transition-all duration-200
                ${isFocused ? 'ring-2 ring-primary/50 border-primary' : ''}
            `}>
                <Search className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="
                        flex-1 bg-transparent
                        text-text-light dark:text-text-dark
                        placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark
                        focus:outline-none
                        py-0.5
                        placeholder:text-sm
                        text-sm
                    "
                />
                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="
                            p-1 rounded-md
                            hover:bg-surface-light/60 dark:hover:bg-surface-dark/60
                            transition-colors duration-150
                        "
                    >
                        <X className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
                    </button>
                )}
            </div>
        </div>
    );
};

SearchField.displayName = 'SearchField';
