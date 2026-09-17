"use client";

import IssueCard from "@/components/IssueCard";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchIssues, CivicIssue } from "@/lib/supabase";

export default function TrackMyIssues() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["All", "Open", "In Progress", "Resolved"];

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (err) {
        console.error("Error loading issues:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        issue.ticket_id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (activeTab === "All") return true;
    if (activeTab === "Open") return issue.status === "Open" || issue.status === "Under Review";
    if (activeTab === "In Progress") return issue.status === "In Progress" || issue.status === "Assigned";
    if (activeTab === "Resolved") return issue.status === "Resolved" || issue.status === "Closed";
    return issue.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#66706A] hover:text-[#171918] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#171918]">Track My Issues</h1>
            <p className="mt-2 text-[#66706A] text-lg">Monitor the progress of your submitted reports.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#66706A]" />
              </div>
              <input
                type="text"
                placeholder="Search ticket ID or problem..."
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
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E5EAE6] mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab
                      ? "border-[#16A34A] text-[#16A34A]"
                      : "border-transparent text-[#66706A] hover:text-[#171918] hover:border-gray-300"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Issues Feed */}
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#16A34A]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <IssueCard
                    id={issue.id}
                    ticketId={issue.ticket_id}
                    category={issue.title || issue.category}
                    location={issue.location}
                    date={new Date(issue.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    status={issue.status}
                    imageUrl={issue.image_url || "/sequence/frame_25.jpg"}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-[#E5EAE6]">
                <p className="text-[#171918] font-medium text-lg">No issues found.</p>
                <p className="text-[#66706A] mt-1">You don't have any issues matching this filter.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
