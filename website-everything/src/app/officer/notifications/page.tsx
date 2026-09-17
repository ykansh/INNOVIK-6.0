"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function OfficerNotifications() {
  const notifications = [
    {
      id: 1,
      title: "New high-priority issue assigned",
      message: "Ticket CIV-ISS-1042 (Fallen Electric Wire) has been assigned to you.",
      time: "10 minutes ago",
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100 border-red-200",
      unread: true,
    },
    {
      id: 2,
      title: "Resolution approved",
      message: "Citizen has verified your resolution for CIV-ISS-1020.",
      time: "2 hours ago",
      icon: ShieldCheck,
      color: "text-[#16A34A] bg-[#DCFCE7] border-[#16A34A]/20",
      unread: true,
    },
    {
      id: 3,
      title: "New issue near your assigned area",
      message: "Ticket CIV-ISS-1038 has been reported in your sector.",
      time: "Yesterday",
      icon: Bell,
      color: "text-blue-600 bg-blue-100 border-blue-200",
      unread: false,
    },
    {
      id: 4,
      title: "Ticket Closed successfully",
      message: "CIV-ISS-0988 has been successfully closed.",
      time: "2 days ago",
      icon: CheckCircle2,
      color: "text-gray-600 bg-gray-100 border-gray-200",
      unread: false,
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#171918]">Notifications</h1>
          <p className="mt-2 text-[#66706A]">Stay updated on your assigned issues.</p>
        </div>
        <button className="text-sm font-semibold text-[#16A34A] hover:text-[#087A3D]">Mark all as read</button>
      </motion.div>

      <div className="bg-white border border-[#E5EAE6] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E5EAE6]">
        {notifications.map((notif, index) => {
          const Icon = notif.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={notif.id} 
              className={`p-5 md:p-6 flex gap-4 transition-colors hover:bg-gray-50/50 ${notif.unread ? 'bg-[#F7FAF8]' : 'bg-white'}`}
            >
              <div className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center ${notif.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base font-bold text-[#171918] ${notif.unread ? '' : 'opacity-90'}`}>{notif.title}</h3>
                  <span className="text-xs font-medium text-[#66706A] whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className="text-sm text-[#66706A]">{notif.message}</p>
              </div>
              {notif.unread && (
                <div className="shrink-0 flex items-center justify-center mt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
