import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ideaAPI from '../../services/ideaAPI';
import { FiThumbsUp, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './MyIdeas.css';

const MyIdeas = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchMyIdeas();
    }, [filter]);

    const fetchMyIdeas = async () => {
        try {
            setLoading(true);
            const response = await ideaAPI.getAllIdeas({ 
                myIdeas: true,
                status: filter !== 'All' ? filter : undefined
            });
            setIdeas(response.data.ideas);
        } catch (error) {
            console.error('Error fetching ideas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this idea?')) return;

        try {
            await ideaAPI.deleteIdea(id);
            setIdeas(ideas.filter(idea => idea._id !== id));
            alert('Idea deleted successfully');
        } catch (error) {
            console.error('Error deleting idea:', error);
            alert('Failed to delete idea');
        }
    };

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

    const statuses = ['All', 'Submitted', 'Under Review', 'Shortlisted', 'Approved', 'Implemented', 'Rejected'];

    return (
        <Layout>
            <div className="my-ideas-page">
                <div className="page-header">
                    <div>
                        <h1>My Ideas</h1>
                        <p>Manage and track your submitted ideas</p>
                    </div>
                    <Link to="/dashboard/ideas/submit" className="btn btn-primary">
                        <FiPlus /> Submit New Idea
                    </Link>
                </div>

                <div className="filters-bar">
                    {statuses.map(status => (
                        <button
                            key={status}
                            className={`filter-btn ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your ideas...</p>
                    </div>
                ) : ideas.length === 0 ? (
                    <div className="empty-state">
                        <h3>No ideas found</h3>
                        <p>Start sharing your innovative ideas with the government!</p>
                        <Link to="/dashboard/ideas/submit" className="btn btn-primary">
                            Submit Your First Idea
                        </Link>
                    </div>
                ) : (
                    <div className="ideas-list">
                        {ideas.map(idea => (
                            <div key={idea._id} className="idea-item">
                                <div className="idea-main">
                                    <div className="idea-header">
                                        <Link to={`/dashboard/ideas/${idea._id}`} className="idea-title">
                                            {idea.title}
                                        </Link>
                                        <span className={`status-badge ${getStatusColor(idea.status)}`}>
                                            {idea.status}
                                        </span>
                                    </div>

                                    <p className="idea-description">
                                        {idea.description.substring(0, 200)}...
                                    </p>

                                    <div className="idea-meta">
                                        <span className="category">{idea.category}</span>
                                        <span className="meta-item">
                                            <FiThumbsUp /> {idea.upvoteCount} upvotes
                                        </span>
                                        <span className="meta-item">
                                            <FiEye /> {idea.viewCount} views
                                        </span>
                                        <span className="date">
                                            {new Date(idea.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {idea.governmentResponse?.message && (
                                        <div className="gov-response-preview">
                                            <strong>Government Response:</strong>
                                            <p>{idea.governmentResponse.message.substring(0, 150)}...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="idea-actions">
                                    <Link 
                                        to={`/dashboard/ideas/${idea._id}`}
                                        className="action-btn"
                                    >
                                        View
                                    </Link>
                                    <button 
                                        className="action-btn"
                                        onClick={() => handleDelete(idea._id)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyIdeas;
