import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Todo from '../models/Todo.js';

dotenv.config();
const router = express.Router();

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Get all todos for user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create todo
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title field required" });

  try {
    const todo = await Todo.create({
      title,
      description: description || "",
      user: req.user
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
  const { title, completed, description } = req.body;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, completed, description: description || "" },
      { new: true }
    );
    if (!todo) return res.status(404).json({ msg: "Todo not found or unauthorized" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!deleted) return res.status(404).json({ msg: "Todo not found or unauthorized" });
    res.json({ msg: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
