export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
    id: number;
    name: string;
    username: string;
    picture: string;
    role: Role;
    createdAt?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}
