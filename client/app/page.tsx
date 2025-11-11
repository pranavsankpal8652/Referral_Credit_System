"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function SplashScreen() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden relative">
      {/* glowing background circles */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl top-10 left-10 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />

      {/* logo / main heading */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold z-10 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Referasy
      </motion.h1>

      {/* typing animation */}
      <div className="mt-4 text-lg md:text-xl text-gray-200">
        <TypeAnimation
          sequence={[
            "Invite friends. Earn rewards.",
            2000,
            "Share your code. Get credits.",
            2000,
            "Build your referral network easily.",
            2000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </div>

      {/* button fade in */}
      <motion.a
        href="/login"
        className="mt-10 bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-purple-200 transition-all duration-300 shadow-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Get Started
      </motion.a>
    </div>
  );
}
