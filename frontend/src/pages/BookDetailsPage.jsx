import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RatingDisplay from '../components/RatingDisplay';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import './BookDetailsPage.css';

const BookDetailsPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const { userInfo } = useAuth();

    const fetchBook = async () => {
        try {
            const { data } = await api.get(`/books/${id}`);
            setBook(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Book not found');
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchBook(), fetchReviews()]);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handleReviewSubmitted = () => {
        fetchBook();
        fetchReviews();
    };

    if (loading) {
        return (
            <div className="book-details-page">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="book-details-page">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-btn">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="book-details-page">
            <div className="book-details-container">
                <Link to="/" className="back-link">← Back to Books</Link>
                <div className="book-details-grid">
                    <div className="book-image-section">
                        <img
                            src={book.image || '/placeholder-book.png'}
                            alt={book.title}
                            className="book-detail-image"
                        />
                    </div>
                    <div className="book-info-section">
                        <span className="book-category-tag">{book.category}</span>
                        <h1 className="book-detail-title">{book.title}</h1>
                        <p className="book-detail-author">by <span>{book.author}</span></p>
                        <div className="book-detail-price">${book.price?.toFixed(2)}</div>
                        <div className="stock-info">
                            {book.stock > 0 ? (
                                <span className="in-stock">✓ In Stock ({book.stock} available)</span>
                            ) : (
                                <span className="out-of-stock">✗ Out of Stock</span>
                            )}
                        </div>
                        <div className="book-description">
                            <h3>Description</h3>
                            <p>{book.description || 'No description available for this book.'}</p>
                        </div>
                        <button
                            className="add-to-cart-btn-large"
                            onClick={() => addToCart(book)}
                            disabled={book.stock === 0}
                        >
                            {book.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>

                {/* Rating Display */}
                {book.ratings && book.ratings.count > 0 && (
                    <RatingDisplay ratings={book.ratings} />
                )}

                {/* Review Form - Only for logged-in users */}
                {userInfo && (
                    <ReviewForm
                        bookId={id}
                        onReviewSubmitted={handleReviewSubmitted}
                    />
                )}

                {/* Reviews List */}
                <ReviewList
                    reviews={reviews}
                    onReviewsUpdate={fetchReviews}
                />
            </div>
        </div>
    );
};

export default BookDetailsPage;
