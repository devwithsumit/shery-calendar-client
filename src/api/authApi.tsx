import type { User } from '@/types/auth'
import type { SuccessResponse } from '@/types/common'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export interface LoginRequest {
//     email: string
//     password: string
// }

// export interface RegisterRequest {
//     email: string
//     password: string
//     name: string
// }

export interface AuthResponse {
    user: User
    token: string
}
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/"

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/auth`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).user?.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // login: builder.mutation<AuthResponse, LoginRequest>({
        //     query: (credentials) => ({
        //         url: '/login',
        //         method: 'POST',
        //         body: credentials,
        //     }),
        //     invalidatesTags: ['User'],
        // }),
        // register: builder.mutation<AuthResponse, RegisterRequest>({
        //     query: (userData) => ({
        //         url: '/register',
        //         method: 'POST',
        //         body: userData,
        //     }),
        //     invalidatesTags: ['User'],
        // }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'GET',
            }),
            invalidatesTags: ['User'],
        }),
        getCurrentUser: builder.query<User, void>({
            query: () => '/me',
            providesTags: ['User'],
            transformResponse: (response: SuccessResponse<User>) => response.data,
        }),
        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: '/refresh',
                method: 'POST',
            }),
        }),
    }),
})

export const {
    // useLoginMutation,
    // useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useRefreshTokenMutation,
} = authApi