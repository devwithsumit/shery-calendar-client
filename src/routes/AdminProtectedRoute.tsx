import { Navigate, Outlet } from 'react-router-dom';
// import { useAppSelector } from '@/hooks/useAppSelector';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUser } from '@/store/userSlice';

export const AdminProtectedRoute = () => {
    // const user = useAppSelector((state) => state.user.user);
    const { data: user } = useGetCurrentUserQuery();
    const dispatch = useAppDispatch();

    // If no user or role is USER, redirect to calendar

    if (user) {
        dispatch(setUser({ user })); // Ensure user is set in the store
    }

    if (user?.role === 'USER') {
        return <Navigate to="/calendar" replace />;
    }

    // Allow ADMIN and SUPER_ADMIN
    return <Outlet />;
};
