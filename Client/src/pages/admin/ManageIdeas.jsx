import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ideaAPI from '../../services/ideaAPI';
import { 
    FiThumbsUp, FiEye, FiFilter, FiSearch, FiMessageSquare,
    FiCheckCircle, FiXCircle, FiClock
} from 'react-icons/fi';
import './ManageIdeas.css';

const ManageIdeas = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'All',
        status: 'All',
        search: '',
        sortBy: 'createdAt'
    });
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({
        status: '',
        message: '',
        newStatus: '',
        estimatedImplementationDate: ''
    });

    useEffect(() => {
        fetchIdeas();
    }, [filters]);

    const fetchIdeas = async () => {
        try {
            setLoading(true);
            const response = await ideaAPI.getAllIdeas(filters);
            setIdeas(response.data.ideas);
        } catch (error) {
            console.error('Error fetching ideas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResponse = async (e) => {
        e.preventDefault();
        try {
            const response = await ideaAPI.addGovernmentResponse(selectedIdea._id, responseData);
            
            if (response.success) {
                // Success - close modal and refresh
                setShowResponseModal(false);
                setResponseData({ status: '', message: '', newStatus: '', estimatedImplementationDate: '' });
                await fetchIdeas();
                
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:1rem 1.5rem;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10000;animation:slideIn 0.3s ease;';
                successDiv.innerHTML = '✓ Response added successfully!';
                document.body.appendChild(successDiv);
                setTimeout(() => successDiv.remove(), 3000);
            }
        } catch (error) {
            console.error('Error adding response:', error);
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#ef4444;color:white;padding:1rem 1.5rem;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10000;';
            errorDiv.innerHTML = '✗ ' + (error.response?.data?.message || 'Failed to add response');
            document.body.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 3000);
        }
    };

    const categories = [
        'All', 'Revenue Generation', 'Infrastructure Development', 
        'Technology & Innovation', 'Agriculture & Farming', 'Education',
        'Healthcare', 'Environment & Sustainability', 'Transportation'
    ];

    const statuses = ['All', 'Submitted', 'Under Review', 'Shortlisted', 'Approved', 'Implemented', 'Rejected'];

    const getStatusColor = (status) => {
        const colors = {
            'Submitted': 'status-submitted',
            'Under Review': 'status-review',
            'Shortlisted': 'status-shortlisted',
            'Approved': 'status-approved',
            'Implemented': 'status-implemented',
            'Rejected': 'status-rejected'
        };
        return colors[status] || 'status-default';
    };

    return (
        <Layout>
            <div className="manage-ideas-page">
                <div className="page-header">
                    <div>
                        <h1>Manage Ideas</h1>
                        <p>Review and respond to citizen ideas</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
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
                            <option value="upvoteCount">Most Upvoted</option>
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

                {/* Ideas Table */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading ideas...</p>
                    </div>
                ) : ideas.length === 0 ? (
                    <div className="empty-state">
                        <h3>No ideas found</h3>
                        <p>No citizen ideas match your filters</p>
                    </div>
                ) : (
                    <div className="ideas-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Submitter</th>
                                    <th>Status</th>
                                    <th>Engagement</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ideas.map(idea => (
                                    <tr key={idea._id}>
                                        <td>
                                            <Link to={`/dashboard/ideas/${idea._id}`} className="idea-link">
                                                {idea.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <span className="category-badge">{idea.category}</span>
                                        </td>
                                        <td>{idea.submittedBy?.name}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(idea.status)}`}>
                                                {idea.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="engagement-stats">
                                                <span><FiThumbsUp /> {idea.upvoteCount}</span>
                                                <span><FiEye /> {idea.viewCount}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(idea.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link 
                                                    to={`/dashboard/ideas/${idea._id}`}
                                                    className="action-btn view-btn"
                                                    title="View Details"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    className="action-btn respond-btn"
                                                    onClick={() => {
                                                        setSelectedIdea(idea);
                                                        setShowResponseModal(true);
                                                    }}
                                                    title="Add Response"
                                                >
                                                    <FiMessageSquare />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Response Modal */}
                {showResponseModal && (
                    <div className="modal-overlay" onClick={() => setShowResponseModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Add Government Response</h2>
                            <p className="modal-subtitle">Responding to: {selectedIdea?.title}</p>

                            <form onSubmit={handleAddResponse}>
                                <div className="form-group">
                                    <label>Response Status</label>
                                    <select
                                        value={responseData.status}
                                        onChange={(e) => setResponseData({...responseData, status: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Acknowledged">Acknowledged</option>
                                        <option value="Under Consideration">Under Consideration</option>
                                        <option value="Approved for Implementation">Approved for Implementation</option>
                                        <option value="Not Feasible">Not Feasible</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Update Idea Status</label>
                                    <select
                                        value={responseData.newStatus}
                                        onChange={(e) => setResponseData({...responseData, newStatus: e.target.value})}
                                    >
                                        <option value="">Keep Current Status</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Shortlisted">Shortlisted</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Response Message *</label>
                                    <textarea
                                        value={responseData.message}
                                        onChange={(e) => setResponseData({...responseData, message: e.target.value})}
                                        placeholder="Provide detailed feedback to the citizen..."
                                        required
                                        rows={5}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Estimated Implementation Date</label>
                                    <input
                                        type="date"
                                        value={responseData.estimatedImplementationDate}
                                        onChange={(e) => setResponseData({...responseData, estimatedImplementationDate: e.target.value})}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setShowResponseModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Submit Response
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManageIdeas;
