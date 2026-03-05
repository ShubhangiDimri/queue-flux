import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route and enforces:
 *  - Authentication (redirect to /login if not logged in)
 *  - Optional role restriction (redirect to /app if wrong role)
 */
export default function ProtectedRoute({ children, roles }) {
    const { user, ready } = useAuth();
    const location = useLocation();

    // Wait until localStorage is hydrated
    if (!ready) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner spinner-teal" style={{ width: 36, height: 36 }} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/app" replace />;
    }

    return children;
}
