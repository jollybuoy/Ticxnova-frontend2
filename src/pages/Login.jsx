// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import API from "../api/axios";
import { motion } from "framer-motion";

import loginIllustration from "../assets/login-illustration.svg";
import logo from "../assets/ticxnova-logo.png";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { instance } = useMsal();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { email: username, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("loginMethod", "custom");
        localStorage.setItem("email", username);
        setAuth(true);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    localStorage.setItem("loginMethod", "microsoft");
    instance.loginRedirect(loginRequest);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl bg-white border border-gray-100 shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden"
      >
        <div className="md:w-1/2 p-8 hidden md:flex items-center justify-center bg-gradient-to-tr from-indigo-50 to-white">
          <img src={loginIllustration} alt="Illustration" className="h-80" />
        </div>

        <div className="w-full md:w-1/2 p-10 text-gray-800">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-2 rounded-full shadow-md border border-gray-200">
              <img src={logo} alt="Ticxnova Logo" className="h-20 w-20 object-contain rounded-full border-2 border-indigo-500" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 tracking-wide text-indigo-700">
            Welcome to <span className="text-fuchsia-600">Ticxnova</span>
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            AI-powered ticketing platform for seamless support.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:outline-none"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 border border-gray-300 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-indigo-600 hover:to-fuchsia-700 transition duration-300"
            >
              {isLoading ? "⏳ Logging in..." : "🔐 Sign In"}
            </button>
          </form>

          <button
            onClick={handleMicrosoftLogin}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            🔐 Sign in with Microsoft
          </button>

          <p className="text-sm text-gray-500 mt-5 text-center">
            By logging in, you agree to our{" "}
            <Link to="/privacy" className="text-blue-600 underline hover:text-blue-800">
              Privacy Policy
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-500">
            Trouble logging in?{" "}
            <Link to="/contact-admin" className="text-indigo-600 underline hover:text-indigo-800">
              Contact admin
            </Link>
          </p>

          <div className="mt-6 text-center text-xs text-gray-400">
            🚀 Manage incidents, tasks, SLAs, and more — powered by AI.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
