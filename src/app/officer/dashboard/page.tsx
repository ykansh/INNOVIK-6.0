"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle2, ListTodo, MapPin, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchIssues, CivicIssue, fetchIssueStats } from "@/lib/supabase";

export default function OfficerDashboard() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "New" | "In Progress">("All");
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        const [issuesData, statsData] = await Promise.all([
          fetchIssues(),
          fetchIssueStats(),
        ]);
        setIssues(issuesData || []);
        if (statsData) {
          setStats(statsData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const priorityIssues = issues.filter(i => i.severity === "High" || i.severity === "Critical").slice(0, 2);
  
  const filteredAssignedIssues = issues.filter(i => {
    if (filter === "New") return i.status === "Assigned" || i.status === "Open";
    if (filter === "In Progress") return i.status === "In Progress";
    return true; // All
  }).slice(0, 5); // show max 5 on dashboard

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#171918]">Officer Dashboard</h1>
        <p className="mt-2 text-[#66706A] text-lg">Here are the civic issues that need your attention.</p>
      </motion.section>

      {/* Summary Statistics */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Link href="/officer/issues" className="block">
          <div className="bg-white p-5 rounded-2xl border border-[#E5EAE6] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                <ListTodo className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#171918]">{stats.open}</p>
              <p className="text-sm font-semibold text-[#66706A] mt-1 uppercase tracking-wider">Assigned</p>
            </div>
          </div>
        </Link>

        <Link href="/officer/in-progress" className="block">
          <div className="bg-white p-5 rounded-2xl border border-[#E5EAE6] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#171918]">{stats.inProgress}</p>
              <p className="text-sm font-semibold text-[#66706A] mt-1 uppercase tracking-wider">In Progress</p>
            </div>
          </div>
        </Link>

        <Link href="/officer/issues" className="block">
          <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-red-100 p-2.5 rounded-lg text-red-600">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-bold text-[#171918]">{priorityIssues.length}</p>
              <p className="text-sm font-semibold text-red-600 mt-1 uppercase tracking-wider">High Priority</p>
            </div>
          </div>
        </Link>

        <Link href="/officer/resolved" className="block">
          <div className="bg-white p-5 rounded-2xl border border-[#E5EAE6] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-[#DCFCE7] p-2.5 rounded-lg text-[#16A34A]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#171918]">{stats.resolved}</p>
              <p className="text-sm font-semibold text-[#66706A] mt-1 uppercase tracking-wider">Resolved</p>
            </div>
          </div>
        </Link>
      </motion.section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Priority Issues */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-1 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#171918]">Priority Issues</h2>
          </div>
          
          {priorityIssues.length > 0 ? priorityIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-2xl border border-red-200 overflow-hidden shadow-md flex flex-col">
              <div className="h-40 bg-gray-200 relative">
                <img src={issue.image_url || "/sequence/frame_5.jpg"} alt={issue.category} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                  {issue.severity}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-[#66706A] tracking-wider uppercase">{issue.ticket_id}</span>
                </div>
                <h3 className="text-lg font-bold text-[#171918] mb-4">{issue.title || issue.category}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm text-[#66706A]">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-[#171918]">Location:</p>
                      <p className="truncate w-48">{issue.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#66706A]">
                    <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-[#171918]">Reported:</p>
                      <p>{new Date(issue.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#E5EAE6] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#66706A] uppercase tracking-wider">Status</p>
                    <p className="font-semibold text-blue-600">{issue.status}</p>
                  </div>
                  <Link 
                    href={`/officer/issues/${issue.id}`}
                    className="inline-flex items-center gap-2 bg-[#171918] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                  >
                    View Issue
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-2xl border border-[#E5EAE6] p-6 text-center text-[#66706A]">
              No high priority issues found.
            </div>
          )}
        </motion.section>

        {/* My Assigned Issues Table */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#171918]">My Assigned Issues</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter("All")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "All" ? "bg-[#171918] text-white" : "text-[#66706A] hover:bg-gray-100"}`}
              >All</button>
              <button 
                onClick={() => setFilter("New")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "New" ? "bg-[#171918] text-white" : "text-[#66706A] hover:bg-gray-100"}`}
              >New</button>
              <button 
                onClick={() => setFilter("In Progress")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "In Progress" ? "bg-[#171918] text-white" : "text-[#66706A] hover:bg-gray-100"}`}
              >In Progress</button>
            </div>
          </div>
          
          <div className="bg-white border border-[#E5EAE6] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-[#E5EAE6]">
                    <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Ticket</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Issue</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Reported</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAE6]">
                  {filteredAssignedIssues.length > 0 ? filteredAssignedIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#171918]">
                        {issue.ticket_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#66706A] max-w-[150px] truncate">
                        {issue.title || issue.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          issue.severity === 'High' || issue.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {issue.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#66706A]">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          issue.status === 'Resolved' || issue.status === 'Closed' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                          issue.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/officer/issues/${issue.id}`} className="text-[#16A34A] hover:text-[#087A3D] opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-[#66706A] text-sm">
                        No issues found matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
