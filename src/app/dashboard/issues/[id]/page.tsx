"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Check, ShieldCheck, ThumbsUp, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { fetchIssueById, updateIssueStatus, CivicIssue } from "@/lib/supabase";

export default function CitizenIssueDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [issue, setIssue] = useState<CivicIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("AWAITING_VERIFICATION");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchIssueById(id);
        if (data) {
          setIssue(data);
          setStatus(data.status === "Closed" ? "CLOSED" : data.status === "Resolved" ? "AWAITING_VERIFICATION" : data.status.toUpperCase());
        }
      } catch (e) {
        console.error("Error loading issue:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCloseTicket = async () => {
    setStatus("CLOSED");
    if (issue) {
      await updateIssueStatus(issue.id, "Closed");
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin" />
        <p className="text-sm text-[#66706A]">Loading ticket details from Supabase...</p>
      </div>
    );
  }

  const currentTicket: CivicIssue = issue || {
    id: id,
    ticket_id: `CIV-ISS-${id}`,
    title: "Fallen Electric Wire",
    category: "Electrical Services",
    location: "22.7196, 75.8577 (Main Road)",
    description: "Electric wire has fallen near the main road. Sparks were visible earlier. Very dangerous for pedestrians.",
    status: "In Progress",
    severity: "High",
    department: "Electrical Dept",
    resolution_note: "The fallen electrical wire has been safely secured and the damaged section was completely replaced. Power restored to the sector.",
    image_url: "/sequence/frame_25.jpg",
    created_at: new Date().toISOString(),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/issues"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#66706A] hover:text-[#171918] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Issues
        </Link>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            status === "AWAITING_VERIFICATION"
              ? "bg-orange-100 text-orange-800"
              : status === "CLOSED"
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-[#E5EAE6] shadow-sm overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-[#E5EAE6]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-[#66706A] tracking-widest uppercase mb-2">
                {currentTicket.ticket_id}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#171918]">
                {currentTicket.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#66706A]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {currentTicket.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Reported:{" "}
                  {new Date(currentTicket.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5EAE6]">
          {/* Left Column: Evidence & Resolution */}
          <div className="p-6 md:p-8 bg-gray-50/50 space-y-8">
            {/* Resolution Evidence */}
            {(status === "AWAITING_VERIFICATION" || status === "CLOSED") && (
              <div>
                <h2 className="text-sm font-bold text-[#16A34A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Municipality Resolution
                </h2>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 shadow-inner mb-4 relative">
                  <img
                    src={currentTicket.image_url || "/sequence/frame_25.jpg"}
                    alt="Resolved"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#16A34A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                    After
                  </div>
                </div>
                <p className="text-sm text-[#171918] font-medium mb-1">Officer's Note:</p>
                <p className="text-sm text-[#66706A] italic border-l-2 border-[#16A34A] pl-3 py-1">
                  "{currentTicket.resolution_note || "The civic issue has been resolved safely by the municipal response team."}"
                </p>

                {status === "AWAITING_VERIFICATION" && (
                  <div className="mt-8 bg-white border border-[#E5EAE6] rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-[#171918] mb-2 text-center">Is the issue fully resolved?</h3>
                    <p className="text-xs text-[#66706A] text-center mb-5">
                      Please verify the resolution to close this ticket.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCloseTicket}
                        className="flex-1 bg-[#16A34A] hover:bg-[#087A3D] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Yes, Close It
                      </button>
                      <button className="flex-1 bg-white border border-[#E5EAE6] hover:bg-red-50 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <AlertCircle className="w-4 h-4" />
                        Still a Problem
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Original Report */}
            <div>
              <h2 className="text-sm font-bold text-[#171918] uppercase tracking-wider mb-4">Your Original Report</h2>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 shadow-inner mb-4 relative">
                <img
                  src={currentTicket.image_url || "/sequence/frame_5.jpg"}
                  alt="Original Evidence"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 left-2 bg-gray-900/70 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur-sm">
                  Before
                </div>
              </div>
              <p className="text-sm text-[#66706A]">
                "{currentTicket.description || "Issue reported with photographic evidence to the municipality."}"
              </p>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h2 className="text-sm font-bold text-[#171918] uppercase tracking-wider mb-6">Tracking Timeline</h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E5EAE6] before:to-transparent">
                {/* Timeline Item - Created */}
                <div className="relative flex items-center group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#16A34A] shrink-0 shadow-sm relative z-10">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-[calc(100%-2rem)] ml-4 bg-white p-3 rounded-lg border border-[#E5EAE6] shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-[#171918] text-xs uppercase tracking-wider">
                        Report Submitted
                      </div>
                      <time className="text-[10px] text-[#66706A] font-medium">Recorded</time>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - Analyzed */}
                <div className="relative flex items-center group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#16A34A] shrink-0 shadow-sm relative z-10">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-[calc(100%-2rem)] ml-4 bg-white p-3 rounded-lg border border-[#E5EAE6] shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-[#171918] text-xs uppercase tracking-wider">
                        AI Analysis Complete
                      </div>
                      <time className="text-[10px] text-[#66706A] font-medium">Verified</time>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - Assigned */}
                <div className="relative flex items-center group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#16A34A] shrink-0 shadow-sm relative z-10">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-[calc(100%-2rem)] ml-4 bg-white p-3 rounded-lg border border-[#E5EAE6] shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-[#171918] text-xs uppercase tracking-wider">
                        Assigned to {currentTicket.department || "Department"}
                      </div>
                      <time className="text-[10px] text-[#66706A] font-medium">Dispatched</time>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - Work Started */}
                <div className="relative flex items-center group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#16A34A] shrink-0 shadow-sm relative z-10">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-[calc(100%-2rem)] ml-4 bg-white p-3 rounded-lg border border-[#E5EAE6] shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-[#171918] text-xs uppercase tracking-wider">
                        Status: {currentTicket.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - Closed */}
                <div className="relative flex items-center group is-active">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full border border-white shrink-0 shadow-sm relative z-10 ${
                      status === "CLOSED" ? "bg-[#16A34A]" : "bg-gray-200"
                    }`}
                  >
                    {status === "CLOSED" ? <Check className="w-3 h-3 text-white" /> : null}
                  </div>
                  <div
                    className={`w-[calc(100%-2rem)] ml-4 bg-white p-3 rounded-lg border shadow-sm ${
                      status === "CLOSED" ? "border-green-200 bg-[#DCFCE7]/30" : "border-[#E5EAE6] opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div
                        className={`font-bold text-xs uppercase tracking-wider ${
                          status === "CLOSED" ? "text-[#16A34A]" : "text-[#66706A]"
                        }`}
                      >
                        Ticket Closed
                      </div>
                      {status === "CLOSED" && (
                        <time className="text-[10px] text-[#16A34A] font-medium">Just now</time>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
