import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";

import logo from "../assets/ticxnova-logo.png";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const [loginMethod, setLoginMethod] = useState("credentials");
  const [particles, setParticles] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { instance } = useMsal();

  // Test credentials
  const testCredentials = [
    { 
      role: "Super Admin", 
      email: "admin@ticxnova.com", 
      password: "admin123", 
      description: "Full system access with all permissions",
      gradient: "from-red-500 to-pink-600",
      icon: "🛡️"
    },
    { 
      role: "Department Manager", 
      email: "manager@ticxnova.com", 
      password: "manager123", 
      description: "Department-level management and oversight",
      gradient: "from-blue-500 to-indigo-600",
      icon: "👥"
    },
    { 
      role: "Support Agent", 
      email: "agent@ticxnova.com", 
      password: "agent123", 
      description: "Ticket handling and customer support",
      gradient: "from-green-500 to-teal-600",
      icon: "🎧"
    },
    { 
      role: "End User", 
      email: "user@ticxnova.com", 
      password: "user123", 
      description: "Basic user access for ticket creation",
      gradient: "from-purple-500 to-violet-600",
      icon: "👤"
    }
  ];

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          color: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'][Math.floor(Math.random() * 4)]
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mouse move handler
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // First try the actual API
      const res = await API.post("/auth/login", { email: username, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("loginMethod", "custom");
        localStorage.setItem("email", username);
        
        // Ensure setAuth is called before navigation
        if (setAuth) {
          setAuth(true);
        }
        
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
        return;
      }
    } catch (err) {
      console.log("API login failed, trying test credentials:", err.message);
    }

    // Fallback to test credentials
    const testUser = testCredentials.find(
      cred => cred.email === username && cred.password === password
    );
    
    if (testUser) {
      try {
        // Create a comprehensive mock token
        const mockToken = btoa(JSON.stringify({
          userId: Math.floor(Math.random() * 1000) + 1,
          name: testUser.role,
          email: testUser.email,
          role: testUser.role.toLowerCase().replace(/\s+/g, '_'),
          department: testUser.role.includes('Admin') ? 'IT' : 
                     testUser.role.includes('Manager') ? 'Management' : 
                     testUser.role.includes('Agent') ? 'Support' : 'General',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }));
        
        // Store authentication data
        localStorage.setItem("token", mockToken);
        localStorage.setItem("loginMethod", "demo");
        localStorage.setItem("email", testUser.email);
        localStorage.setItem("userName", testUser.role);
        
        console.log("Demo login successful for:", testUser.email);
        
        // Update auth state
        if (setAuth) {
          setAuth(true);
        }
        
        // Navigate with replace to prevent back button issues
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
        
      } catch (tokenError) {
        console.error("Error creating demo token:", tokenError);
        setError("Failed to create demo session. Please try again.");
      }
    } else {
      setError("Invalid credentials. Please use the test credentials provided.");
    }
    
    setIsLoading(false);
  };

  const handleMicrosoftLogin = () => {
    setError("");
    localStorage.setItem("loginMethod", "microsoft");
    instance.loginRedirect(loginRequest);
  };

  const fillTestCredentials = (cred) => {
    setUsername(cred.email);
    setPassword(cred.password);
    setShowTestCredentials(false);
    setError("");
  };

  const quickLogin = async (cred) => {
    setError("");
    setUsername(cred.email);
    setPassword(cred.password);
    setIsLoading(true);
    
    try {
      // Create mock token immediately
      const mockToken = btoa(JSON.stringify({
        userId: Math.floor(Math.random() * 1000) + 1,
        name: cred.role,
        email: cred.email,
        role: cred.role.toLowerCase().replace(/\s+/g, '_'),
        department: cred.role.includes('Admin') ? 'IT' : 
                   cred.role.includes('Manager') ? 'Management' : 
                   cred.role.includes('Agent') ? 'Support' : 'General',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      }));
      
      // Store authentication data
      localStorage.setItem("token", mockToken);
      localStorage.setItem("loginMethod", "demo");
      localStorage.setItem("email", cred.email);
      localStorage.setItem("userName", cred.role);
      
      console.log("Quick login successful for:", cred.email);
      
      // Update auth state
      if (setAuth) {
        setAuth(true);
      }
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error("Quick login error:", error);
      setError("Quick login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle geometric patterns */}
        <div className="absolute inset-0 opacity-3">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
            scale: [1, 1.2, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 50 },
            y: { type: "spring", stiffness: 50 },
            scale: { duration: 8, repeat: Infinity }
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            x: { type: "spring", stiffness: 30 },
            y: { type: "spring", stiffness: 30 },
            scale: { duration: 10, repeat: Infinity }
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-200/30 to-pink-200/30 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(particle.id) * 30, 0],
              opacity: [particle.opacity, 0, particle.opacity],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: particle.speed * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.id * 0.1
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-6xl bg-white/80 backdrop-blur-2xl border border-gray-200/50 shadow-2xl rounded-3xl flex flex-col lg:flex-row overflow-hidden"
        >
          {/* Left Side - Branding & Info */}
          <div className="lg:w-1/2 p-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 flex flex-col justify-center items-center text-center relative">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
            </div>

            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity }
              }}
              className="mb-8 relative z-10"
            >
              <img src={logo} alt="Ticxnova Logo" className="h-32 w-32 rounded-full shadow-2xl ring-4 ring-blue-200/50" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-pulse border-4 border-white shadow-lg"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
            >
              TICXNOVA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 mb-6 font-medium"
            >
              AI-Powered Ticketing Platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-gray-600 space-y-4 relative z-10"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <span className="font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                />
                <span className="font-medium">AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
                <span className="font-medium">Advanced Automation</span>
              </div>
            </motion.div>

            {/* Live Clock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg relative z-10"
            >
              <p className="text-sm text-gray-500 mb-1">Current Time</p>
              <p className="text-2xl font-mono font-bold text-gray-800">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleDateString()}
              </p>
            </motion.div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-8 text-gray-800">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-8 font-medium">
                Sign in to access your dashboard
              </p>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Method Selector */}
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                <button
                  onClick={() => setLoginMethod("credentials")}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    loginMethod === "credentials"
                      ? "bg-white text-gray-800 shadow-lg"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  🔐 Credentials
                </button>
                <button
                  onClick={() => setLoginMethod("microsoft")}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    loginMethod === "microsoft"
                      ? "bg-white text-gray-800 shadow-lg"
                      : "text-gray-600 hover:text-gray-800"
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
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="email"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-200 transition-all"
                          placeholder="Enter your email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="password"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 border border-gray-200 transition-all"
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
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-600 py-4 rounded-xl text-lg font-bold tracking-wide text-white hover:shadow-xl transition duration-300 shadow-lg disabled:opacity-50"
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
                        className="w-full py-3 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl font-semibold text-green-700 hover:bg-green-100 transition-all"
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
                                className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${cred.gradient} text-white text-lg`}>
                                      {cred.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-800">{cred.role}</h4>
                                      <p className="text-sm text-gray-600">{cred.description}</p>
                                      <p className="text-xs text-blue-600 mt-1 font-mono">
                                        {cred.email} / {cred.password}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => fillTestCredentials(cred)}
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-medium text-white transition-colors"
                                    >
                                      Fill
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => quickLogin(cred)}
                                      disabled={isLoading}
                                      className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50"
                                    >
                                      {isLoading ? "..." : "Quick Login"}
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
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">Microsoft Sign-In</h3>
                      <p className="text-gray-600">
                        Use your organization's Microsoft account to sign in securely
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMicrosoftLogin}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-lg text-white hover:shadow-xl"
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
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-lg"
              >
                🚀 View Demo Preview
              </motion.button>

              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-500">
                  By logging in, you agree to our{" "}
                  <Link to="/privacy" className="text-blue-600 underline hover:text-blue-700 transition-colors">
                    Privacy Policy
                  </Link>
                </p>

                <p className="text-sm text-blue-600">
                  Need help?{" "}
                  <Link to="/contact-admin" className="underline hover:text-blue-700 transition-colors">
                    Contact admin
                  </Link>
                </p>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-xs text-gray-400 flex items-center justify-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 text-center text-gray-800 shadow-2xl border border-gray-200"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Authenticating...</h3>
              <p className="text-gray-600">Please wait while we verify your credentials</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;