import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { authAPI, extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';

const ROLE_REDIRECTS = {
    patient: '/app/book',
    doctor: '/app/queue',
    admin: '/app/admin/create-user',
};

function validate(fields) {
    const errors = {};
    if (!fields.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = 'Enter a valid email';
    if (!fields.password) errors.password = 'Password is required';
    return errors;
}

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();

    const [fields, setFields] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const successMsg = location.state?.successMsg || '';

    useEffect(() => {
        if (user) navigate(ROLE_REDIRECTS[user.role] || '/app', { replace: true });
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((e) => { const n = { ...e }; delete n[name]; return n; });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(fields);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        setApiError('');
        try {
            const res = await authAPI.login(fields);
            const { token, data } = res.data;
            login(token, data);
            navigate(ROLE_REDIRECTS[data.role] || '/app', { replace: true });
        } catch (err) {
            setApiError(err?.response?.status === 401 ? 'Invalid email or password.' : extractError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <LogIn size={22} color="#fff" strokeWidth={2} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.45rem', marginBottom: 2 }}>Welcome back</h2>
                        <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: 0 }}>Sign in to your account</p>
                    </div>
                </div>

                {successMsg && (
                    <div className="alert alert-success" style={{ marginBottom: 18 }}>
                        <CheckCircle2 size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                        {successMsg}
                    </div>
                )}

                {apiError && (
                    <div className="alert alert-error" style={{ marginBottom: 18 }}>
                        <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-group">
                        <label htmlFor="login-email">Email Address</label>
                        <input id="login-email" className={`input${errors.email ? ' error' : ''}`} type="email" name="email" placeholder="you@example.com" value={fields.email} onChange={handleChange} autoFocus />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password" className={`input${errors.password ? ' error' : ''}`} type="password" name="password" placeholder="Your password" value={fields.password} onChange={handleChange} />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4, justifyContent: 'center', padding: '12px', gap: 8 }}>
                        {loading ? <><Loader2 size={16} strokeWidth={2} className="spin-icon" /> Signing in…</> : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--color-text-2)' }}>
                    New patient?{' '}
                    <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
}
