import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiTag,
    FiFilter,
    FiSearch,
    FiEye,
    FiThumbsUp,
    FiClock
} from 'react-icons/fi';
import { policyAPI } from '../../services/policyAPI';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import toast from 'react-hot-toast';
import '../Pages.css';
import './CitizenPages.css';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'All',
        search: ''
    });

    useEffect(() => {
        fetchPolicies();
    }, [filters]);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const params = { status: 'Published' }; // Only show published
            if (filters.category !== 'All') params.category = filters.category;
            if (filters.search) params.search = filters.search;

            const { data } = await policyAPI.getAllPolicies(params);
            if (data.success) {
                setPolicies(data.data.policies);
            }
        } catch (error) {
            toast.error('Failed to fetch policies');
        } finally {
            setLoading(false);
        }
    };

    const handleSupport = async (policyId) => {
        try {
            const { data } = await policyAPI.supportPolicy(policyId);
            if (data.success) {
                toast.success(data.message);
                // Update the support count locally
                setPolicies(policies.map(p =>
                    p._id === policyId
                        ? { ...p, supportCount: data.data.supportCount }
                        : p
                ));
            }
        } catch (error) {
            toast.error('Failed to support policy');
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
                        transition={{ duration: 0.5 }}
                    >
                        <div className="page-header-modern">
                            <div>
                                <h1>Government Policies</h1>
                                <p>
                                    Learn about current policies and show your support
                                </p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="filter-bar-modern">
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-4)' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">
                                        <FiSearch /> Search Policies
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Search by title or description..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">
                                        <FiFilter /> Filter by Category
                                    </label>
                                    <select
                                        className="form-input"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    >
                                        <option value="All">All Categories</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                        <option value="Infrastructure">Infrastructure</option>
                                        <option value="Environment">Environment</option>
                                        <option value="Economy">Economy</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Public Safety">Public Safety</option>
                                        <option value="Housing">Housing</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Policies Grid */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="spinner" style={{ margin: '0 auto' }}></div>
                            </div>
                        ) : policies.length === 0 ? (
                            <div className="empty-state">
                                <p style={{ color: 'var(--text-muted)' }}>No policies found</p>
                            </div>
                        ) : (
                            <div className="policies-grid">
                                {policies.map((policy) => (
                                    <motion.div
                                        key={policy._id}
                                        className="policy-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="policy-card-header">
                                            <span className="badge badge-primary">
                                                <FiTag /> {policy.category}
                                            </span>
                                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                                                <FiClock /> {new Date(policy.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 className="policy-card-title">{policy.title}</h3>

                                        <p className="policy-card-description">
                                            {policy.description.substring(0, 150)}...
                                        </p>

                                        {policy.tags && policy.tags.length > 0 && (
                                            <div className="policy-tags">
                                                {policy.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="policy-tag">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="policy-card-footer">
                                            <div className="policy-stats">
                                                <span>
                                                    <FiEye /> {policy.viewCount} views
                                                </span>
                                                <span>
                                                    <FiThumbsUp /> {policy.supportCount} support
                                                </span>
                                            </div>

                                            <div className="policy-actions">
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleSupport(policy._id)}
                                                >
                                                    <FiThumbsUp /> Support
                                                </button>
                                                <Link
                                                    to={`/policies/${policy._id}`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default Policies;
