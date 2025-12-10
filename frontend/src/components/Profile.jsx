import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-[#101F41] text-white">
            
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
                
                <h2 className="text-3xl font-extrabold text-[#8A2BE2] tracking-tight">
                    👤 Account & Profile
                </h2>
            </div>

            <div className="w-full max-w-4xl mx-auto space-y-6 bg-white/10 p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold mb-4 text-white">Profile Details</h3>
                
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-white/80">
                        This section is functional! You can navigate here from the dashboard. 
                        User data fetching and settings will be built here.
                    </p>
                </div>

                <button
                    className="bg-[#8A2BE2] hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold shadow-md transform hover:scale-[1.01]"
                    onClick={() => alert("This button works, but the full feature is still under construction!")}
                >
                    Update Profile
                </button>

            </div>
        </div>
    );
}