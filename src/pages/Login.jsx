import React from "react";
import { useMsal } from "@azure/msal-react";
import { motion } from "framer-motion";
import loginIllustration from "../assets/login-illustration.svg";
import logo from "../assets/ticxnova-logo.png";

const Login = () => {
  const { instance } = useMsal();

  const handleMicrosoftLogin = () => {
    instance.loginRedirect({
      scopes: ["User.Read"],
      prompt: "select_account"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-900 flex items-center justify-center p-4">
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row items-center w-full max-w-6xl overflow-hidden border border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="hidden md:flex w-1/2 items-center justify-center bg-white/5 backdrop-blur-xl p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <img src={loginIllustration} alt="Login Illustration" className="h-80 object-contain" />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 p-10 text-white"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div
              className="p-1 rounded-full shadow-xl bg-black/30"
              initial={{ y: -100, scale: 0.5, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotate: [0, 0, 15, -15, 5, -5, 0] }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <img
                src={logo}
                alt="Ticxnova Logo"
                className="h-20 w-20 object-contain rounded-full border-2 border-fuchsia-400"
              />
            </motion.div>
          </div>

          <h2 className="text-3xl font-extrabold mb-4 text-center animate-pulse">
            🧠 AI-Powered Ticketing with <span className="text-amber-400">Ticxnova</span>
          </h2>
          <p className="mb-6 text-center text-sm text-gray-300">
            The smarter, faster way to manage your service requests and support workflows.
          </p>

          <button
            onClick={handleMicrosoftLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition duration-300"
          >
            🔐 Sign in with Microsoft
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Trouble accessing? <span className="text-blue-300 cursor-pointer hover:underline">Contact admin</span>
          </p>

          <motion.div
            className="mt-6 text-center text-xs text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p>🚀 Manage incidents, changes, tasks, and SLAs with ease.</p>
            <p className="mt-1 animate-pulse">⚡ Designed for efficiency. Built for speed.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
