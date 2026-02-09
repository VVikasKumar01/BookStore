const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        author: {
            type: String,
            required: [true, 'Please add an author'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        description: {
            type: String,
            required: false,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        image: {
            type: String,
            required: false,
            default: '/images/sample.jpg',
        },
        ratings: {
            average: {
                type: Number,
                default: 0,
            },
            count: {
                type: Number,
                default: 0,
            },
            distribution: {
                5: { type: Number, default: 0 },
                4: { type: Number, default: 0 },
                3: { type: Number, default: 0 },
                2: { type: Number, default: 0 },
                1: { type: Number, default: 0 },
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Book', bookSchema);
