import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" role="contentinfo">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-logo">📚 Bookstore</h3>
                    <p className="footer-tagline">
                        Your one-stop destination for amazing books
                    </p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <span className="social-icon">📘</span>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <span className="social-icon">🐦</span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <span className="social-icon">📷</span>
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Categories</h4>
                    <ul>
                        <li><Link to="/?category=Fiction">Fiction</Link></li>
                        <li><Link to="/?category=Non-Fiction">Non-Fiction</Link></li>
                        <li><Link to="/?category=Science">Science</Link></li>
                        <li><Link to="/?category=History">History</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>📧 <a href="mailto:info@bookstore.com">info@bookstore.com</a></p>
                    <p>📞 <a href="tel:+1234567890">+1 234 567 890</a></p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Bookstore. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
