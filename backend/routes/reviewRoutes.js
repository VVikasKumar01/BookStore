const express = require('express');
const router = express.Router();
const {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/:bookId', getReviews);

// Protected routes
router.post('/:bookId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markHelpful);

module.exports = router;
