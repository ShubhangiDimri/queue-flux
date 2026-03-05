import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_REDIRECTS = {
    patient: '/app/book',
    doctor: '/app/queue',
    admin: '/app/admin/create-user',
};

export default function Landing() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCTA = () => {
        navigate(user ? (ROLE_REDIRECTS[user.role] || '/app') : '/login');
    };

    return (
        <div>
            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-tag">Healthcare Queue Management</span>
                    <h1>Smart queuing for<br />modern healthcare</h1>
                    <p>
                        QueueFlux brings patients, doctors, and administrators to a single
                        seamless platform — fair FIFO queues, instant bookings, and real-time
                        status tracking.
                    </p>
                    <button
                        className="btn btn-lg"
                        onClick={handleCTA}
                        style={{ background: '#fff', color: 'var(--color-deep)', fontWeight: 700, gap: 8 }}
                    >
                        {user ? 'Open App' : 'Get Started'}
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </section>

            {/* ── How it Works ── */}
            <section className="section" style={{ background: 'var(--color-bg)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2>How QueueFlux works</h2>
                        <p style={{ marginTop: 8, fontSize: '1rem' }}>Three roles, one unified experience</p>
                    </div>

                    <div className="role-cards">
                        {/* Patient */}
                        <div className="role-card">
                            <div className="role-icon">
                                <Users size={22} color="#fff" strokeWidth={2} />
                            </div>
                            <span className="badge badge-patient" style={{ marginBottom: 10 }}>Patient</span>
                            <h3>Book an Appointment</h3>
                            <p>Register in seconds. Log in and book an appointment with your doctor by entering their Doctor ID. Join a fair FIFO queue automatically.</p>
                        </div>

                        {/* Doctor */}
                        <div className="role-card">
                            <div className="role-icon">
                                <Clock size={22} color="#fff" strokeWidth={2} />
                            </div>
                            <span className="badge badge-doctor" style={{ marginBottom: 10 }}>Doctor</span>
                            <h3>Manage Your Queue</h3>
                            <p>Log in to see your live waiting list sorted in arrival order. Mark appointments as completed with a single click.</p>
                        </div>

                        {/* Admin */}
                        <div className="role-card">
                            <div className="role-icon">
                                <ShieldCheck size={22} color="#fff" strokeWidth={2} />
                            </div>
                            <span className="badge badge-admin" style={{ marginBottom: 10 }}>Admin</span>
                            <h3>Manage Users</h3>
                            <p>Create doctor and admin accounts from the dashboard. Share the new doctor's ID with patients so they can start booking.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Feature strip ── */}
            <section style={{ background: 'var(--color-surface)', padding: '48px 24px', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
                    {[
                        { icon: <Clock size={20} color="var(--color-primary)" strokeWidth={2} />, label: 'FIFO Queue Ordering' },
                        { icon: <CheckCircle2 size={20} color="var(--color-success)" strokeWidth={2} />, label: 'Real-time Status' },
                        { icon: <ShieldCheck size={20} color="var(--color-primary)" strokeWidth={2} />, label: 'Role-based Access' },
                    ].map(({ icon, label }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-2)', fontSize: 14, fontWeight: 600 }}>
                            {icon}
                            {label}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Strip ── */}
            <section className="section" style={{ background: 'var(--color-primary)', padding: '60px 24px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#fff', marginBottom: 12 }}>Ready to get started?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28, fontSize: '1rem' }}>
                        Create your patient account for free or sign in to your existing account.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {!user ? (
                            <>
                                <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-deep)' }}>
                                    Create Account
                                </Link>
                                <Link to="/login" className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}>
                                    Sign In
                                </Link>
                            </>
                        ) : (
                            <button className="btn btn-lg" onClick={handleCTA} style={{ background: '#fff', color: 'var(--color-deep)', gap: 8 }}>
                                Open Your Dashboard <ArrowRight size={18} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ background: 'var(--color-text-1)', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px', fontSize: 13 }}>
                © {new Date().getFullYear()} QueueFlux · Healthcare Queue Management System
            </footer>
        </div>
    );
}
