import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, CalendarPlus, ListOrdered, UserPlus, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_LINKS = {
    patient: [{ to: '/app/book', label: 'Book Appointment', Icon: CalendarPlus }],
    doctor: [{ to: '/app/queue', label: 'My Queue', Icon: ListOrdered }],
    admin: [{ to: '/app/admin/create-user', label: 'Create User', Icon: UserPlus }],
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = user ? (ROLE_LINKS[user.role] || []) : [];

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                {/* Brand */}
                <NavLink to="/" className="navbar-brand">
                    <Activity size={20} strokeWidth={2.5} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Queue<span>Flux</span>
                </NavLink>

                <div className="nav-links">
                    {!user && (
                        <>
                            <NavLink to="/login" className="nav-link">Login</NavLink>
                            <NavLink
                                to="/register"
                                className="btn btn-outline"
                                style={{ padding: '6px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                    {user && links.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        >
                            <Icon size={15} strokeWidth={2} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                            {label}
                        </NavLink>
                    ))}

                    {user && (
                        <>
                            <NavLink to="/app/profile" className="nav-link">
                                <User size={15} strokeWidth={2} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                                Profile
                            </NavLink>
                            <div className="nav-user">
                                <span>{user.name}</span>
                                <span className="nav-pill">{user.role}</span>
                                <button
                                    onClick={handleLogout}
                                    className="btn"
                                    style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', gap: 6 }}
                                >
                                    <LogOut size={14} strokeWidth={2} />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
