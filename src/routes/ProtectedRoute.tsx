import { useGetCurrentUserQuery } from "@/api/authApi";
import { useAppSelector } from '@/hooks/useAppDispatch';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const { token } = useAppSelector((state) => state.user);

    // 🚨 Hook MUST be called unconditionally
    const {
        isLoading,
        isError,
    } = useGetCurrentUserQuery(undefined, {
        skip: !token, // ⬅️ important
    });

    // No token → not authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Still fetching user
    if (isLoading) {
        return (
            <div
                className="h-screen w-full flex items-center justify-center">
                Checking authentication...
            </div>
        );
    }

    // Token invalid / user fetch failed
    if (isError) {
        return <Navigate to="/login" replace />;
    }

    // User exists either from store or freshly fetched
    return <Outlet />;
};
