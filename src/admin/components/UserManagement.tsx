import { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/api/adminApi';
import { Button, SearchField, Select } from '@/components/ui';
import { Users, Crown, Shield } from 'lucide-react';
import { useGetCurrentUserQuery } from '@/api/authApi';

export const UserManagement = () => {
    const { data: users, isLoading } = useGetAllUsersQuery();
    const { data: currentUser } = useGetCurrentUserQuery();
    const [updateRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
    const [editingUser, setEditingUser] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN' | 'SUPER_ADMIN'>('ALL');

    const handleRoleUpdate = async (userId: number, newRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
        try {
            await updateRole({ id: userId, role: { role: newRole } }).unwrap();
            setEditingUser(null);
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'ADMIN':
                return <Shield className="w-4 h-4 text-blue-500" />;
            default:
                return <Users className="w-4 h-4 text-gray-500" />;
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'ADMIN':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const filteredUsers = users?.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    }) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg text-text-light dark:text-text-dark">Loading users...</div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex gap-3 flex-wrap items-center">
                <div className="flex-1 min-w-62.5">
                    <SearchField
                        onClear={() => setSearchQuery('')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.toString())}
                    />
                </div>
                <Select
                    value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}
                    options={[
                        { value: 'ALL', label: 'All Roles' },
                        { value: 'USER', label: 'USER' },
                        { value: 'ADMIN', label: 'ADMIN' },
                        { value: 'SUPER_ADMIN', label: 'SUPER_ADMIN' },
                    ]}
                    className='w-40!'
                />
            </div>

            <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-lg border border-border-light dark:border-border-dark overflow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-bg-light/50 dark:bg-bg-dark/50 border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light/50 dark:divide-border-dark/50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-text-muted-light dark:text-text-muted-dark">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(user.role)}
                                                <div>
                                                    <div className="text-sm font-medium text-text-light dark:text-text-dark">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingUser === user.id ? (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleUpdate(user.id, e.target.value as any)}
                                                    className="px-3 py-1 text-sm rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
                                                    disabled={isUpdating}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                {editingUser === user.id ? (
                                                    <Button
                                                        onClick={() => setEditingUser(null)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Cancel
                                                    </Button>
                                                ) : user.id !== currentUser?.id && (
                                                    <Button
                                                        onClick={() => setEditingUser(user.id)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Edit Role
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
