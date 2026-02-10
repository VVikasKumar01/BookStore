const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[CRITICAL DB ERROR]: ${error.message}`);
        // Do NOT exit process, let the server stay alive for debugging
        // process.exit(1); 
    }
};

module.exports = connectDB;
