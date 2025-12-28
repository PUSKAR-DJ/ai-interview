import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './src/config/db.js';

import adminRoutes from './src/routes/adminRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import hrRoutes from './src/routes/hrRoutes.js';
import interviewRoutes from './src/routes/interviewRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3045;

connectDB();

// Middleware
app.use(cors({ 
  origin: "http://localhost:5173", // Your frontend URL
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

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});