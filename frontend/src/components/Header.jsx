import React from "react";

export default function Header({ taskCount = 5 }) { 
  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl flex justify-between items-center mb-8 
                    border-b-4 border-[#0047AB] transform transition duration-300 hover:scale-[1.005]">
      <h1 className="text-3xl font-extrabold text-[#0047AB] tracking-tight">
        📋 Your Active Tasks
      </h1>
      <div className="flex items-center space-x-3">
        <span className="px-4 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full shadow-inner">
            {taskCount} Active Tasks
        </span>
        <div className="text-lg text-gray-600 font-medium hidden sm:block">
            ✨ Stay Productive!
        </div>
      </div>
    </div>
  );
}