const Book = require('../models/Book');

// @desc    Fetch all books with search and filter
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    try {
        console.log('[DEBUG] getBooks called');
        const pageSize = Number(req.query.pageSize) || 12;
        const page = Number(req.query.page) || 1;
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};
        const category = req.query.category ? { category: req.query.category } : {};

        console.log(`[DEBUG] Querying Books with: ${JSON.stringify({ ...keyword, ...category })}`);
        const count = await Book.countDocuments({ ...keyword, ...category });
        const books = await Book.find({ ...keyword, ...category })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        console.log(`[DEBUG] Found ${books.length} books`);
        res.json({ books, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        console.error('[CRITICAL ERROR] getBooks failed:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
    try {
        const { title, author, price, category, description, stock, image } = req.body;

        const book = new Book({
            title,
            author,
            price,
            category,
            description,
            stock,
            image,
        });

        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
    try {
        const { title, author, price, category, description, stock, image } = req.body;

        const book = await Book.findById(req.params.id);

        if (book) {
            book.title = title || book.title;
            book.author = author || book.author;
            book.price = price || book.price;
            book.category = category || book.category;
            book.description = description || book.description;
            book.stock = stock !== undefined ? stock : book.stock;
            book.image = image || book.image;

            const updatedBook = await book.save();
            res.json(updatedBook);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            await Book.deleteOne({ _id: req.params.id });
            res.json({ message: 'Book removed' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
