import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

dotenv.config();

const app = express();

// --- MIDDLEWARES ---
app.use(express.json());

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173', // allow requests from your frontend
  credentials: true,
}));

// --- ROUTES ---
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// --- CONNECT MONGO ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
