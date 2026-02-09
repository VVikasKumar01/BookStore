import PropTypes from 'prop-types';
import api from '../services/api';
import './ReviewForm.css';

const ReviewForm = ({ bookId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post(`/reviews/${bookId}`, {
                rating,
                title,
                comment
            });

            // Reset form
            setRating(5);
            setTitle('');
            setComment('');

            // Notify parent component
            if (onReviewSubmitted) {
                onReviewSubmitted(data);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3>Write a Review</h3>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label>Rating</label>
                    <div className="star-rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                            >
                                ★
                            </span>
                        ))}
                        <span className="rating-text">({rating} star{rating !== 1 ? 's' : ''})</span>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="review-title">Review Title</label>
                    <input
                        type="text"
                        id="review-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Sum up your review in one line"
                        maxLength={100}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="review-comment">Your Review</label>
                    <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        rows={5}
                        maxLength={1000}
                        required
                    />
                    <span className="char-count">{comment.length}/1000</span>
                </div>

                <button type="submit" className="submit-review-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

ReviewForm.propTypes = {
    bookId: PropTypes.string.isRequired,
    onReviewSubmitted: PropTypes.func,
};

export default ReviewForm;
