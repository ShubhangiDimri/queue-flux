import { useState, useEffect, useCallback } from 'react';
import { ListOrdered, AlertCircle, RefreshCw, Loader2, CheckCircle2, PartyPopper } from 'lucide-react';
import { appointmentsAPI, extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function SkeletonRow() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr auto auto', gap: 16, alignItems: 'center', padding: '18px 24px', background: '#fff', borderRadius: 12, border: '1px solid var(--color-border)' }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div><div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} /><div className="skeleton" style={{ height: 10, width: '40%' }} /></div>
            <div><div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 8 }} /><div className="skeleton" style={{ height: 10, width: '50%' }} /></div>
            <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 99 }} />
            <div className="skeleton" style={{ height: 34, width: 100, borderRadius: 8 }} />
        </div>
    );
}

export default function DoctorQueue() {
    const { user } = useAuth();
    const { addToast } = useToast();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completing, setCompleting] = useState(null);

    const fetchQueue = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await appointmentsAPI.getQueue(user.id);
            setAppointments((res.data.data || []).filter((a) => a.status === 'Waiting'));
        } catch (err) {
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => { fetchQueue(); }, [fetchQueue]);

    const handleComplete = async (appt) => {
        setCompleting(appt._id);
        try {
            await appointmentsAPI.complete(appt._id);
            addToast('Appointment marked as Completed.', 'success');
            setAppointments((prev) => prev.filter((a) => a._id !== appt._id));
        } catch (err) {
            addToast(extractError(err), 'error');
        } finally {
            setCompleting(null);
        }
    };

    return (
        <div className="app-page">
            <div className="container">
                {/* Header */}
                <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <ListOrdered size={26} strokeWidth={2} color="var(--color-primary)" />
                            Your Waiting Queue
                        </h2>
                        <p>Dr. <strong>{user?.name}</strong> · Sorted by arrival order (FIFO)</p>
                    </div>
                    <button className="btn btn-outline" onClick={fetchQueue} disabled={loading} style={{ gap: 6 }}>
                        <RefreshCw size={15} strokeWidth={2} className={loading ? 'spin-icon' : ''} />
                        {loading ? 'Refreshing…' : 'Refresh'}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 20 }}>
                        <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && (
                    <div className="queue-list">
                        {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && appointments.length === 0 && (
                    <div className="empty-state fade-up">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                            <PartyPopper size={48} color="var(--color-light)" strokeWidth={1.5} />
                        </div>
                        <h3 style={{ color: 'var(--color-text-1)', marginBottom: 8 }}>No patients waiting</h3>
                        <p>Your queue is empty. Refresh to check for new appointments.</p>
                    </div>
                )}

                {/* Queue list */}
                {!loading && appointments.length > 0 && (
                    <div className="queue-list fade-up">
                        <div style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'center' }}>
                            <span className="badge badge-waiting" style={{ fontSize: 13 }}>
                                {appointments.length} {appointments.length === 1 ? 'patient' : 'patients'} waiting
                            </span>
                        </div>

                        {appointments.map((appt, idx) => (
                            <div key={appt._id} className="queue-item">
                                <div className="queue-num">{idx + 1}</div>

                                <div>
                                    <div className="queue-label">Patient ID</div>
                                    <div className="queue-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{appt.patientId}</div>
                                </div>

                                <div>
                                    <div className="queue-label">Appointment</div>
                                    <div className="queue-value">{new Date(appt.date).toLocaleString()}</div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-2)', marginTop: 2 }}>
                                        Booked: {new Date(appt.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <span className={`badge badge-${appt.status?.toLowerCase()?.replace('-', '')}`}>
                                    {appt.status}
                                </span>

                                <button
                                    className="btn btn-success"
                                    onClick={() => handleComplete(appt)}
                                    disabled={completing === appt._id}
                                    style={{ whiteSpace: 'nowrap', fontSize: 13, gap: 6 }}
                                >
                                    {completing === appt._id
                                        ? <><Loader2 size={14} strokeWidth={2} className="spin-icon" /> Completing…</>
                                        : <><CheckCircle2 size={14} strokeWidth={2} /> Complete</>}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
