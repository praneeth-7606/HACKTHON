import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBell, FiCheckCircle, FiTrash2, FiClock } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../Pages.css';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/user-alerts');
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/user-alerts/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await api.patch(`/user-alerts/${notification._id}/read`);
                setNotifications(notifications.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
            }

            // Redirection logic
            if (notification.type === 'AdminAlert' && notification.policy) {
                navigate(`/policies/${notification.policy}`);
            } else if (notification.concern) {
                // Determine if citizen or admin from some context if possible, 
                // but usually this page is for citizens. 
                // Let's check auth to be safe.
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser?.role === 'admin') {
                    navigate('/admin/concerns');
                } else {
                    navigate('/dashboard/concerns');
                }
            }
        } catch (error) {
            console.error('Failed to mark as read');
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="container"
                        style={{ maxWidth: '800px' }}
                    >
                        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Notifications</h1>
                                <p style={{ color: 'var(--text-secondary)' }}>Stay updated with your community activities</p>
                            </div>
                            <button
                                className="btn btn-ghost"
                                onClick={handleMarkAllRead}
                                disabled={!notifications.some(n => !n.isRead)}
                            >
                                <FiCheckCircle /> Mark all as read
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="spinner" style={{ margin: '0 auto' }}></div>
                            </div>
                        ) : (
                            <div className="notification-full-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {notifications.length === 0 ? (
                                    <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                                        <FiBell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                        <h3>No notifications yet</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>We will alert you here when something important happens.</p>
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            className={`card notification-card ${notification.isRead ? 'read' : 'unread'}`}
                                            style={{
                                                padding: '1.5rem',
                                                display: 'flex',
                                                gap: '1.2rem',
                                                alignItems: 'center',
                                                borderLeft: notification.isRead ? '4px solid transparent' : '4px solid var(--primary-500)',
                                                background: notification.isRead ? 'white' : '#f0f7ff',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: notification.isRead ? 'var(--bg-secondary)' : 'var(--primary-100)',
                                                color: notification.isRead ? 'var(--text-muted)' : 'var(--primary-600)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.2rem',
                                                flexShrink: 0
                                            }}>
                                                <FiBell />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '1rem', fontWeight: notification.isRead ? 500 : 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                                                    {notification.message}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                    <FiClock /> {new Date(notification.createdAt).toLocaleString()}
                                                </div>
                                            </div>

                                            {!notification.isRead && (
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-500)' }}></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default Notifications;
