import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Hash, LogOut, Copy, Check, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ROLE_BADGE = { patient: 'badge-patient', doctor: 'badge-doctor', admin: 'badge-admin' };
const ROLE_ICON = { patient: User, doctor: User, admin: Shield };

function ProfileRow({ Icon, label, children }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} strokeWidth={2} color="var(--color-text-2)" />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-1)' }}>{children}</div>
            </div>
        </div>
    );
}

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [copied, setCopied] = useState(false);

    const RoleIcon = ROLE_ICON[user?.role] || User;

    const handleLogout = () => {
        logout();
        addToast('Logged out successfully.', 'info');
        navigate('/login');
    };

    const copyId = () => {
        navigator.clipboard.writeText(user.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="app-page">
            <div className="container" style={{ maxWidth: 480 }}>
                <div className="page-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <User size={26} strokeWidth={2} color="var(--color-primary)" />
                        Profile
                    </h2>
                    <p>Your account details</p>
                </div>

                <div className="card fade-up">
                    {/* Avatar row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <RoleIcon size={28} color="#fff" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 style={{ marginBottom: 6 }}>{user?.name}</h3>
                            <span className={`badge ${ROLE_BADGE[user?.role] || ''}`}>{user?.role}</span>
                        </div>
                    </div>

                    <ProfileRow Icon={User} label="Full Name">{user?.name}</ProfileRow>
                    <ProfileRow Icon={Mail} label="Email">{user?.email}</ProfileRow>
                    <ProfileRow Icon={Shield} label="Role">
                        <span className={`badge ${ROLE_BADGE[user?.role] || ''}`}>{user?.role}</span>
                    </ProfileRow>

                    {/* User ID row with copy */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Hash size={16} strokeWidth={2} color="var(--color-text-2)" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>User ID</div>
                            <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-1)', wordBreak: 'break-all' }}>{user?.id}</div>
                        </div>
                        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copyId} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            {copied ? <><Check size={12} strokeWidth={2.5} />Copied</> : <><Copy size={12} strokeWidth={2} />Copy</>}
                        </button>
                    </div>

                    {user?.role === 'doctor' && (
                        <div className="alert alert-info" style={{ marginTop: 8 }}>
                            <Info size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                            <span>Share your <strong>User ID</strong> with patients so they can book appointments.</span>
                        </div>
                    )}

                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                        style={{ marginTop: 28, width: '100%', justifyContent: 'center', padding: '12px', gap: 8 }}
                    >
                        <LogOut size={16} strokeWidth={2} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
