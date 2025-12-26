import { useGetCurrentUserQuery, useLogoutMutation } from '@/api/authApi';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/userSlice';
import { LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // const user = useAppSelector((state) => state.user.user);
    const { data: user } = useGetCurrentUserQuery();

    const [logoutApi] = useLogoutMutation();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const response = await logoutApi();
        console.log('Logout response:', response);
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full overflow-hidden border-2 hover:border-primary-hover border-primary transition-colors">
                {user?.picture ? (
                    <img src={user?.picture} alt={"No Image"} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                )
                }
            </button >
            {open && (
                <div className="absolute z-50 right-0 mt-2 w-64 bg-popup border border-border-light dark:border-border-dark rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-border-light dark:border-border-dark">
                        {user?.picture ? (
                            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-text-light dark:text-text-dark">{user?.name || 'User'}</p>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">{user?.username}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /> Sign out
                    </button>
                </div>
            )}
        </div >
    );
};
