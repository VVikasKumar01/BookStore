import PropTypes from 'prop-types';
import './RatingDisplay.css';

const RatingDisplay = ({ ratings }) => {
    if (!ratings || ratings.count === 0) {
        return (
            <div className="rating-display">
                <p className="no-ratings">No ratings yet</p>
            </div>
        );
    }

    const { average, count, distribution } = ratings;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= fullStars) {
                        return <span key={star} className="star filled">★</span>;
                    } else if (star === fullStars + 1 && hasHalfStar) {
                        return <span key={star} className="star half">★</span>;
                    } else {
                        return <span key={star} className="star empty">★</span>;
                    }
                })}
            </div>
        );
    };

    const getPercentage = (starCount) => {
        return count > 0 ? Math.round((starCount / count) * 100) : 0;
    };

    return (
        <div className="rating-display">
            <div className="rating-summary">
                <div className="average-rating">
                    <span className="rating-number">{average?.toFixed(1) || '0.0'}</span>
                    {renderStars(average || 0)}
                    <span className="rating-count">{count} {count === 1 ? 'review' : 'reviews'}</span>
                </div>
            </div>

            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="distribution-row">
                        <span className="star-label">{star} ★</span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${getPercentage(distribution[star])}%` }}
                            ></div>
                        </div>
                        <span className="percentage">{getPercentage(distribution[star])}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

RatingDisplay.propTypes = {
    ratings: PropTypes.shape({
        average: PropTypes.number,
        count: PropTypes.number,
        distribution: PropTypes.object,
    }),
};

export default RatingDisplay;
