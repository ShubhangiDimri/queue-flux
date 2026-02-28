const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kairos_queue";
        
        // Set connection options for Mongoose 7+
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        
        console.log('✅ MongoDB Connected Successfully to Kairos DB');
        console.log(`📍 Connected to: ${MONGO_URI}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        console.error('💡 Make sure MongoDB is running locally on port 27017');
        console.error('   You can start it with: mongod');
        // Don't exit - allow server to run without DB for development
        console.warn('⚠️  Server will continue without database connection');
    }
};

module.exports = connectDB;