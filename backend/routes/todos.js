// routes/todos.js (Corrected)

import express from 'express';
import Todo from '../models/Todo.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// 💡 FIX 1: Defined 'auth' middleware function here to resolve 'ReferenceError'
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 💡 FIX 2: Assuming standard payload (id property holds the user ID)
    req.user = decoded.id; 
    
    next();
  } catch (err) {
    // This catches the token expiration or invalid signature, resulting in the 401 redirect
    return res.status(401).json({ msg: 'Token is not valid' }); 
  }
};

// GET todos
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE todo
router.post('/', auth, async (req, res) => {
  try {
    // 💡 FIX 3a: Destructure 'title' and 'description'
    const { title, description } = req.body; 
    
    if (!title) return res.status(400).json({ message: "Title field required" });

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

// UPDATE todo
router.put('/:id', auth, async (req, res) => {
  try {
    // 💡 FIX 3b: Destructure 'title' and 'description' for updates
    const { title, completed, description } = req.body; 
    
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, completed, description: description || "" }, // Use corrected fields
      { new: true }
    );
    if (!todo) return res.status(404).json({ msg: "Todo not found or unauthorized" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE todo
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