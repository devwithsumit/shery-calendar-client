import { useState } from 'react';
import { Button } from '@/components/ui';
import { Calendar, Users } from 'lucide-react';
import { SheryEventsManagement } from './SheryEventsManagement';
import { useGetCurrentUserQuery } from '@/api/authApi';

import { UserManagement } from '../components/UserManagement';

const UserManagementLazy = () => {
    return <UserManagement />;
};

type AdminView = 'events' | 'users';

export const AdminDashboard = () => {
    const { data: user } = useGetCurrentUserQuery();
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const [activeView, setActiveView] = useState<AdminView>('events');

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-70px)] overflow-y-auto">
            {/* Header */}
            <div className="w-full flex justify-between flex-col md:flex-row md:items-center mb-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-text-light dark:text-text-dark">
                        Admin Panel
                    </h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark">
                        Manage events and users
                    </p>
                </div>

                {isSuperAdmin && (
                    <div className="mb-6 flex gap-2">
                        <Button
                            onClick={() => setActiveView('events')}
                            variant={activeView === 'events' ? 'primary' : 'outline'}
                            size="md"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Events
                        </Button>
                        {isSuperAdmin && (
                            <Button
                                onClick={() => setActiveView('users')}
                                variant={activeView === 'users' ? 'primary' : 'outline'}
                                size="md"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Users
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {activeView === 'events' ? (
                <SheryEventsManagement />
            ) : (
                <UserManagementLazy />
            )}
        </div>
    );
};
