// components/AuthForm.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "@/zustand/store";
import { tr } from "framer-motion/client";

type Props = {
  mode: "login" | "register";
  referralFromUrl?: string;
};

export default function AuthForm({ mode, referralFromUrl }: Props) {
  const router = useRouter();
  // console.log("first");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referredBy: referralFromUrl || "",
  });
  const [error, setError] = useState<string | null>(null);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  // console.log("referUrl" + referralFromUrl);

  const { User, setUser } = useUserStore();

  useEffect(() => {
    if (User) {
      if (mode === "login") {
        router.push("/dashboard");
      }
    }
  }, [User, router]);

  useEffect(() => {
    if (referralFromUrl)
      setForm((s) => ({ ...s, referralCode: referralFromUrl }));
  }, [referralFromUrl]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // basic client-side validation
    if (!form.email || !form.password || (mode === "register" && !form.name)) {
      setError("Please fill required fields.");
      return;
    }

    try {
      if (mode === "login") {
        axios
          .post(
            `${base_url}/auth/login`,
            {
              email: form.email,
              password: form.password,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            if (response.status !== 200) {
              setError("Login failed.");
              setLoading(false);
              return;
            } else {
              setError(null);
              toast.success("Login successful");
              setUser(response.data.user);
              setLoading(false);
              router.push("/dashboard");
            }
            // console.log("Login successful:", response.data);
          })
          .catch((error) => {
            setError(error.response?.data?.message || "Login failed.");
            setLoading(false);
          });
      } else {
        axios
          .post(
            `${base_url}/auth/register`,
            {
              name: form.name,
              email: form.email,
              password: form.password,
              referredBy: form.referredBy ? form.referredBy : null,
            },
            { withCredentials: true }
          )
          .then((response) => {
            if (response.status !== 200) {
              setError("Registration failed.");
              return;
            } else {
              setError(null);
              toast.success("Registration successful,login to continue");
              router.push("/login");
              setLoading(false);
            }
            // console.log("Registration successful:", response.data);
          })
          .catch((error) => {
            setError(error.response?.data?.message || "Registration failed.");
          });
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-linear-to-br from-slate-900 via-purple-900 to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <Logo size="sm" />
          <div className="text-sm text-gray-300 mx-9 md:mx-0">
            {mode === "login" ? "Welcome back" : "Start your account"}
          </div>
        </div>

        <h2 className="text-white text-2xl font-semibold mb-4">
          {mode === "login" ? "Login to your account" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-sm text-gray-200 block mb-1">
                Full name
              </label>
              <input
                autoComplete="off"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-200 block mb-1">Email</label>
            <input
              name="email"
              autoComplete="off"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          {/* referral (auto-filled from URL; user may edit) */}
          {mode === "register" && (
            <div>
              <label className="text-sm text-gray-200 block mb-1">
                Referral Code{" "}
                <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <input
                name="referralCode"
                value={form.referredBy}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter code or use referral link"
              />
              {referralFromUrl && (
                <p className="text-xs text-green-300 mt-1">
                  Referral code detected from link
                </p>
              )}
            </div>
          )}

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-white text-purple-700 font-semibold hover:opacity-95 transition"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-300">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <Link href="/register" className="text-white underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-white underline">
                Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
