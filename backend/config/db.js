const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`[CRITICAL DB ERROR]: ${error.message}`);
        // Throw error so server.js can handle it (e.g., exit process)
        throw error;
    }
};

module.exports = connectDB;
