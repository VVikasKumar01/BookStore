import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const AdminPage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        image: '',
    });

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await api.get('/books');
            setBooks(data.books);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBook) {
                await api.put(`/books/${editingBook._id}`, {
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                });
            } else {
                await api.post('/books', {
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                });
            }
            fetchBooks();
            resetForm();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price,
            category: book.category,
            description: book.description || '',
            stock: book.stock,
            image: book.image || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/books/${id}`);
                fetchBooks();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            price: '',
            category: '',
            description: '',
            stock: '',
            image: '',
        });
        setEditingBook(null);
        setShowForm(false);
    };

    const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Fantasy', 'Mystery', 'Romance'];

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>📚 Admin Dashboard</h1>
                    <button
                        className="add-book-btn"
                        onClick={() => {
                            resetForm();
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm ? '✕ Cancel' : '+ Add New Book'}
                    </button>
                </div>

                {showForm && (
                    <div className="book-form-container">
                        <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                        <form onSubmit={handleSubmit} className="book-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Author</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                />
                            </div>
                            <button type="submit" className="submit-btn">
                                {editingBook ? 'Update Book' : 'Add Book'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="books-table-container">
                    <h2>All Books ({books.length})</h2>
                    {loading ? (
                        <p className="loading-text">Loading...</p>
                    ) : (
                        <table className="books-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book._id}>
                                        <td>
                                            <img
                                                src={book.image || '/placeholder-book.png'}
                                                alt={book.title}
                                                className="table-book-image"
                                            />
                                        </td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.category}</td>
                                        <td>${book.price?.toFixed(2)}</td>
                                        <td>{book.stock}</td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(book)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(book._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
