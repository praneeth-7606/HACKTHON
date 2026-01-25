import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FiTrendingUp, FiCheckCircle, FiAlertCircle, FiClock, FiActivity } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { concernAPI } from '../../services/concernAPI';
import '../Pages.css';

const AdminStats = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        inProgress: 0,
        byCategory: [],
        timeline: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await concernAPI.getAllConcerns({ limit: 1000 }); // Fetch all for stats
            if (data.success) {
                processStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (concerns) => {
        const total = concerns.length;
        const pending = concerns.filter(c => c.status === 'Pending').length;
        const resolved = concerns.filter(c => c.status === 'Resolved').length;
        const inProgress = concerns.filter(c => c.status === 'In Progress').length;

        // Group by Category
        const categories = {};
        concerns.forEach(c => {
            categories[c.category] = (categories[c.category] || 0) + 1;
        });
        const byCategory = Object.keys(categories).map(key => ({
            name: key,
            count: categories[key]
        }));

        // Mock Timeline Data (since we might not have enough history)
        const timeline = [
            { name: 'Mon', concerns: 4 },
            { name: 'Tue', concerns: 3 },
            { name: 'Wed', concerns: 2 },
            { name: 'Thu', concerns: 7 },
            { name: 'Fri', concerns: 5 },
            { name: 'Sat', concerns: 8 },
            { name: 'Sun', concerns: concerns.filter(c => new Date(c.createdAt).toDateString() === new Date().toDateString()).length + 2 },
        ];

        setStats({ total, pending, resolved, inProgress, byCategory, timeline });
    };

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass-card"
            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
        >
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `${color}20`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
            }}>
                <Icon />
            </div>
            <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>{value}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{title}</p>
            </div>
        </motion.div>
    );

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

    return (
        <>
            <Navbar />
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <div className="page-header">
                        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Analytics Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Real-time insights on community concerns</p>
                    </div>

                    {loading ? (
                        <div className="spinner" style={{ margin: '5rem auto' }}></div>
                    ) : (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {/* Stats Grid */}
                            <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                <StatCard title="Total Concerns" value={stats.total} icon={FiActivity} color="#6366f1" delay={0.1} />
                                <StatCard title="Resolved" value={stats.resolved} icon={FiCheckCircle} color="#10b981" delay={0.2} />
                                <StatCard title="Pending" value={stats.pending} icon={FiClock} color="#f59e0b" delay={0.3} />
                                <StatCard title="In Progress" value={stats.inProgress} icon={FiTrendingUp} color="#3b82f6" delay={0.4} />
                            </div>

                            <div className="grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
                                {/* Main Chart */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="card"
                                    style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
                                >
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiActivity /> Activity Timeline
                                    </h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.timeline}>
                                            <defs>
                                                <linearGradient id="colorConcerns" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="concerns" stroke="#8884d8" fillOpacity={1} fill="url(#colorConcerns)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </motion.div>

                                {/* Pie Chart */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="card"
                                    style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
                                >
                                    <h3 style={{ marginBottom: '1.5rem' }}>Category Distribution</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.byCategory}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="count"
                                            >
                                                {stats.byCategory.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default AdminStats;
