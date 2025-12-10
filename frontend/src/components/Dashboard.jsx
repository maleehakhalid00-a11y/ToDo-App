import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard({ token, setToken }) { 
    const navigate = useNavigate();
    
    // Auth Check: Redirect if token is missing
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate('/login'); // Redirect after logout
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-[#101F41]"> 
            
            {/* HEADER */}
            <header className="flex justify-between items-center mb-12 bg-white p-4 rounded-xl shadow-2xl max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-[#0047AB] tracking-tight">
                    🚀 Todo Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold 
                                 px-5 py-2 rounded-lg transition duration-300 shadow-md 
                                 transform hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="Logout and return to login page"
                >
                    Logout
                </button>
            </header>

            {/* Welcome Section */}
            <div className="max-w-7xl mx-auto mb-10 text-white p-6 rounded-xl border border-white/20">
                <h2 className="text-4xl font-light mb-2">
                    Welcome Back, <span className="font-semibold text-[#0047AB]">User!</span>
                </h2>
                <p className="text-white/80">Manage your workload and review your progress below.</p>
            </div>
            
            {/* MAIN CONTENT AREA: Grid layout */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                
                {/* CARD 1: View Active Todos */}
                <Link
                    to="/todos"
                    className="bg-white p-8 rounded-xl shadow-2xl text-left 
                                 transform transition duration-300 hover:scale-[1.03] 
                                 border-t-8 border-[#0047AB] block hover:shadow-blue-500/30"
                >
                    <div className="flex items-center mb-3">
                        <span className="text-4xl text-[#0047AB] mr-4">📋</span>
                        <h2 className="text-2xl font-bold text-gray-800">Active Tasks</h2>
                    </div>
                    <p className="text-gray-600 mt-2">Add, update, and manage your current to-dos. Stay focused on what matters now.</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-[#0047AB] hover:underline">
                        Go to Todos &rarr;
                    </span>
                </Link>

                {/* CARD 2: Completed Tasks */}
                <Link
                    to="/completed"
                    className="bg-white p-8 rounded-xl shadow-2xl text-left 
                                 transform transition duration-300 hover:scale-[1.03] 
                                 border-t-8 border-[#3CB371] block hover:shadow-green-500/30"
                >
                    <div className="flex items-center mb-3">
                       <span className="text-4xl text-[#3CB371] mr-4">✅</span>
                        <h2 className="text-2xl font-bold text-gray-800">Completed Tasks</h2>
                    </div>
                    <p className="text-gray-600 mt-2">Review all the tasks you've finished. Celebrate your achievements!</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-[#3CB371] hover:underline">
                        View Archive &rarr;
                    </span>
                </Link>

                {/* CARD 3: Account & Profile Management */}
                <Link
                    to="/profile" // <-- 💡 Link is set here
                    className="bg-white p-8 rounded-xl shadow-2xl text-left 
                                 transform transition duration-300 hover:scale-[1.03] 
                                 border-t-8 border-[#8A2BE2] block hover:shadow-purple-500/30" 
                >
                    <div className="flex items-center mb-3">
                        <span className="text-4xl text-[#8A2BE2] mr-4">👤</span>
                        <h2 className="text-2xl font-bold text-gray-800">Account & Profile</h2>
                    </div>
                    <p className="text-gray-600 mt-2">Manage your personal information, update your password, and view usage statistics.</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-[#8A2BE2] hover:underline">
                        Go to Profile &rarr;
                    </span>
                </Link>

            </div> 
        </div>
    );
}