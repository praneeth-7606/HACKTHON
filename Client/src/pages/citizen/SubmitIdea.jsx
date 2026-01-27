import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ideaAPI from '../../services/ideaAPI';
import { FiSend, FiX } from 'react-icons/fi';
import './SubmitIdea.css';

const SubmitIdea = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        subCategory: '',
        targetArea: '',
        expectedImpact: 'Local',
        estimatedBudget: {
            amount: '',
            description: ''
        },
        timeline: {
            proposed: '',
            description: ''
        },
        benefits: [''],
        challenges: [''],
        resources: [''],
        tags: '',
        visibility: 'Public'
    });

    const categories = [
        'Revenue Generation',
        'Infrastructure Development',
        'Technology & Innovation',
        'Agriculture & Farming',
        'Education',
        'Healthcare',
        'Environment & Sustainability',
        'Transportation',
        'Tourism',
        'Public Safety',
        'Urban Planning',
        'Rural Development',
        'Employment & Skills',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                benefits: formData.benefits.filter(b => b.trim()),
                challenges: formData.challenges.filter(c => c.trim()),
                resources: formData.resources.filter(r => r.trim()),
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };

            await ideaAPI.submitIdea(submitData);
            alert('Idea submitted successfully!');
            navigate('/dashboard/ideas');
        } catch (error) {
            console.error('Error submitting idea:', error);
            alert(error.response?.data?.message || 'Failed to submit idea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="submit-idea-page">
                <div className="page-header">
                    <h1>💡 Submit Your Innovative Idea</h1>
                    <p>Share your vision to improve our community</p>
                </div>

                <form onSubmit={handleSubmit} className="idea-form">
                    {/* Basic Information */}
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        
                        <div className="form-group">
                            <label>Idea Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your idea a compelling title (min 10 characters)"
                                required
                                minLength={10}
                                maxLength={200}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your idea in detail (min 50 characters)"
                                required
                                minLength={50}
                                rows={6}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Sub-Category</label>
                                <input
                                    type="text"
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                    placeholder="Optional sub-category"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Target Area/Location *</label>
                                <input
                                    type="text"
                                    name="targetArea"
                                    value={formData.targetArea}
                                    onChange={handleChange}
                                    placeholder="e.g., Hyderabad, Telangana"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Expected Impact *</label>
                                <select
                                    name="expectedImpact"
                                    value={formData.expectedImpact}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Local">Local</option>
                                    <option value="District">District</option>
                                    <option value="State">State</option>
                                    <option value="National">National</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Budget & Timeline */}
                    <div className="form-section">
                        <h2>Budget & Timeline</h2>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Estimated Budget (₹)</label>
                                <input
                                    type="number"
                                    name="estimatedBudget.amount"
                                    value={formData.estimatedBudget.amount}
                                    onChange={handleChange}
                                    placeholder="Approximate budget required"
                                    min={0}
                                />
                            </div>

                            <div className="form-group">
                                <label>Proposed Timeline</label>
                                <input
                                    type="text"
                                    name="timeline.proposed"
                                    value={formData.timeline.proposed}
                                    onChange={handleChange}
                                    placeholder="e.g., 6 months, 1 year"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Budget Description</label>
                            <textarea
                                name="estimatedBudget.description"
                                value={formData.estimatedBudget.description}
                                onChange={handleChange}
                                placeholder="Explain how the budget will be utilized"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="form-section">
                        <h2>Expected Benefits</h2>
                        {formData.benefits.map((benefit, index) => (
                            <div key={index} className="array-field">
                                <input
                                    type="text"
                                    value={benefit}
                                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                    placeholder={`Benefit ${index + 1}`}
                                />
                                {formData.benefits.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayField('benefits', index)}
                                        className="remove-btn"
                                    >
                                        <FiX />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayField('benefits')}
                            className="add-field-btn"
                        >
                            + Add Benefit
                        </button>
                    </div>

                    {/* Challenges */}
                    <div className="form-section">
                        <h2>Potential Challenges</h2>
                        {formData.challenges.map((challenge, index) => (
                            <div key={index} className="array-field">
                                <input
                                    type="text"
                                    value={challenge}
                                    onChange={(e) => handleArrayChange('challenges', index, e.target.value)}
                                    placeholder={`Challenge ${index + 1}`}
                                />
                                {formData.challenges.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayField('challenges', index)}
                                        className="remove-btn"
                                    >
                                        <FiX />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayField('challenges')}
                            className="add-field-btn"
                        >
                            + Add Challenge
                        </button>
                    </div>

                    {/* Resources */}
                    <div className="form-section">
                        <h2>Required Resources</h2>
                        {formData.resources.map((resource, index) => (
                            <div key={index} className="array-field">
                                <input
                                    type="text"
                                    value={resource}
                                    onChange={(e) => handleArrayChange('resources', index, e.target.value)}
                                    placeholder={`Resource ${index + 1}`}
                                />
                                {formData.resources.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayField('resources', index)}
                                        className="remove-btn"
                                    >
                                        <FiX />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayField('resources')}
                            className="add-field-btn"
                        >
                            + Add Resource
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="form-section">
                        <h2>Additional Information</h2>
                        
                        <div className="form-group">
                            <label>Tags (comma-separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g., innovation, sustainability, community"
                            />
                        </div>

                        <div className="form-group">
                            <label>Visibility</label>
                            <select
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleChange}
                            >
                                <option value="Public">Public - Visible to everyone</option>
                                <option value="Private">Private - Only visible to admins</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/ideas')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : (
                                <>
                                    <FiSend /> Submit Idea
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default SubmitIdea;
