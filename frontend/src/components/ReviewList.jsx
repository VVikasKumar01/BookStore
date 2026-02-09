import PropTypes from 'prop-types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ReviewList.css';

const ReviewList = ({ reviews, onReviewsUpdate }) => {
    const { userInfo } = useAuth();
    const [sortBy, setSortBy] = useState('latest');

    const handleHelpful = async (reviewId) => {
        try {
            await api.put(`/reviews/${reviewId}/helpful`);

            // Update reviews list
            if (onReviewsUpdate) {
                onReviewsUpdate();
            }
        } catch (error) {
            console.error('Error marking review as helpful:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            await api.delete(`/reviews/${reviewId}`);

            if (onReviewsUpdate) {
                onReviewsUpdate();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const renderStars = (rating) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="no-reviews">
                <p>No reviews yet. Be the first to review this book!</p>
            </div>
        );
    }

    return (
        <div className="review-list-container">
            <div className="review-list-header">
                <h3>Customer Reviews ({reviews.length})</h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                >
                    <option value="latest">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="rating-high">Highest Rating</option>
                    <option value="rating-low">Lowest Rating</option>
                </select>
            </div>

            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review._id} className="review-item">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <span className="reviewer-name">{review.userId?.name || 'Anonymous'}</span>
                                {review.verifiedPurchase && (
                                    <span className="verified-badge">✓ Verified Purchase</span>
                                )}
                            </div>
                            <span className="review-date">{formatDate(review.createdAt)}</span>
                        </div>

                        <div className="review-rating">
                            {renderStars(review.rating)}
                        </div>

                        <h4 className="review-title">{review.title}</h4>
                        <p className="review-comment">{review.comment}</p>

                        <div className="review-actions">
                            {userInfo && (
                                <button
                                    onClick={() => handleHelpful(review._id)}
                                    className={`helpful-btn ${review.helpful?.includes(userInfo._id) ? 'active' : ''}`}
                                >
                                    👍 Helpful ({review.helpful?.length || 0})
                                </button>
                            )}

                            {userInfo && (userInfo._id === review.userId?._id || userInfo.role === 'admin') && (
                                <button
                                    onClick={() => handleDelete(review._id)}
                                    className="delete-review-btn"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

ReviewList.propTypes = {
    reviews: PropTypes.array.isRequired,
    onReviewsUpdate: PropTypes.func,
};

export default ReviewList;
