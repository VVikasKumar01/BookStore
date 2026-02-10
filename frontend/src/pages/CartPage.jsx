import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <h2>🛒 Your Cart is Empty</h2>
                    <p>Looks like you haven't added any books yet.</p>
                    <Link to="/" className="continue-shopping-btn">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1 className="cart-title">Shopping Cart</h1>
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item">
                                <img
                                    src={item.image || '/placeholder-book.png'}
                                    alt={item.title}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                    <h3>{item.title}</h3>
                                    <p className="cart-item-author">by {item.author}</p>
                                    <p className="cart-item-price">${item.price?.toFixed(2)}</p>
                                </div>
                                <div className="cart-item-qty">
                                    <button
                                        onClick={() =>
                                            updateQty(item._id, Math.max(1, item.qty - 1))
                                        }
                                        className="qty-btn"
                                    >
                                        -
                                    </button>
                                    <span className="qty-value">{item.qty}</span>
                                    <button
                                        onClick={() => updateQty(item._id, item.qty + 1)}
                                        className="qty-btn"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="cart-item-subtotal">
                                    ${(item.price * item.qty).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="remove-btn"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">FREE</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn">
                            Proceed to Checkout
                        </button>
                        <button onClick={clearCart} className="clear-cart-btn">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
