// models/Todo.js (Corrected)
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // 💡 Renamed from 'task' to 'title'
    title: { type: String, required: true }, 
    
    completed: { type: Boolean, default: false },
    
    // 💡 Renamed from 'name' to 'description'
    description: { type: String, default: "" } 
  },
  { timestamps: true }
);

export default mongoose.model('Todo', todoSchema);