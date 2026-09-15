"use client";

import IssueCard from "@/components/IssueCard";
import { motion } from "framer-motion";
import { Camera, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchIssues, fetchIssueStats, getCurrentUserProfile, CivicIssue, Profile } from "@/lib/supabase";

export default function CitizenHome() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [stats, setStats] = useState({ open: 2, inProgress: 1, resolved: 8 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userProfile, issueList, statsData] = await Promise.all([
          getCurrentUserProfile(),
          fetchIssues(),
          fetchIssueStats(),
        ]);
        setProfile(userProfile);
        setIssues(issueList.slice(0, 4));
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const userName = profile?.full_name?.split(" ")[0] || "Citizen";

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#171918]">
            Hi, {userName}
          </h1>
          <p className="mt-2 text-[#66706A] text-lg">Help make your city better, one report at a time.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/issues" className="px-5 py-2.5 rounded-full border border-[#E5EAE6] bg-white text-[#171918] font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm">
            Track My Issues
          </Link>
          <Link href="/dashboard/report" className="px-5 py-2.5 rounded-full bg-[#16A34A] text-white font-medium hover:bg-[#16A34A]/90 transition-colors shadow-sm text-sm flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Report an Issue
          </Link>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-white p-6 rounded-2xl border border-[#E5EAE6] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#66706A]">Open Issues</p>
            <p className="text-2xl font-bold text-[#171918]">{stats.open}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E5EAE6] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#66706A]">In Progress</p>
            <p className="text-2xl font-bold text-[#171918]">{stats.inProgress}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E5EAE6] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-[#DCFCE7] p-3 rounded-xl text-[#16A34A]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#66706A]">Resolved</p>
            <p className="text-2xl font-bold text-[#171918]">{stats.resolved}</p>
          </div>
        </div>
      </motion.section>

      {/* Quick Action Highlight */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#171918] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#16A34A]/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-xl">
          <p className="text-[#16A34A] font-semibold tracking-wider text-sm mb-2 uppercase">Report A Problem</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See something that needs attention?</h2>
          <p className="text-gray-400 text-lg">Snap a photo and CVQ's AI will automatically route it to the correct department.</p>
        </div>
        <div className="relative z-10 shrink-0 w-full md:w-auto">
          <Link href="/dashboard/report" className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-full font-bold text-lg transition-colors shadow-xl">
            <Camera className="w-5 h-5" />
            Take a Photo & Report
          </Link>
        </div>
      </motion.section>

      {/* Recent Issues List */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#171918]">Recent Civic Issues</h2>
          <Link href="/dashboard/issues" className="text-[#16A34A] font-medium text-sm hover:underline">View all</Link>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#16A34A]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                id={issue.id}
                ticketId={issue.ticket_id}
                category={issue.title || issue.category}
                location={issue.location}
                date={new Date(issue.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                status={issue.status}
                imageUrl={issue.image_url || "/sequence/frame_25.jpg"}
              />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
