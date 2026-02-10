import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import './HomePage.css';

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Fantasy', 'Mystery', 'Romance'];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (keyword) params.append('keyword', keyword);
                if (category) params.append('category', category);
                params.append('page', page);

                const { data } = await api.get(`/books?${params.toString()}`);
                setBooks(data.books);
                setPages(data.pages);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch books');
                setLoading(false);
            }
        };
        fetchBooks();
    }, [keyword, category, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        setSearchParams(params);
        setPage(1);
    };

    const handleCategoryClick = (cat) => {
        setCategory(cat === category ? '' : cat);
        setPage(1);
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover Your Next <span className="highlight">Favorite Book</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore thousands of books across all genres
                    </p>
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search for books..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            🔍 Search
                        </button>
                    </form>
                </div>
            </section>

            <section className="categories-section">
                <h2 className="section-title">Browse by Category</h2>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-btn ${category === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            <section className="books-section">
                <h2 className="section-title">
                    {category ? `${category} Books` : 'All Books'}
                </h2>
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading books...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : books.length === 0 ? (
                    <div className="no-books">
                        <p>No books found. Try a different search.</p>
                    </div>
                ) : (
                    <>
                        <div className="books-grid">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                        {pages > 1 && (
                            <div className="pagination">
                                {[...Array(pages).keys()].map((x) => (
                                    <button
                                        key={x + 1}
                                        className={`page-btn ${page === x + 1 ? 'active' : ''}`}
                                        onClick={() => setPage(x + 1)}
                                    >
                                        {x + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default HomePage;
