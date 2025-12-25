import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserAdmin, UpdateRoleRequest } from '@/types/admin';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/admin`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('sc_token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        getAllUsers: builder.query<UserAdmin[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        updateUserRole: builder.mutation<UserAdmin, { id: number; role: UpdateRoleRequest }>({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: 'PUT',
                body: role,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const { useGetAllUsersQuery, useUpdateUserRoleMutation } = adminApi;
