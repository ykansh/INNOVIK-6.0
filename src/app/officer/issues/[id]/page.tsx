"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle, Zap, Camera, Play, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { fetchIssueById, updateIssueStatus, CivicIssue } from "@/lib/supabase";

export default function OfficerIssueDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [issue, setIssue] = useState<CivicIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ASSIGNED");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchIssueById(id);
        if (data) {
          setIssue(data);
          setStatus(data.status.toUpperCase().replace(" ", "_"));
        }
      } catch (e) {
        console.error("Error loading issue:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAcceptAndStart = async () => {
    setIsUpdating(true);
    try {
      await updateIssueStatus(id, "In Progress");
      setStatus("IN_PROGRESS");
      if (issue) setIssue({ ...issue, status: "In Progress" });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadResolution = async () => {
    setIsUpdating(true);
    try {
      await updateIssueStatus(id, "Resolved", "Issue has been verified and resolved by the municipal team.");
      setStatus("RESOLVED");
      if (issue) setIssue({ ...issue, status: "Resolved", resolution_note: "Issue has been verified and resolved by the municipal team." });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProgress = () => {
    alert("Progress updated successfully!");
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin" />
        <p className="text-sm text-[#66706A]">Loading issue details...</p>
      </div>
    );
  }

  const currentTicket: CivicIssue = issue || {
    id: id,
    ticket_id: `CIV-ISS-${id}`,
    title: "Unknown Issue",
    category: "General",
    location: "Location unknown",
    description: "Description not available",
    status: "Assigned",
    severity: "Medium",
    department: "Municipal",
    image_url: "/sequence/frame_5.jpg",
    created_at: new Date().toISOString(),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link href="/officer/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[#66706A] hover:text-[#171918] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' : 
          status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
          status === 'RESOLVED' ? 'bg-[#DCFCE7] text-[#16A34A]' :
          'bg-gray-100 text-gray-800'
        }`}>
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
              <p className="text-sm font-bold text-[#66706A] tracking-widest uppercase mb-2">{currentTicket.ticket_id}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#171918]">{currentTicket.title || currentTicket.category}</h1>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#66706A]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {currentTicket.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`w-4 h-4 ${currentTicket.severity === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                  <span className={`${currentTicket.severity === 'High' ? 'text-red-600' : 'text-orange-600'} font-medium uppercase`}>{currentTicket.severity} PRIORITY</span>
                </div>
                <div>
                  <span className="font-medium text-[#171918]">Reported on:</span> {new Date(currentTicket.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {status === "ASSIGNED" && (
              <button 
                onClick={handleAcceptAndStart}
                disabled={isUpdating}
                className="shrink-0 flex items-center justify-center gap-2 bg-[#16A34A] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#087A3D] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Accept & Start
              </button>
            )}
            
            {status === "IN_PROGRESS" && (
              <div className="shrink-0 flex gap-3 flex-wrap md:flex-nowrap">
                <button 
                  onClick={handleUpdateProgress}
                  className="flex items-center justify-center gap-2 bg-white text-[#171918] border border-[#E5EAE6] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Update Progress
                </button>
                <button 
                  onClick={handleUploadResolution}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-2 bg-[#171918] text-white px-6 py-3 rounded-xl font-semibold hover:bg-black transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  Upload Resolution
                </button>
              </div>
            )}
          </div>
        </div>

        {status === 'ASSIGNED' && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5EAE6]">
            {/* Left Column: Evidence */}
            <div className="p-6 md:p-8 bg-gray-50/50">
              <h2 className="text-sm font-bold text-[#171918] uppercase tracking-wider mb-4">Original Evidence</h2>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 shadow-inner mb-4 relative group">
                <img src={currentTicket.image_url || "/sequence/frame_5.jpg"} alt="Evidence" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#171918] mb-1">Citizen Description</p>
                <p className="text-sm text-[#66706A] italic border-l-2 border-[#E5EAE6] pl-3 py-1">
                  "{currentTicket.description || 'No description provided.'}"
                </p>
              </div>
            </div>

            {/* Right Column: AI Analysis & Timeline */}
            <div className="p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-sm font-bold text-[#171918] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  AI Analysis Support
                </h2>
                <div className="bg-white border border-[#E5EAE6] rounded-xl p-4 shadow-sm space-y-3">
                  <p className="text-sm text-[#66706A]">
                    <strong className="text-[#171918] block mb-1">Summary:</strong>
                    Identified issue matches the reported category "{currentTicket.category}". Action required based on severity level.
                  </p>
                  <div className="pt-3 border-t border-[#E5EAE6] flex justify-between items-center text-sm">
                    <span className="font-medium text-[#171918]">AI Confidence</span>
                    <span className="text-[#16A34A] font-bold">96%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-[#171918]">Recommended Action</span>
                    <span className={`${currentTicket.severity === 'High' ? 'text-red-600' : 'text-[#171918]'} font-bold`}>
                      {currentTicket.severity === 'High' ? 'Immediate Securement' : 'Standard Procedure'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === 'IN_PROGRESS' && (
          <div className="p-6 md:p-8 bg-gray-50/50">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-[#171918]">Resolution Workflow</h2>
                <p className="text-[#66706A]">Estimated time to resolve: <span className="font-bold text-blue-600">3 Days</span></p>
              </div>

              <div className="relative">
                <div className="absolute left-8 top-8 bottom-8 w-1 bg-[#E5EAE6] rounded-full"></div>
                <div className="space-y-6 relative z-10">
                  {/* Step 1 */}
                  <div className="flex gap-6 items-start group">
                    <div className="w-16 h-16 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <Check className="w-8 h-8" />
                    </div>
                    <div className="bg-white border border-[#E5EAE6] p-5 rounded-2xl flex-1 shadow-sm">
                      <h3 className="font-bold text-[#171918] text-lg">Step 1: On-site Inspection</h3>
                      <p className="text-[#66706A] text-sm mt-1">Officer has arrived at the location and verified the reported issue.</p>
                      <span className="inline-block mt-3 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">Completed</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6 items-start group">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="bg-white border border-blue-200 p-5 rounded-2xl flex-1 shadow-md ring-2 ring-blue-500/20">
                      <h3 className="font-bold text-blue-700 text-lg">Step 2: Procurement & Planning</h3>
                      <p className="text-[#66706A] text-sm mt-1">Gathering required materials and coordinating with the municipal repair team.</p>
                      <span className="inline-block mt-3 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">Current Phase</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6 items-start opacity-60">
                    <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="bg-white border border-[#E5EAE6] p-5 rounded-2xl flex-1">
                      <h3 className="font-bold text-[#171918] text-lg">Step 3: Repairs & Securement</h3>
                      <p className="text-[#66706A] text-sm mt-1">Execution of repairs and final safety checks to resolve the issue.</p>
                      <span className="inline-block mt-3 bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full">Upcoming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(status === 'RESOLVED' || status === 'CLOSED') && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5EAE6]">
            <div className="p-6 md:p-8 bg-[#DCFCE7]/30 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-24 h-24 bg-[#16A34A] rounded-full flex items-center justify-center shadow-xl">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#16A34A]">Issue Resolved</h2>
                <p className="text-[#66706A] mt-2">The civic issue has been successfully addressed and secured.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm w-full text-left mt-6">
                <p className="text-sm font-bold text-[#171918] mb-1">Resolution Note</p>
                <p className="text-sm text-[#66706A] italic">
                  "{currentTicket.resolution_note || "Issue has been verified and resolved by the municipal team."}"
                </p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 bg-gray-50/50">
              <h2 className="text-sm font-bold text-[#171918] uppercase tracking-wider mb-4">Comparison</h2>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Before</span>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 shadow-inner">
                    <img src={currentTicket.image_url || "/sequence/frame_5.jpg"} alt="Before" className="w-full h-full object-cover opacity-80" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">After</span>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 shadow-inner">
                    <img src="/sequence/frame_25.jpg" alt="After" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
