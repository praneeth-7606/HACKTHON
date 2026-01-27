import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ideaAPI from '../../services/ideaAPI';
import { 
    FiThumbsUp, FiThumbsDown, FiEye, FiClock, FiTrendingUp, 
    FiFilter, FiSearch, FiPlus, FiAward, FiDollarSign, FiCheckCircle
} from 'react-icons/fi';
import './Ideas.css';

const Ideas = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'All',
        status: 'All',
        search: '',
        sortBy: 'createdAt'
    });
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchIdeas();
    }, [filters]);

    const fetchIdeas = async () => {
        try {
            setLoading(true);
            const response = await ideaAPI.getAllIdeas(filters);
            setIdeas(response.data.ideas);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching ideas:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        'All', 'Revenue Generation', 'Infrastructure Development', 
        'Technology & Innovation', 'Agriculture & Farming', 'Education',
        'Healthcare', 'Environment & Sustainability', 'Transportation',
        'Tourism', 'Urban Planning', 'Rural Development'
    ];

    const statuses = ['All', 'Submitted', 'Under Review', 'Shortlisted', 'Approved', 'Funded', 'Implemented'];

    const getStatusColor = (status) => {
        const colors = {
            'Submitted': 'status-submitted',
            'Under Review': 'status-review',
            'Shortlisted': 'status-shortlisted',
            'Approved': 'status-approved',
            'Funded': 'status-funded',
            'Implemented': 'status-implemented',
            'Rejected': 'status-rejected'
        };
        return colors[status] || 'status-default';
    };

    const formatCurrency = (amount) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} L`;
        }
        return `₹${amount.toLocaleString()}`;
    };

    return (
        <Layout>
            <div className="ideas-page">
                {/* Hero Section */}
                <div className="ideas-hero">
                    <div className="hero-content">
                        <h1>💡 Civic Innovation Hub</h1>
                        <p>Share your innovative ideas to make our community better</p>
                        <Link to="/dashboard/ideas/submit" className="btn btn-primary">
                            <FiPlus /> Submit Your Idea
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="ideas-filters">
                    <div className="filter-group">
                        <FiFilter />
                        <select 
                            value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <select 
                            value={filters.sortBy}
                            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                        >
                            <option value="createdAt">Latest</option>
                            <option value="popular">Most Popular</option>
                            <option value="trending">Trending</option>
                        </select>
                    </div>

                    <div className="search-group">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                </div>

                {/* Ideas Grid */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading ideas...</p>
                    </div>
                ) : ideas.length === 0 ? (
                    <div className="empty-state">
                        <FiAward size={64} />
                        <h3>No ideas found</h3>
                        <p>Be the first to submit an innovative idea!</p>
                        <Link to="/dashboard/ideas/submit" className="btn btn-primary">
                            Submit Idea
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="ideas-grid">
                            {ideas.map(idea => (
                                <Link 
                                    key={idea._id} 
                                    to={`/dashboard/ideas/${idea._id}`}
                                    className="idea-card"
                                >
                                    {idea.isFeatured && (
                                        <div className="featured-badge">
                                            <FiAward /> Featured
                                        </div>
                                    )}
                                    
                                    {/* Budget Allocation Badge for Funded Ideas */}
                                    {idea.status === 'Funded' && idea.budgetAllocation?.allocatedBudget && (
                                        <div className="funded-badge">
                                            <FiDollarSign />
                                            <span>{formatCurrency(idea.budgetAllocation.allocatedBudget)}</span>
                                            <span className="funded-label">FUNDED</span>
                                        </div>
                                    )}
                                    
                                    <div className="idea-header">
                                        <span className="idea-category">{idea.category}</span>
                                        <span className={`idea-status ${getStatusColor(idea.status)}`}>
                                            {idea.status === 'Funded' && <FiCheckCircle />}
                                            {idea.status}
                                        </span>
                                    </div>

                                    <h3 className="idea-title">{idea.title}</h3>
                                    <p className="idea-description">
                                        {idea.description.substring(0, 150)}...
                                    </p>

                                    {/* Show Budget Details for Funded Ideas */}
                                    {idea.status === 'Funded' && idea.budgetAllocation && (
                                        <div className="budget-info">
                                            <div className="budget-item">
                                                <FiDollarSign className="budget-icon" />
                                                <div>
                                                    <span className="budget-label">Allocated Budget</span>
                                                    <span className="budget-amount">{formatCurrency(idea.budgetAllocation.allocatedBudget)}</span>
                                                </div>
                                            </div>
                                            {idea.budgetAllocation.priorityScore && (
                                                <div className="priority-score">
                                                    <FiTrendingUp />
                                                    <span>Priority: {idea.budgetAllocation.priorityScore}/100</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="idea-meta">
                                        <div className="meta-item">
                                            <FiThumbsUp />
                                            <span>{idea.upvoteCount}</span>
                                        </div>
                                        <div className="meta-item">
                                            <FiEye />
                                            <span>{idea.viewCount}</span>
                                        </div>
                                        <div className="meta-item">
                                            <FiClock />
                                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="idea-footer">
                                        <div className="submitter">
                                            <div className="submitter-avatar">
                                                {idea.submittedBy?.name?.charAt(0)}
                                            </div>
                                            <span>{idea.submittedBy?.name}</span>
                                        </div>
                                        <div className="idea-impact">
                                            {idea.expectedImpact}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {pagination.hasMore && (
                            <div className="load-more">
                                <button className="btn btn-secondary">
                                    Load More Ideas
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Ideas;
