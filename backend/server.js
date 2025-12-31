import 'dotenv/config'; // Must be first
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './src/config/db.js';

import adminRoutes from './src/routes/adminRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import hrRoutes from './src/routes/hrRoutes.js';
import interviewRoutes from './src/routes/interviewRoutes.js';
import questionRoutes from './src/routes/questionRoutes.js';

const app = express();
const PORT = process.env.PORT || 3045;

connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/questions', questionRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Export app for serverless environments (like Vercel)
export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
