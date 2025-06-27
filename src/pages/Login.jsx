import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";

import loginIllustration from "../assets/login-illustration.svg";
import logo from "../assets/ticxnova-logo.png";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const [loginMethod, setLoginMethod] = useState("credentials"); // "credentials" or "microsoft"
  const [particles, setParticles] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { instance } = useMsal();

  // Test credentials
  const testCredentials = [
    { role: "Admin", email: "admin@ticxnova.com", password: "admin123", description: "Full system access" },
    { role: "Manager", email: "manager@ticxnova.com", password: "manager123", description: "Department management" },
    { role: "Agent", email: "agent@ticxnova.com", password: "agent123", description: "Ticket handling" },
    { role: "User", email: "user@ticxnova.com", password: "user123", description: "Basic user access" }
  ];

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

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
      // For demo purposes, check test credentials
      const testUser = testCredentials.find(
        cred => cred.email === username && cred.password === password
      );
      
      if (testUser) {
        // Create a mock token for demo
        const mockToken = btoa(JSON.stringify({
          name: testUser.role,
          email: testUser.email,
          role: testUser.role,
          exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }));
        
        localStorage.setItem("token", mockToken);
        localStorage.setItem("loginMethod", "custom");
        localStorage.setItem("email", username);
        setAuth(true);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials. Try the test credentials!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    localStorage.setItem("loginMethod", "microsoft");
    instance.loginRedirect(loginRequest);
  };

  const fillTestCredentials = (cred) => {
    setUsername(cred.email);
    setPassword(cred.password);
    setShowTestCredentials(false);
  };

  const quickLogin = async (cred) => {
    setUsername(cred.email);
    setPassword(cred.password);
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      const mockToken = btoa(JSON.stringify({
        name: cred.role,
        email: cred.email,
        role: cred.role,
        exp: Date.now() + 24 * 60 * 60 * 1000
      }));
      
      localStorage.setItem("token", mockToken);
      localStorage.setItem("loginMethod", "custom");
      localStorage.setItem("email", cred.email);
      setAuth(true);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [particle.opacity, 0, particle.opacity],
            }}
            transition={{
              duration: particle.speed * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="w-full max-w-6xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl flex flex-col lg:flex-row overflow-hidden"
        >
          {/* Left Side - Illustration & Info */}
          <div className="lg:w-1/2 p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex flex-col justify-center items-center text-center">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity }
              }}
              className="mb-8"
            >
              <img src={logo} alt="Ticxnova Logo" className="h-32 w-32 rounded-full shadow-2xl ring-4 ring-white/30" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"
            >
              TICXNOVA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-blue-200 mb-6"
            >
              AI-Powered Ticketing Platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-white/80 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Advanced Automation</span>
              </div>
            </motion.div>

            {/* Live Clock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
            >
              <p className="text-sm text-white/60 mb-1">Current Time</p>
              <p className="text-2xl font-mono font-bold text-white">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-sm text-white/60">
                {currentTime.toLocaleDateString()}
              </p>
            </motion.div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-8 text-white">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-blue-200 mb-8">
                Sign in to access your dashboard
              </p>

              {/* Login Method Selector */}
              <div className="flex gap-2 mb-6 p-1 bg-white/10 rounded-2xl">
                <button
                  onClick={() => setLoginMethod("credentials")}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    loginMethod === "credentials"
                      ? "bg-white text-gray-800 shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  🔐 Credentials
                </button>
                <button
                  onClick={() => setLoginMethod("microsoft")}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    loginMethod === "microsoft"
                      ? "bg-white text-gray-800 shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  🏢 Microsoft
                </button>
              </div>

              <AnimatePresence mode="wait">
                {loginMethod === "credentials" ? (
                  <motion.div
                    key="credentials"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Email Address</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="email"
                          className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 border border-white/20 transition-all"
                          placeholder="Enter your email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-medium">Password</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="password"
                          className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-pink-500 border border-white/20 transition-all"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-4 rounded-xl text-lg font-bold tracking-wide hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-2xl disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Signing In...
                          </div>
                        ) : (
                          "🚀 Sign In"
                        )}
                      </motion.button>
                    </form>

                    {/* Test Credentials Section */}
                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTestCredentials(!showTestCredentials)}
                        className="w-full py-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-xl font-semibold text-green-300 hover:bg-green-500/30 transition-all"
                      >
                        🧪 Use Test Credentials
                      </motion.button>

                      <AnimatePresence>
                        {showTestCredentials && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3"
                          >
                            {testCredentials.map((cred, index) => (
                              <motion.div
                                key={cred.role}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-semibold text-white">{cred.role}</h4>
                                    <p className="text-sm text-white/60">{cred.description}</p>
                                    <p className="text-xs text-blue-300 mt-1">
                                      {cred.email} / {cred.password}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => fillTestCredentials(cred)}
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      Fill
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => quickLogin(cred)}
                                      className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      Quick Login
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="microsoft"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="mb-6">
                      <div className="text-6xl mb-4">🏢</div>
                      <h3 className="text-2xl font-bold mb-2">Microsoft Sign-In</h3>
                      <p className="text-white/70">
                        Use your organization's Microsoft account to sign in securely
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMicrosoftLogin}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-2xl"
                    >
                      🔐 Sign in with Microsoft
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Demo Preview Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/demo")}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-xl"
              >
                🚀 View Demo Preview
              </motion.button>

              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-white/60">
                  By logging in, you agree to our{" "}
                  <Link to="/privacy" className="text-cyan-300 underline hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </Link>
                </p>

                <p className="text-sm text-blue-300">
                  Need help?{" "}
                  <Link to="/contact-admin" className="underline hover:text-blue-400 transition-colors">
                    Contact admin
                  </Link>
                </p>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-xs text-white/40 flex items-center justify-center gap-2"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Powered by AI • Secure • Fast
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center text-white"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Authenticating...</h3>
              <p className="text-white/70">Please wait while we verify your credentials</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;