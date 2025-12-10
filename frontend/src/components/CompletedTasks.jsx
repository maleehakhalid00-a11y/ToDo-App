import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "../../api";
import { useNavigate } from "react-router-dom"; 

export default function CompletedTasks({ token }) {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // --- Utility Functions ---
  
  const goToDashboard = () => {
      navigate('/dashboard'); 
  };
  
  // --- API Functions ---

  useEffect(() => {
    if (!token) return;

    const fetchCompleted = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/todos`, {
          headers: { "x-auth-token": token },
        });
        setCompletedTodos(res.data.filter((t) => t.completed));
      } catch (err) {
        console.error("Failed to fetch completed todos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [token]);

  // 💡 IMPROVED: Mark as incomplete with exit animation
  const markIncomplete = useCallback(
    async (id) => {
      // 1. Trigger the exit animation class
      setCompletedTodos((prev) => 
        prev.map((t) => (t._id === id ? { ...t, isExiting: true } : t))
      );

      // 2. Perform API call and UI removal after a short delay
      setTimeout(async () => {
        try {
          await axios.put(`${API}/todos/${id}`, { completed: false }, { headers: { "x-auth-token": token } });
          // Remove from list after successful API call
          setCompletedTodos((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
          console.error("Failed to mark todo as incomplete:", err);
          // If API fails, revert the exit state
          setCompletedTodos((prev) => 
            prev.map((t) => (t._id === id ? { ...t, isExiting: false } : t))
          );
        }
      }, 300); // Match this delay to the CSS transition duration
    },
    [token]
  );

  const deleteTodo = useCallback(
    async (id) => {
      // Optimistically remove from UI
      setCompletedTodos((prev) => prev.filter((t) => t._id !== id));
      
      try {
        await axios.delete(`${API}/todos/${id}`, { headers: { "x-auth-token": token } });
      } catch (err) {
        console.error("Failed to delete completed todo:", err);
        // If API fails, you might want to re-add the todo here
      }
    },
    [token]
  );

  // --- Render ---

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-[#101F41]">
      
      <div className="flex items-center justify-start mb-8 w-full max-w-4xl mx-auto">
        
        <button 
            onClick={goToDashboard}
            className="text-white text-xl p-3 mr-4 rounded-full transition duration-200 
                       hover:bg-white/10 hover:text-[#0047AB] focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
            aria-label="Go back to Dashboard"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        
        <h2 className="text-3xl font-extrabold text-[#3CB371] tracking-tight">
            ✅ Completed Task Archive
        </h2>
      </div>

      <ul className="w-full max-w-4xl mx-auto space-y-4">
        {loading ? (
           <li className="text-center text-white/80 p-6 bg-white/10 rounded-xl shadow-lg flex items-center justify-center">
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
             Retrieving archive...
           </li>
        ) : completedTodos.length === 0 ? (
          <li className="text-center text-white/80 p-8 bg-white/10 rounded-xl shadow-lg border border-dashed border-white/20">
            Keep crushing it! This list is empty.
          </li>
        ) : (
          completedTodos.map((todo) => (
            <li
              key={todo._id}
              // 💡 CSS Class updated to include transition and exit animation
              className={`flex justify-between items-start p-5 bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-[1.005] ${todo.isExiting ? 'opacity-0 translate-x-full h-0 p-0 mb-0' : ''}`}
            >
              {/* Task Content Area */}
              <div className="text-gray-800 flex-grow text-left pr-4">
                  {/* Title (Line-through) */}
                  <h4 className="text-lg font-bold text-gray-500 line-through mb-1">{todo.title}</h4>
                  
                  {/* Description Display */}
                  {todo.description && (
                      <p className="text-sm text-gray-400 border-l-2 border-gray-200 pl-3 italic">
                          {todo.description}
                      </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 items-center flex-shrink-0">
                <button
                  onClick={() => markIncomplete(todo._id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition duration-200 font-semibold shadow-md transform hover:scale-[1.05]"
                >
                  Undo
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200 font-semibold shadow-md transform hover:scale-[1.05]"
                >
                  Permanently Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}