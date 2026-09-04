require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const requireDb = require('./middleware/requireDb');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

const allowedOrigins = [process.env.CORS_ORIGIN_DEV, process.env.CORS_ORIGIN_PROD].filter(Boolean);
const vercelPreviewRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

app.use(cors({
    origin(origin, callback) {
        // Allow non-browser tools (curl, server-to-server, Postman) which send no Origin header
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
            return callback(null, true);
        }
        const corsError = new Error('Not allowed by CORS');
        corsError.statusCode = 403;
        return callback(corsError);
    },
    credentials: true,
}));

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Aarmbh Adornments backend is running',
        database: {
            connected: connectDB.isConnected(),
            state: connectDB.connectionState(),
        },
    });
});

app.use('/admin', requireDb, adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start listening immediately so the health check and CORS responses never
// hang waiting on the database - DB connection happens in the background.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

connectDB();
