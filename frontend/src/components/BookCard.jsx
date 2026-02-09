import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './BookCard.css';

const BookCard = ({ book }) => {
    const { addToCart } = useCart();

    return (
        <div className="book-card">
            <div className="book-image-container">
                <img
                    src={book.image || '/placeholder-book.png'}
                    alt={book.title}
                    className="book-image"
                />
                <div className="book-overlay">
                    <Link to={`/book/${book._id}`} className="view-btn">
                        View Details
                    </Link>
                </div>
            </div>
            <div className="book-info">
                <span className="book-category">{book.category}</span>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-footer">
                    <span className="book-price">${book.price?.toFixed(2)}</span>
                    <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(book)}
                        disabled={book.stock === 0}
                    >
                        {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
