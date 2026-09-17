"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, Building, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export default function OfficerProfile() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[#171918]">Officer Profile</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: ID Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 bg-white border border-[#E5EAE6] rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-32 bg-[#171918]"></div>
          
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative z-10 mt-8 mb-4 shadow-md">
            <img src="https://i.pravatar.cc/300?u=a042581f4e29026704d" alt="Officer" className="w-full h-full object-cover" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#171918]">Raj Kumar</h2>
          <p className="text-[#16A34A] font-semibold text-sm mb-4">Senior Electrical Officer</p>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-[#66706A] uppercase tracking-wider mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Emp ID: OFF-8821
          </div>

          <div className="w-full space-y-4 text-left border-t border-[#E5EAE6] pt-6">
            <div className="flex items-center gap-3 text-sm text-[#66706A]">
              <Building className="w-5 h-5 text-[#171918]" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider">Department</p>
                <p className="font-medium text-[#171918]">Electrical Services</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#66706A]">
              <Mail className="w-5 h-5 text-[#171918]" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider">Email</p>
                <p className="font-medium text-[#171918]">raj.kumar@cvq.gov</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#66706A]">
              <Phone className="w-5 h-5 text-[#171918]" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider">Phone</p>
                <p className="font-medium text-[#171918]">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Stats & Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white border border-[#E5EAE6] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#66706A] uppercase tracking-wider">Assigned</h3>
              </div>
              <p className="text-3xl font-bold text-[#171918]">342</p>
            </div>
            
            <div className="bg-white border border-[#E5EAE6] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#66706A] uppercase tracking-wider">Resolved</h3>
              </div>
              <p className="text-3xl font-bold text-[#171918]">318</p>
            </div>
            
            <div className="bg-white border border-[#E5EAE6] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#66706A] uppercase tracking-wider">Avg Time</h3>
              </div>
              <p className="text-3xl font-bold text-[#171918]">2.4<span className="text-base text-[#66706A] font-medium ml-1">days</span></p>
            </div>
          </motion.div>

          {/* Activity/Settings Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[#E5EAE6] rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[#171918] mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { action: "Resolved Ticket CIV-ISS-0988", time: "2 days ago" },
                { action: "Accepted Ticket CIV-ISS-1042", time: "3 days ago" },
                { action: "Updated Profile Information", time: "1 week ago" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-2 shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-[#171918]">{item.action}</p>
                    <p className="text-xs text-[#66706A] mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
