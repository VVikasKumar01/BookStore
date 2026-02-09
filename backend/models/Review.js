const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating'],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: [true, 'Please add a review title'],
            maxlength: 100,
        },
        comment: {
            type: String,
            required: [true, 'Please add a review comment'],
            maxlength: 1000,
        },
        verifiedPurchase: {
            type: Boolean,
            default: false,
        },
        helpful: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        reported: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved', // Auto-approve for now, can add moderation later
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews from same user for same book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ bookId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
