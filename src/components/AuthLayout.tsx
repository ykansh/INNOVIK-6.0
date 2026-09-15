"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#171918] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative z-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <div className="bg-[#050505] p-3 rounded-xl shadow-md flex items-center justify-center">
            <img src="/logo.png" alt="CVQ Logo" className="h-10 w-auto" />
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#171918]">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-[#66706A]">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-[#E5EAE6]"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
