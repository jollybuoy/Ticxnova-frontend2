import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LoginBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          color: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'][Math.floor(Math.random() * 4)]
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    // Mouse move handler
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: mousePosition.x * 0.1,
          y: mousePosition.y * 0.1,
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          x: { type: "spring", stiffness: 50 },
          y: { type: "spring", stiffness: 50 },
          scale: { duration: 8, repeat: Infinity },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: -mousePosition.x * 0.05,
          y: -mousePosition.y * 0.05,
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{
          x: { type: "spring", stiffness: 30 },
          y: { type: "spring", stiffness: 30 },
          scale: { duration: 10, repeat: Infinity },
          rotate: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/30 to-cyan-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: mousePosition.x * 0.03,
          y: -mousePosition.y * 0.03,
          scale: [1, 1.3, 1],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{
          x: { type: "spring", stiffness: 20 },
          y: { type: "spring", stiffness: 20 },
          scale: { duration: 12, repeat: Infinity },
          rotate: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-2xl"
      />

      {/* Floating Particles */}
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
            x: [0, Math.sin(particle.id) * 50, 0],
            opacity: [particle.opacity, 0, particle.opacity],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.speed * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.1
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,100 Q250,50 500,100 T1000,100"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.path
          d="M0,200 Q300,150 600,200 T1200,200"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </svg>
    </div>
  );
};

export default LoginBackground;