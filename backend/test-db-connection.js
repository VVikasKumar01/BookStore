const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    console.log(`[TEST] Attempting to connect to MongoDB URI: ${uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED'}`);

    if (!uri) {
        console.error('[TEST] Error: MONGO_URI is not defined in .env file');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log(`[TEST] MongoDB Connected: ${conn.connection.host}`);
        
        // Try a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`[TEST] Collections: ${collections.map(c => c.name).join(', ')}`);

        process.exit(0);
    } catch (error) {
        console.error(`[TEST] Error: ${error.message}`);
        console.error(`[TEST] Code: ${error.code}`);
        console.error(`[TEST] CodeName: ${error.codeName}`);
        process.exit(1);
    }
};

connectDB();
