import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isMobile, setIsMobile] = useState(false);
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

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = isMobile ? 15 : 30; // Fewer particles on mobile
      for (let i = 0; i < particleCount; i++) {
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

    // Mouse move handler (disabled on mobile for performance)
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      clearInterval(timeInterval);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMobile]);

  const createMockToken = (user) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      userId: Math.floor(Math.random() * 1000) + 1,
      name: user.role,
      email: user.email,
      role: user.role.toLowerCase().replace(/\s+/g, '_'),
      department: user.role.includes('Admin') ? 'IT' : 
                 user.role.includes('Manager') ? 'Management' : 
                 user.role.includes('Agent') ? 'Support' : 'General',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa("mock-signature");
    
    return `${header}.${payload}.${signature}`;
  };

  const performLogin = (user) => {
    console.log("🚀 Performing login for:", user.email);
    
    try {
      // Create mock token
      const mockToken = createMockToken(user);
      
      // Clear any existing auth data first
      localStorage.clear();
      
      // Store new authentication data
      localStorage.setItem("token", mockToken);
      localStorage.setItem("loginMethod", "demo");
      localStorage.setItem("email", user.email);
      localStorage.setItem("userName", user.role);
      
      console.log("✅ Login data stored successfully");
      console.log("📧 Email:", user.email);
      console.log("👤 User:", user.role);
      
      // Update auth state immediately
      if (setAuth) {
        console.log("🔄 Setting auth state to true");
        setAuth(true);
      }
      
      // Navigate to dashboard
      console.log("🧭 Navigating to dashboard...");
      navigate("/dashboard", { replace: true });
      
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    console.log("🔐 Manual login attempt:", username);
    
    // Check test credentials
    const testUser = testCredentials.find(
      cred => cred.email === username && cred.password === password
    );
    
    if (testUser) {
      console.log("✅ Test credentials matched:", testUser.email);
      performLogin(testUser);
    } else {
      console.log("❌ Invalid credentials provided");
      setError("❌ Invalid credentials. Please use the test credentials provided below.");
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    setError("");
    localStorage.setItem("loginMethod", "microsoft");
    instance.loginRedirect(loginRequest);
  };

  const fillTestCredentials = (cred) => {
    console.log("📝 Filling credentials for:", cred.email);
    setUsername(cred.email);
    setPassword(cred.password);
    setShowTestCredentials(false);
    setError("");
  };

  const quickLogin = (cred) => {
    console.log("⚡ Quick login initiated for:", cred.email);
    setError("");
    setIsLoading(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      performLogin(cred);
    }, 500);
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

        {/* Animated gradient orbs - reduced on mobile */}
        {!isMobile && (
          <>
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
          </>
        )}

        {/* Floating particles - reduced on mobile */}
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className={`w-full ${isMobile ? 'max-w-md' : 'max-w-6xl'} bg-white/80 backdrop-blur-2xl border border-gray-200/50 shadow-2xl rounded-3xl flex ${isMobile ? 'flex-col' : 'flex-col lg:flex-row'} overflow-hidden`}
        >
          {/* Left Side - Branding & Info */}
          <div className={`${isMobile ? 'w-full py-6 px-6' : 'lg:w-1/2 p-8'} bg-gradient-to-br from-blue-50/50 to-purple-50/50 flex flex-col justify-center items-center text-center relative`}>
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
              className={`${isMobile ? 'mb-4' : 'mb-8'} relative z-10`}
            >
              <img src={logo} alt="Ticxnova Logo" className={`${isMobile ? 'h-20 w-20' : 'h-32 w-32'} rounded-full shadow-2xl ring-4 ring-blue-200/50`} />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse border-4 border-white shadow-lg"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`${isMobile ? 'text-3xl mb-2' : 'text-5xl mb-4'} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent`}
            >
              TICXNOVA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${isMobile ? 'text-lg mb-4' : 'text-xl mb-6'} text-gray-600 font-medium`}
            >
              AI-Powered Ticketing Platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`text-gray-600 ${isMobile ? 'space-y-2' : 'space-y-4'} relative z-10`}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <span className={`${isMobile ? 'text-sm' : ''} font-medium`}>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                />
                <span className={`${isMobile ? 'text-sm' : ''} font-medium`}>AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
                <span className={`${isMobile ? 'text-sm' : ''} font-medium`}>Advanced Automation</span>
              </div>
            </motion.div>

            {/* Live Clock - Hidden on mobile to save space */}
            {!isMobile && (
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
            )}
          </div>

          {/* Right Side - Login Form */}
          <div className={`${isMobile ? 'w-full p-6' : 'lg:w-1/2 p-8'} text-gray-800`}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className={`${isMobile ? 'text-2xl mb-1' : 'text-4xl mb-2'} font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                Welcome Back
              </h2>
              <p className={`text-gray-600 ${isMobile ? 'mb-6 text-sm' : 'mb-8'} font-medium`}>
                Sign in to access your dashboard
              </p>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`${isMobile ? 'mb-4 p-3' : 'mb-6 p-4'} bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Method Selector */}
              <div className={`flex gap-2 ${isMobile ? 'mb-4' : 'mb-6'} p-1 bg-gray-100 rounded-2xl`}>
                <button
                  onClick={() => setLoginMethod("credentials")}
                  className={`flex-1 ${isMobile ? 'py-2 px-3 text-sm' : 'py-3 px-4'} rounded-xl font-semibold transition-all ${
                    loginMethod === "credentials"
                      ? "bg-white text-gray-800 shadow-lg"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  🔐 Credentials
                </button>
                <button
                  onClick={() => setLoginMethod("microsoft")}
                  className={`flex-1 ${isMobile ? 'py-2 px-3 text-sm' : 'py-3 px-4'} rounded-xl font-semibold transition-all ${
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
                    <form onSubmit={handleLogin} className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
                      <div>
                        <label className={`block ${isMobile ? 'mb-1 text-sm' : 'mb-2 text-sm'} font-semibold text-gray-700`}>Email Address</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="email"
                          className={`w-full ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 border border-gray-200 transition-all`}
                          placeholder="Enter your email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={`block ${isMobile ? 'mb-1 text-sm' : 'mb-2 text-sm'} font-semibold text-gray-700`}>Password</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="password"
                          className={`w-full ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} rounded-xl bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 border border-gray-200 transition-all`}
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
                        className={`w-full bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-600 ${isMobile ? 'py-3 text-base' : 'py-4 text-lg'} rounded-xl font-bold tracking-wide text-white hover:shadow-xl transition duration-300 shadow-lg disabled:opacity-50`}
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
                    <div className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTestCredentials(!showTestCredentials)}
                        className={`w-full ${isMobile ? 'py-2' : 'py-3'} bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl font-semibold text-green-700 hover:bg-green-100 transition-all`}
                      >
                        🧪 Use Test Credentials
                      </motion.button>

                      <AnimatePresence>
                        {showTestCredentials && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isMobile ? 'mt-3 space-y-2' : 'mt-4 space-y-3'}`}
                          >
                            {testCredentials.map((cred, index) => (
                              <motion.div
                                key={cred.role}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${isMobile ? 'p-3' : 'p-4'} bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all`}
                              >
                                <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-between items-center'}`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`${isMobile ? 'p-1.5 text-base' : 'p-2 text-lg'} rounded-lg bg-gradient-to-r ${cred.gradient} text-white`}>
                                      {cred.icon}
                                    </div>
                                    <div>
                                      <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800`}>{cred.role}</h4>
                                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{cred.description}</p>
                                      <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-blue-600 mt-1 font-mono`}>
                                        {cred.email} / {cred.password}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => fillTestCredentials(cred)}
                                      className={`${isMobile ? 'flex-1 py-2 text-xs' : 'px-3 py-1 text-xs'} bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-white transition-colors`}
                                    >
                                      Fill
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => quickLogin(cred)}
                                      disabled={isLoading}
                                      className={`${isMobile ? 'flex-1 py-2 text-xs' : 'px-3 py-1 text-xs'} bg-green-500 hover:bg-green-600 rounded-lg font-medium text-white transition-colors disabled:opacity-50`}
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
                    <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
                      <div className={`${isMobile ? 'text-4xl mb-2' : 'text-6xl mb-4'}`}>🏢</div>
                      <h3 className={`${isMobile ? 'text-xl mb-1' : 'text-2xl mb-2'} font-bold text-gray-800`}>Microsoft Sign-In</h3>
                      <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                        Use your organization's Microsoft account to sign in securely
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMicrosoftLogin}
                      className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 ${isMobile ? 'py-3 text-base' : 'py-4 text-lg'} rounded-xl font-semibold transition duration-300 shadow-lg text-white hover:shadow-xl`}
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
                className={`w-full ${isMobile ? 'mt-4 py-3 text-base' : 'mt-6 py-3 text-lg'} bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl font-semibold transition duration-300 shadow-lg`}
              >
                🚀 View Demo Preview
              </motion.button>

              <div className={`${isMobile ? 'mt-6 text-center space-y-3' : 'mt-8 text-center space-y-4'}`}>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  By logging in, you agree to our{" "}
                  <Link to="/privacy" className="text-blue-600 underline hover:text-blue-700 transition-colors">
                    Privacy Policy
                  </Link>
                </p>

                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-600`}>
                  Need help?{" "}
                  <Link to="/contact-admin" className="underline hover:text-blue-700 transition-colors">
                    Contact admin
                  </Link>
                </p>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-400 flex items-center justify-center gap-2`}
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-white/90 backdrop-blur-lg rounded-2xl ${isMobile ? 'p-6' : 'p-8'} text-center text-gray-800 shadow-2xl border border-gray-200 max-w-sm w-full`}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4`}
              />
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-2`}>Authenticating...</h3>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Please wait while we verify your credentials</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;