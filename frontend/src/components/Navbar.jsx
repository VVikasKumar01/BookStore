import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { userInfo, logout } = useAuth();
    const { cartItems } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu} aria-label="Bookstore Home">
                    <span className="logo-icon" aria-hidden="true">📚</span>
                    <span className="logo-text">Bookstore</span>
                </Link>

                {/* Hamburger Menu Button */}
                <button
                    className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="navbar-links"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                <div 
                    id="navbar-links"
                    className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}
                >
                    <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                        Home
                    </Link>
                    <Link to="/cart" className="nav-link cart-link" onClick={closeMobileMenu} aria-label={`Shopping cart with ${cartItems.length} items`}>
                        <span className="cart-icon" aria-hidden="true">🛒</span>
                        {cartItems.length > 0 && (
                            <span className="cart-badge" aria-label={`${cartItems.length} items in cart`}>
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                    {userInfo ? (
                        <div className="user-menu">
                            <span className="user-name" aria-label={`Logged in as ${userInfo.name}`}>
                                {userInfo.name}
                            </span>
                            {userInfo.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-link" onClick={closeMobileMenu}>
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link login-link" onClick={closeMobileMenu}>
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="mobile-overlay" 
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                ></div>
            )}
        </nav>
    );
};

export default Navbar;
