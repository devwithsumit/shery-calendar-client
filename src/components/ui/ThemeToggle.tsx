import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/hooks/useTheme';

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
];

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const CurrentIcon = options.find((o) => o.value === theme)?.icon || Sun;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
            >
                <CurrentIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            {open && (
                <div className="absolute z-50 right-0 mt-2 w-36 bg-popup  border border-border-light dark:border-border-dark rounded-lg shadow-lg py-1">
                    {options.map(({ value, icon: Icon, label }) => (
                        <button
                            key={value}
                            onClick={() => { setTheme(value); setOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-bg-light dark:hover:bg-bg-dark ${theme === value ? 'text-primary font-medium' : 'text-text-light dark:text-text-dark'}`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
