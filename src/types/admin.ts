export interface UserAdmin {
    id: number;
    username: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    createdAt: string;
    updatedAt: string;
}

export interface UpdateRoleRequest {
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}
