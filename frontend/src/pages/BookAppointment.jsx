import { useState } from 'react';
import { CalendarPlus, AlertCircle, Info, Loader2, CheckCircle2, Copy, Check } from 'lucide-react';
import { appointmentsAPI, extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function validate(fields) {
    const errors = {};
    if (!fields.doctorId.trim()) errors.doctorId = 'Doctor ID is required';
    if (!fields.date) errors.date = 'Appointment date & time is required';
    else if (new Date(fields.date) < new Date()) errors.date = 'Please choose a future date & time';
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
            {copied ? <><Check size={12} strokeWidth={2.5} /> Copied</> : <><Copy size={12} strokeWidth={2} /> Copy</>}
        </button>
    );
}

function ConfirmationCard({ appt, onBookAnother }) {
    return (
        <div className="confirm-card" style={{ marginTop: 28 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} color="var(--color-success)" strokeWidth={2.5} />
                Appointment Booked
            </h3>

            <div className="confirm-row">
                <span className="confirm-key">Appointment ID</span>
                <span className="confirm-val" style={{ fontFamily: 'monospace', fontSize: 12 }}>{appt._id}</span>
                <CopyButton text={appt._id} />
            </div>
            <div className="confirm-row">
                <span className="confirm-key">Doctor ID</span>
                <span className="confirm-val" style={{ fontFamily: 'monospace', fontSize: 12 }}>{appt.doctorId}</span>
            </div>
            <div className="confirm-row">
                <span className="confirm-key">Date &amp; Time</span>
                <span className="confirm-val">{new Date(appt.date).toLocaleString()}</span>
            </div>
            <div className="confirm-row">
                <span className="confirm-key">Status</span>
                <span className={`badge badge-${appt.status?.toLowerCase()?.replace('-', '')}`}>{appt.status}</span>
            </div>
            <div className="confirm-row">
                <span className="confirm-key">Booked At</span>
                <span className="confirm-val">{new Date(appt.createdAt).toLocaleString()}</span>
            </div>

            <button className="btn btn-outline" onClick={onBookAnother} style={{ marginTop: 20 }}>
                <CalendarPlus size={15} strokeWidth={2} />
                Book Another Appointment
            </button>
        </div>
    );
}

export default function BookAppointment() {
    const { user } = useAuth();
    const { addToast } = useToast();

    const [fields, setFields] = useState({ doctorId: '', date: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [booked, setBooked] = useState(null);

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
            const res = await appointmentsAPI.book({ doctorId: fields.doctorId.trim(), date: fields.date });
            setBooked(res.data.data);
            addToast('Appointment booked successfully!', 'success');
            setFields({ doctorId: '', date: '' });
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
                        <CalendarPlus size={26} strokeWidth={2} color="var(--color-primary)" />
                        Book an Appointment
                    </h2>
                    <p>Hello, <strong>{user?.name}</strong>! Enter the Doctor ID and your preferred time.</p>
                </div>

                {!booked && (
                    <div className="card">
                        {apiError && (
                            <div className="alert alert-error" style={{ marginBottom: 20 }}>
                                <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                                {apiError}
                            </div>
                        )}

                        <div className="alert alert-info" style={{ marginBottom: 20 }}>
                            <Info size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                            <span>Ask your clinic for the <strong>Doctor ID</strong> to book into their queue.</span>
                        </div>

                        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="form-group">
                                <label htmlFor="book-doctorid">Doctor ID</label>
                                <input id="book-doctorid" className={`input${errors.doctorId ? ' error' : ''}`} type="text" name="doctorId" placeholder="e.g. 64f3a9e100abc123def45678" value={fields.doctorId} onChange={handleChange} />
                                {errors.doctorId && <span className="field-error">{errors.doctorId}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="book-date">Appointment Date &amp; Time</label>
                                <input id="book-date" className={`input${errors.date ? ' error' : ''}`} type="datetime-local" name="date" value={fields.date} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} />
                                {errors.date && <span className="field-error">{errors.date}</span>}
                            </div>

                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ justifyContent: 'center', padding: '13px', gap: 8 }}>
                                {loading
                                    ? <><Loader2 size={16} strokeWidth={2} className="spin-icon" /> Booking…</>
                                    : <><CalendarPlus size={16} strokeWidth={2} /> Book Appointment</>}
                            </button>
                        </form>
                    </div>
                )}

                {booked && <ConfirmationCard appt={booked} onBookAnother={() => setBooked(null)} />}
            </div>
        </div>
    );
}
