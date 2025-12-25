import { ThemeToggle, ProfileDropdown } from '@/components/ui';
import { MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
    return (
        <header className="h-14 px-4 z-40 flex items-center justify-between border-b border-border-light dark:border-border-dark 
         backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <MenuIcon onClick={onMenuClick} className="w-8 h-8 text-gray-600 dark:text-gray-300 hover:bg-gray-200
                 dark:hover:bg-gray-700 rounded cursor-pointer p-1" />
                <Link to={'/calendar'} className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SC</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white hidden sm:block">
                        Shery Calendar
                    </span>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <ProfileDropdown />
            </div>
        </header>
    );
};
