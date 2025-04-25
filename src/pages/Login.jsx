// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import API from "../api/axios";
import { motion } from "framer-motion";

import loginIllustration from "../assets/login-illustration.svg";
import logo from "../assets/ticxnova-logo.png";

const testimonials = [
  {
    quote: "This platform changed how we handle support tickets. Instant, intelligent, and intuitive!",
    author: "– IT Manager, NovaTech",
  },
  {
    quote: "Ticxnova boosted our efficiency. Our team loves the AI-driven interface!",
    author: "– Support Lead, CyberWorks",
  },
  {
    quote: "Secure, scalable, and beautiful. It's everything we needed in a helpdesk platform.",
    author: "– CTO, CloudWave",
  },
];

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-fuchsia-900" : "bg-gradient-to-br from-white via-blue-100 to-pink-100"} relative min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500`}>
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 bg-white/20 backdrop-blur hover:bg-white/30 px-4 py-1 rounded-full text-xs text-white border border-white/30 shadow-lg z-20"
      >
        Toggle {theme === "dark" ? "Light" : "Dark"} Mode
      </button>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden"
      >
        <div className="md:w-1/2 p-8 hidden md:flex items-center justify-center bg-white/5">
          <img src={loginIllustration} alt="Illustration" className="h-80 animate-float" />
        </div>

        <div className="w-full md:w-1/2 p-10 text-white">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-2 rounded-full shadow-md border border-fuchsia-300 animate-spin-slow">
              <img src={logo} alt="Ticxnova Logo" className="h-20 w-20 object-contain rounded-full border-2 border-fuchsia-500" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-center mb-2 tracking-wide text-amber-300 drop-shadow-lg">
            Welcome to <span className="text-pink-400">Ticxnova</span>
          </h2>
          <p className="text-center text-sm text-gray-200 mb-6">
            AI-powered ticketing platform for seamless support.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 border border-white/20 focus:outline-none transition duration-200"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500 border border-white/20 focus:outline-none transition duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 py-3 rounded-lg text-lg font-bold tracking-wide hover:from-purple-600 hover:to-pink-700 transition duration-300"
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

          <p className="text-sm text-gray-300 mt-5 text-center">
            By logging in, you agree to our{" "}
            <Link to="/privacy" className="text-sky-300 underline hover:text-sky-400">
              Privacy Policy
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-indigo-300">
            Trouble logging in?{" "}
            <Link to="/contact-admin" className="underline hover:text-indigo-400">
              Contact admin
            </Link>
          </p>

          <div className="mt-6 text-center text-xs text-gray-300 animate-pulse">
            🚀 Manage incidents, tasks, SLAs, and more — powered by AI.
          </div>
        </div>
      </motion.div>

      {/* Rotating Testimonials */}
      <motion.div
        key={testimonialIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10 max-w-3xl text-center z-10"
      >
        <p className="text-sm text-gray-300 italic">“{testimonials[testimonialIndex].quote}”</p>
        <p className="mt-1 text-xs text-fuchsia-300">{testimonials[testimonialIndex].author}</p>
      </motion.div>
    </div>
  );
};

export default Login;
