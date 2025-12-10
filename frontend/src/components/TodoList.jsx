import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "../../api";
import Header from "./Header";
import { useNavigate } from "react-router-dom"; 

export default function TodoList({ token, setToken }) {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState(""); 
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setToken("");
        navigate('/login'); 
    }, [setToken, navigate]);

    const goToDashboard = () => {
        navigate('/dashboard'); 
    };
    useEffect(() => {
        if (!token) {
            handleLogout();
            return; 
        }

        const fetchTodos = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/todos`, {
                    headers: { "x-auth-token": token },
                });
                setTodos(res.data.filter((t) => !t.completed));
            } catch (err) {
                console.error("Failed to fetch todos:", err);
                if (err.response?.status === 401) handleLogout(); 
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, [token, handleLogout]);
    const addTodo = useCallback(async () => {
        if (!title.trim()) return;

        try {
            const res = await axios.post(
                `${API}/todos`,
                { title, description }, 
                { headers: { "x-auth-token": token } }
            );
            setTodos((prevTodos) => [res.data, ...prevTodos]);
            setTitle(""); 
            setDescription("");
        } catch (err) {
            console.error("Failed to add todo:", err);
        }
    }, [token, title, description]); 
    const toggleComplete = useCallback(
        async (id, completed) => {
            try {
                const res = await axios.put(
                    `${API}/todos/${id}`,
                    { completed: !completed },
                    { headers: { "x-auth-token": token } }
                );

                setTodos((prevTodos) => {
                    if (res.data.completed) {
                        setTimeout(() => {
                            setTodos(current => current.filter((t) => t._id !== id));
                        }, 300);
                        return prevTodos.map((t) => (t._id === id ? { ...t, isExiting: true } : t));
                    }
                    return prevTodos.map((t) => (t._id === id ? res.data : t));
                });
            } catch (err) {
                console.error("Failed to toggle todo:", err);
            }
        },
        [token]
    );
    
    const deleteTodo = useCallback(
        async (id) => {
            try {
                await axios.delete(`${API}/todos/${id}`, {
                    headers: { "x-auth-token": token },
                });
                setTodos((prevTodos) => prevTodos.filter((t) => t._id !== id));
            } catch (err) {
                console.error("Failed to delete todo:", err);
            }
        },
        [token]
    );
    

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-[#101F41]"> 
            <div className="flex items-start mb-8 w-full max-w-7xl mx-auto">
                <button 
                    onClick={goToDashboard}
                    className="text-white text-xl p-3 mr-6 mt-4 rounded-full transition duration-200 
                               hover:bg-white/10 hover:text-[#0047AB] focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
                    aria-label="Go back to Dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                
                <div className="flex-grow">
                    <Header taskCount={todos.length} /> 
                </div>

            </div>
            <div className="w-full max-w-2xl mx-auto bg-white p-5 rounded-xl shadow-2xl mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Add New Task</h3>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Task Title (e.g., Finish final project report)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()} 
                        className="bg-gray-50 border-b-2 border-gray-300 focus:border-[#0047AB] outline-none transition-colors duration-300 pt-1 px-3 rounded-t-lg text-gray-800 text-lg h-12"
                    />
                    <textarea
                        placeholder="Detailed Description (Optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-50 border-b-2 border-gray-300 focus:border-[#0047AB] outline-none transition-colors duration-300 p-3 rounded-lg text-gray-800 text-base resize-none"
                        rows="3"
                    />

                    <button
                        onClick={addTodo}
                        className="bg-[#0047AB] hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold shadow-lg shadow-blue-500/50 transform hover:scale-[1.01]"
                        disabled={!title.trim()}
                    >
                        Add Task
                    </button>
                </div>
            </div>
            <ul className="w-full max-w-2xl mx-auto space-y-4">
                {loading ? (
                    <li className="text-center text-white/80 p-6 bg-white/10 rounded-xl shadow-lg flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading your tasks...
                    </li>
                ) : todos.length === 0 ? (
                    <li className="text-center text-white/80 p-8 bg-white/10 rounded-xl shadow-lg border border-dashed border-white/20">
                        🎉 **Success!** You have no active tasks. Enjoy your free time!
                    </li>
                ) : (
                    todos.map((todo) => (
                        <li
                            key={todo._id}
                            className={`flex justify-between items-start p-5 bg-white rounded-xl shadow-lg transition-all duration-300 
                                        transform hover:shadow-xl hover:scale-[1.01] ${todo.isExiting ? 'opacity-0 translate-x-10' : ''}`} >
                            <div 
                                className="text-gray-800 flex-grow text-left pr-4 cursor-pointer"
                                onClick={() => toggleComplete(todo._id, todo.completed)}>
                                <h4 className="text-lg font-bold text-[#0047AB] mb-1">{todo.title}</h4>
                                {todo.description && (
                                    <p className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                                        {todo.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 items-center flex-shrink-0">
                                <button
                                    onClick={() => toggleComplete(todo._id, todo.completed)}
                                    className="bg-[#3CB371] hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition duration-200 font-semibold shadow-md"
                                >
                                    Complete
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition duration-200 font-semibold shadow-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}