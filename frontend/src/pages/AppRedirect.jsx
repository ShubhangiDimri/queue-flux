import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_REDIRECTS = {
    patient: '/app/book',
    doctor: '/app/queue',
    admin: '/app/admin/create-user',
};

/**
 * App shell redirect — sends authenticated users to their role-specific home.
 */
export default function AppRedirect() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate(ROLE_REDIRECTS[user.role] || '/login', { replace: true });
    }

    return null;
}
