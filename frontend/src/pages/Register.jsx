import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { authAPI, extractError } from '../api/client';
import { useToast } from '../context/ToastContext';

function validate(fields) {
    const errors = {};
    if (!fields.name.trim()) errors.name = 'Name is required';
    if (!fields.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = 'Enter a valid email';
    if (!fields.password) errors.password = 'Password is required';
    else if (fields.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
}

export default function Register() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [fields, setFields] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

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
            await authAPI.register({ ...fields, role: 'patient' });
            addToast('Account created! Please log in.', 'success');
            navigate('/login');
        } catch (err) {
            setApiError(extractError(err));
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
                        <UserPlus size={22} color="#fff" strokeWidth={2} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.45rem', marginBottom: 2 }}>Create Account</h2>
                        <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: 0 }}>Patient registration</p>
                    </div>
                </div>

                {apiError && (
                    <div className="alert alert-error" style={{ marginBottom: 20 }}>
                        <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-group">
                        <label htmlFor="reg-name">Full Name</label>
                        <input id="reg-name" className={`input${errors.name ? ' error' : ''}`} type="text" name="name" placeholder="Jane Doe" value={fields.name} onChange={handleChange} autoFocus />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-email">Email Address</label>
                        <input id="reg-email" className={`input${errors.email ? ' error' : ''}`} type="email" name="email" placeholder="jane@example.com" value={fields.email} onChange={handleChange} />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input id="reg-password" className={`input${errors.password ? ' error' : ''}`} type="password" name="password" placeholder="Min. 6 characters" value={fields.password} onChange={handleChange} />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4, justifyContent: 'center', padding: '12px', gap: 8 }}>
                        {loading ? <><Loader2 size={16} strokeWidth={2} className="spin-icon" /> Creating account…</> : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--color-text-2)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
