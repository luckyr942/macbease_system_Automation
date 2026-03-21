import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import { apiKeyAuth } from './middleware/auth';

// Routes
import userRoutes from './routes/userRoutes';
import communityRoutes from './routes/communityRoutes';
import campaignRoutes from './routes/campaignRoutes';
import notificationRoutes from './routes/notificationRoutes';
import eventRoutes from './routes/eventRoutes';
import ticketRoutes from './routes/ticketRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import automationLogRoutes from './routes/automationLogRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'macbease-api', timestamp: new Date().toISOString() });
});

// API Routes (protected)
app.use('/users', apiKeyAuth, userRoutes);
app.use('/communities', apiKeyAuth, communityRoutes);
app.use('/campaigns', apiKeyAuth, campaignRoutes);
app.use('/notifications', apiKeyAuth, notificationRoutes);
app.use('/events', apiKeyAuth, eventRoutes);
app.use('/tickets', apiKeyAuth, ticketRoutes);
app.use('/analytics', apiKeyAuth, analyticsRoutes);
app.use('/automation-logs', apiKeyAuth, automationLogRoutes);
app.use('/admins', apiKeyAuth, adminRoutes);

// Start
const start = async () => {
    await connectDB();

    // Import worker (starts processing in background)
    try {
        require('./workers/emailWorker');
        console.log('📧 Email worker started');
    } catch (err) {
        console.warn('⚠️  Email worker not started (Redis may not be available)');
    }

    app.listen(PORT, () => {
        console.log(`🚀 MacBease API running on port ${PORT}`);
    });
};

start().catch(console.error);

export default app;
