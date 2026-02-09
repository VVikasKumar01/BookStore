const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
const getReviews = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { sort = 'latest' } = req.query;

        let sortOption = { createdAt: -1 }; // Default: latest

        if (sort === 'helpful') {
            sortOption = { helpful: -1, createdAt: -1 };
        } else if (sort === 'rating-high') {
            sortOption = { rating: -1, createdAt: -1 };
        } else if (sort === 'rating-low') {
            sortOption = { rating: 1, createdAt: -1 };
        }

        const reviews = await Review.find({
            bookId,
            status: 'approved'
        })
            .populate('userId', 'name')
            .sort(sortOption);

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/reviews/:bookId
// @access  Private
const createReview = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { rating, title, comment } = req.body;

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user already reviewed this book
        const existingReview = await Review.findOne({
            userId: req.user._id,
            bookId,
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }

        // Create review
        const review = await Review.create({
            userId: req.user._id,
            bookId,
            rating,
            title,
            comment,
            verifiedPurchase: false, // TODO: Check if user purchased this book
        });

        // Update book ratings
        await updateBookRatings(bookId);

        const populatedReview = await Review.findById(review._id).populate('userId', 'name');
        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns this review
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        const { rating, title, comment } = req.body;

        review.rating = rating || review.rating;
        review.title = title || review.title;
        review.comment = comment || review.comment;

        await review.save();

        // Update book ratings
        await updateBookRatings(review.bookId);

        const updatedReview = await Review.findById(review._id).populate('userId', 'name');
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns this review or is admin
        if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        const bookId = review.bookId;
        await review.deleteOne();

        // Update book ratings
        await updateBookRatings(bookId);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const userId = req.user._id;

        // Check if user already marked as helpful
        const alreadyMarked = review.helpful.includes(userId);

        if (alreadyMarked) {
            // Remove from helpful
            review.helpful = review.helpful.filter(id => id.toString() !== userId.toString());
        } else {
            // Add to helpful
            review.helpful.push(userId);
        }

        await review.save();

        const updatedReview = await Review.findById(review._id).populate('userId', 'name');
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to update book ratings
const updateBookRatings = async (bookId) => {
    const reviews = await Review.find({ bookId, status: 'approved' });

    if (reviews.length === 0) {
        await Book.findByIdAndUpdate(bookId, {
            'ratings.average': 0,
            'ratings.count': 0,
            'ratings.distribution': { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
        return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = (totalRating / reviews.length).toFixed(1);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
        distribution[review.rating]++;
    });

    await Book.findByIdAndUpdate(bookId, {
        'ratings.average': parseFloat(average),
        'ratings.count': reviews.length,
        'ratings.distribution': distribution,
    });
};

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
};
