import { useState } from 'react';
import { UserPlus, AlertCircle, Loader2, CheckCircle2, Copy, Check, Info } from 'lucide-react';
import { authAPI, extractError } from '../api/client';
import { useToast } from '../context/ToastContext';

function validate(fields) {
    const errors = {};
    if (!fields.name.trim()) errors.name = 'Name is required';
    if (!fields.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = 'Enter a valid email';
    if (!fields.password) errors.password = 'Password is required';
    else if (fields.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!fields.role) errors.role = 'Role is required';
    return errors;
}

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const handle = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handle} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {copied ? <><Check size={12} strokeWidth={2.5} />Copied</> : <><Copy size={12} strokeWidth={2} />Copy</>}
        </button>
    );
}

function CreatedUserCard({ createdUser, onDismiss }) {
    const ROLE_BADGE = { patient: 'badge-patient', doctor: 'badge-doctor', admin: 'badge-admin' };

    return (
        <div className="confirm-card" style={{ marginTop: 24 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} color="var(--color-success)" strokeWidth={2.5} />
                User Created Successfully
            </h3>

            <div className="confirm-row">
                <span className="confirm-key">User ID</span>
                <span className="confirm-val" style={{ fontFamily: 'monospace', fontSize: 12 }}>{createdUser.id}</span>
                <CopyButton text={createdUser.id} />
            </div>
            <div className="confirm-row">
                <span className="confirm-key">Name</span>
                <span className="confirm-val">{createdUser.name}</span>
            </div>
            <div className="confirm-row">
                <span className="confirm-key">Email</span>
                <span className="confirm-val">{createdUser.email}</span>
            </div>
            <div className="confirm-row">
                <span className="confirm-key">Role</span>
                <span className={`badge ${ROLE_BADGE[createdUser.role] || ''}`}>{createdUser.role}</span>
            </div>

            {createdUser.role === 'doctor' && (
                <div className="alert alert-info" style={{ marginTop: 16 }}>
                    <Info size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span>Share the <strong>User ID</strong> above with patients so they can book appointments with this doctor.</span>
                </div>
            )}

            <button className="btn btn-outline" style={{ marginTop: 20, gap: 6 }} onClick={onDismiss}>
                <UserPlus size={15} strokeWidth={2} />
                Create Another User
            </button>
        </div>
    );
}

export default function CreateUser() {
    const { addToast } = useToast();

    const [fields, setFields] = useState({ name: '', email: '', password: '', role: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [created, setCreated] = useState(null);

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
            const res = await authAPI.createUser(fields);
            setCreated(res.data.data);
            addToast(`${fields.role} account created!`, 'success');
            setFields({ name: '', email: '', password: '', role: '' });
        } catch (err) {
            const msg = extractError(err);
            setApiError(msg);
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-page">
            <div className="container" style={{ maxWidth: 600 }}>
                <div className="page-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <UserPlus size={26} strokeWidth={2} color="var(--color-primary)" />
                        Create User
                    </h2>
                    <p>Create a new doctor, admin, or patient account.</p>
                </div>

                {!created && (
                    <div className="card">
                        {apiError && (
                            <div className="alert alert-error" style={{ marginBottom: 20 }}>
                                <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                                {apiError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="form-group">
                                <label htmlFor="cu-name">Full Name</label>
                                <input id="cu-name" className={`input${errors.name ? ' error' : ''}`} type="text" name="name" placeholder="Dr. John Smith" value={fields.name} onChange={handleChange} autoFocus />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="cu-email">Email Address</label>
                                <input id="cu-email" className={`input${errors.email ? ' error' : ''}`} type="email" name="email" placeholder="doctor@hospital.com" value={fields.email} onChange={handleChange} />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="cu-password">Password</label>
                                <input id="cu-password" className={`input${errors.password ? ' error' : ''}`} type="password" name="password" placeholder="Min. 6 characters" value={fields.password} onChange={handleChange} />
                                {errors.password && <span className="field-error">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="cu-role">Role</label>
                                <select id="cu-role" className={`input${errors.role ? ' error' : ''}`} name="role" value={fields.role} onChange={handleChange} style={{ appearance: 'auto' }}>
                                    <option value="">Select a role…</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="admin">Admin</option>
                                    <option value="patient">Patient</option>
                                </select>
                                {errors.role && <span className="field-error">{errors.role}</span>}
                            </div>

                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ justifyContent: 'center', padding: '13px', gap: 8 }}>
                                {loading
                                    ? <><Loader2 size={16} strokeWidth={2} className="spin-icon" /> Creating…</>
                                    : <><UserPlus size={16} strokeWidth={2} /> Create User</>}
                            </button>
                        </form>
                    </div>
                )}

                {created && <CreatedUserCard createdUser={created} onDismiss={() => setCreated(null)} />}
            </div>
        </div>
    );
}
