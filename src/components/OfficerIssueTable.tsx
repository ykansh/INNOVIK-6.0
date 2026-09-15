"use client";

import { motion } from "framer-motion";
import { Search, Filter, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchIssues, CivicIssue } from "@/lib/supabase";

export default function OfficerIssueTable({
  title,
  filterStatus,
}: {
  title: string;
  filterStatus?: "Assigned" | "In Progress" | "Resolved";
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (err) {
        console.error("Error loading officer issues:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    if (filterStatus) {
      if (filterStatus === "Assigned" && issue.status !== "Assigned" && issue.status !== "Open") return false;
      if (filterStatus === "In Progress" && issue.status !== "In Progress") return false;
      if (filterStatus === "Resolved" && issue.status !== "Resolved" && issue.status !== "Closed") return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        issue.ticket_id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#171918]">{title}</h1>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#66706A]" />
            </div>
            <input
              type="text"
              placeholder="Search ticket ID or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full md:w-64 rounded-full border-0 py-2.5 pl-10 pr-3 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm sm:leading-6 bg-white"
            />
          </div>
          <button className="px-4 py-2.5 rounded-full border border-[#E5EAE6] bg-white text-[#171918] hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline font-medium text-sm">Filter</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-[#E5EAE6] rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#16A34A]" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-[#E5EAE6]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#66706A] uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE6]">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#171918]">
                        {issue.ticket_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#66706A]">
                        {issue.title || issue.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            issue.severity === "Critical" || issue.severity === "High"
                              ? "bg-red-100 text-red-800"
                              : issue.severity === "Medium"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#66706A] max-w-[200px] truncate">
                        {issue.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            issue.status === "Resolved" || issue.status === "Closed"
                              ? "bg-[#DCFCE7] text-[#16A34A]"
                              : issue.status === "In Progress"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/officer/issues/${issue.id}`}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-[#66706A] hover:bg-[#171918] hover:text-white transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#66706A] text-sm">
                      No issues found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
