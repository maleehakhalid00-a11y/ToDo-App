import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const API = "http://localhost:5001";

export default function LoginRegister({ setToken }) {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const url = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
      const payload = isLogin ? { email, password } : { name, email, password };

      const res = await axios.post(url, payload);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        navigate("/dashboard");
      } else {
        setErrorMsg("No token received from server.");
      }
    } catch (err) {
      if (err.response) {
        setErrorMsg(err.response.data.message || "An error occurred");
      } else {
        setErrorMsg("Server is unreachable. Check backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen p-4 
                    bg-gradient-to-br from-gray-900 to-[#101F41] text-white"> 
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 sm:p-12 rounded-xl shadow-2xl w-full max-w-sm 
                   flex flex-col gap-6 transition-all duration-300 transform hover:scale-[1.01] relative"
      >
        <h2 className="text-center text-4xl font-extrabold text-[#0047AB] tracking-tighter"> 
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-base text-center text-gray-500 -mt-4">
          {isLogin ? "Sign in to access your data." : "Start your journey today."}
        </p>

        {errorMsg && (
          // Error Message: Clear, defined box
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}
        {!isLogin && (
          <div className="relative">
            <input
              type="text"
              placeholder=" " 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full h-12 bg-gray-100 border-b-2 border-gray-300 focus:border-[#0047AB] outline-none transition-colors duration-300 pt-3 px-3 rounded-t-lg text-gray-800"
              required
            />
            <label htmlFor="name" className="absolute left-3 top-2 text-sm text-gray-500 transition-all duration-300 transform peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#0047AB]">
                Full Name
            </label>
          </div>
        )}

        <div className="relative">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full h-12 bg-gray-100 border-b-2 border-gray-300 focus:border-[#0047AB] outline-none transition-colors duration-300 pt-3 px-3 rounded-t-lg text-gray-800"
              required
            />
             <label htmlFor="email" className="absolute left-3 top-2 text-sm text-gray-500 transition-all duration-300 transform peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#0047AB]">
                Email Address
            </label>
        </div>

        <div className="relative">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full h-12 bg-gray-100 border-b-2 border-gray-300 focus:border-[#0047AB] outline-none transition-colors duration-300 pt-3 px-3 rounded-t-lg text-gray-800"
              required
            />
             <label htmlFor="password" className="absolute left-3 top-2 text-sm text-gray-500 transition-all duration-300 transform peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#0047AB]">
                Password
            </label>
        </div>
        <button
          type="submit"
          className={`h-12 bg-[#0047AB] text-white font-bold rounded-lg shadow-xl transition-all duration-300 tracking-wider transform hover:scale-[1.02] hover:bg-blue-700
            ${loading ? "opacity-60 cursor-not-allowed" : "shadow-blue-500/50"}`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isLogin ? "Signing In..." : "Registering..."}
            </span>
          ) : (
            isLogin ? "LOG IN SECURELY" : "CREATE ACCOUNT"
          )}
        </button>
        <p className="text-sm text-center mt-3 text-gray-500">
          {isLogin ? "New user?" : "Returning user?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="text-[#0047AB] cursor-pointer hover:text-blue-700 font-extrabold transition-colors duration-200"
          >
            {isLogin ? "Sign up instantly" : "Log in here"}
          </span>
        </p>
      </form>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10" 
           style={{ background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)' }}>
      </div>
    </div>
  );
}