// components/Logo.tsx
"use client";
import React from "react";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes: Record<string, string> = {
    sm: "text-2xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-6xl",
  };
  return (
    <div className="flex items-center gap-3 select-none">
      <div
        aria-hidden
        className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md"
      >
        <span className="text-white font-bold">R</span>
      </div>
      <span className={`font-extrabold text-white ${sizes[size]}`}>
        Referasy
      </span>
    </div>
  );
}
