const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
// Connect to database and Start Server
const startServer = async () => {
    try {
        console.log(`[DEBUG] Attempting to connect to MongoDB URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED'}`);
        await connectDB();

        const app = express();

        // Middleware
        app.use(express.json());
        app.use(cors());

        // Basic Route
        app.get('/', (req, res) => {
            res.send('Bookstore API is running...');
        });

        // Routes
        app.use('/api/users', require('./routes/userRoutes'));
        app.use('/api/books', require('./routes/bookRoutes'));
        app.use('/api/reviews', require('./routes/reviewRoutes'));


        // Error Handling Middleware
        app.use((err, req, res, next) => {
            const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
            res.status(statusCode);
            res.json({
                message: err.message,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            });
        });

        const PORT = process.env.PORT || 5000;

        // Health Check Endpoint
        app.get('/api/health', (req, res) => {
            res.status(200).json({ status: 'UP', timestamp: new Date() });
        });

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    } catch (error) {
        console.error('[CRITICAL] Failed to connect to database. Server shutting down.', error);
        process.exit(1);
    }
};

startServer();

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error('[CRITICAL] Uncaught Exception:', err);
    // Keep server running if possible, but logging is key
});

process.on('unhandledRejection', (err) => {
    console.error('[CRITICAL] Unhandled Rejection:', err);
});
