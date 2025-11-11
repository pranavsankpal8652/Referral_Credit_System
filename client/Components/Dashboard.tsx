"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Share2 } from "lucide-react";
import axios from "axios";
import Logo from "@/Components/Logo";
import { useUserStore } from "@/zustand/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { cleanupSocket, setupSocketListeners, socket } from "@/socket/socket";

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const { User, clearUser, setUser } = useUserStore();
  const [referralLink, setReferralLink] = useState("");
  const router = useRouter();

  // -----------------------------
  // REFERRAL LINK
  // -----------------------------
  useEffect(() => {
    if (User) {
      setupSocketListeners(User, setUser); // Setup socket listeners with current User and setUser
      setReferralLink(
        `${window.location.origin}/register?r=${User.referralCode}`
      );
    }
  }, [User]);

  // -----------------------------
  // COPY
  // -----------------------------
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        toast.info(response.data);
        clearUser();
        socket.disconnect(); // ✅ close socket
        cleanupSocket(); // ✅ clean up listeners
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
  };

  // -----------------------------
  // SHARE
  // -----------------------------
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on this awesome platform!",
          text: "Sign up using my referral link to earn credits.",
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      toast.error("Sharing not supported on this browser.");
    }
  };

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  const handleSeeProducts = () => {
    router.push("/dashboard/products");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-800 text-white px-4 py-6 sm:px-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <Logo size="md" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
          <div className="text-center sm:text-right w-full sm:w-auto">
            <div className="text-lg font-semibold truncate">
              {User?.name || "Loading..."}
            </div>
            <div className="text-sm text-gray-400 truncate">{User?.email}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleSeeProducts}
              className="bg-violet-500 text-slate-200 fw-bolder font-bold px-4 py-2 rounded-lg hover:bg-violet-600 transition w-full sm:w-auto cursor-pointer"
            >
              See Products
            </button>
            <button
              onClick={logout}
              className="bg-purple-500 shadow-2xl text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition w-full sm:w-auto"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-lg mb-8 lg:my-14"
      >
        <h2 className="text-xl font-semibold mb-3 text-center sm:text-left">
          Your Referral Link
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 ">
          <input
            readOnly
            value={referralLink}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none text-sm sm:text-base"
          />
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition w-full sm:w-auto"
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition w-full sm:w-auto"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 lg:my-10">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 text-center shadow"
        >
          <h3 className="text-2xl font-bold text-purple-400">
            {User?.credits ?? 0}
          </h3>
          <p className="text-sm text-gray-300">Credits Earned</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 text-center shadow"
        >
          <h3 className="text-2xl font-bold text-purple-400">
            {User?.referredUsersLength || 0}
          </h3>
          <p className="text-sm text-gray-300">Referred Users</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 text-center shadow"
        >
          <h3 className="text-2xl font-bold text-purple-400">
            #{User?.referralCode || "—"}
          </h3>
          <p className="text-sm text-gray-300">Referral Code</p>
        </motion.div>
      </div>

      {/* Converted Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-lg lg:m-auto lg:max-w-3xl lg:text-center lg:my-10"
      >
        <h3 className="text-2xl font-bold text-purple-400 text-center">
          {User?.convertedUsersLength || 0}
        </h3>
        <p className="text-sm text-gray-300">Converted Users (who purchased)</p>
      </motion.div>
    </div>
  );
}
