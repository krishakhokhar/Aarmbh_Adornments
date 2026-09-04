const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI is not set - starting without a database connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 20000,
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
    }
};

const READY_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

const isConnected = () => mongoose.connection.readyState === 1;
const connectionState = () => READY_STATES[mongoose.connection.readyState] || 'unknown';

module.exports = connectDB;
module.exports.isConnected = isConnected;
module.exports.connectionState = connectionState;
