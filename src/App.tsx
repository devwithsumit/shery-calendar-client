import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import OAuthSuccess from './pages/OAuthSuccess';
import TestDashboard from './pages/TestDashboard';
import CalendarPage from './pages/CalendarPage';
import EventsListing from './pages/EventsListing';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminProtectedRoute } from './routes/AdminProtectedRoute';
import { AppLayout } from './components/layout';
import { useTheme } from './hooks/useTheme';
import NotFound from './components/layout/NotFound';
import { AdminDashboard } from '@/admin/pages/AdminDashboard';


function App() {
    useTheme();
    return (
        <Routes>
            {/* Public routes without AppLayout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/success" element={<OAuthSuccess />} />

            {/* Protected routes with AppLayout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<TestDashboard />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/events" element={<EventsListing />} />
                    <Route path="/not-found" element={<NotFound />} />
                </Route>
            </Route>

            {/* Admin routes with AdminProtectedRoute */}
            <Route element={<AdminProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/admin/shery-events" element={<AdminDashboard />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    );
}

export default App;
