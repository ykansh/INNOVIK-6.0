"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Search, Zap, Droplets, Trash2, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#e5e5e3] flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#66706A] font-medium animate-pulse">Loading Live Map...</p>
    </div>
  ),
});

const categories = [
  { name: "All", color: "bg-gray-100 text-[#171918]" },
  { name: "Roads", icon: MapPin, color: "bg-slate-100 text-slate-700" },
  { name: "Garbage", icon: Trash2, color: "bg-orange-100 text-orange-700" },
  { name: "Street Lights", icon: Zap, color: "bg-yellow-100 text-yellow-700" },
  { name: "Water", icon: Droplets, color: "bg-blue-100 text-blue-700" },
];

const mockMapMarkers = [
  {
    id: "1",
    ticketId: "CIV-ISS-1042",
    category: "Street Lights",
    issue: "Fallen Electric Wire",
    severity: "HIGH",
    status: "Assigned",
    x: 40,
    y: 35,
    icon: Zap,
    colorClass: "bg-yellow-500 text-white",
    pulse: true
  },
  {
    id: "2",
    ticketId: "CIV-ISS-1011",
    category: "Garbage",
    issue: "Overflowing Dumpster",
    severity: "MEDIUM",
    status: "Open",
    x: 65,
    y: 20,
    icon: Trash2,
    colorClass: "bg-orange-500 text-white",
    pulse: false
  },
  {
    id: "3",
    ticketId: "CIV-ISS-0988",
    category: "Roads",
    issue: "Deep Pothole",
    severity: "LOW",
    status: "In Progress",
    x: 25,
    y: 70,
    icon: MapPin,
    colorClass: "bg-slate-500 text-white",
    pulse: false
  },
  {
    id: "4",
    ticketId: "CIV-ISS-1055",
    category: "Water",
    issue: "Burst Pipe",
    severity: "HIGH",
    status: "Under Review",
    x: 75,
    y: 65,
    icon: Droplets,
    colorClass: "bg-blue-500 text-white",
    pulse: true
  }
];

export default function NearbyIssues() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMarker, setSelectedMarker] = useState<typeof mockMapMarkers[0] | null>(null);

  const filteredMarkers = mockMapMarkers.filter(m => activeCategory === "All" || m.category === activeCategory);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      
      <div className="flex items-center justify-between shrink-0">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[#66706A] hover:text-[#171918] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-white rounded-3xl border border-[#E5EAE6] shadow-sm overflow-hidden flex flex-col md:flex-row relative"
      >
        {/* Left Sidebar (Filters & List) */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-[#E5EAE6] bg-white z-10 flex flex-col h-[40vh] md:h-auto shrink-0">
          <div className="p-6 border-b border-[#E5EAE6]">
            <h1 className="text-2xl font-bold text-[#171918] mb-4">Nearby Issues</h1>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#66706A]" />
              </div>
              <input
                type="text"
                placeholder="Search location or issue..."
                className="block w-full rounded-full border-0 py-2.5 pl-10 pr-3 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm bg-[#F7FAF8]"
              />
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold text-[#66706A] uppercase tracking-wider mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setSelectedMarker(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                    activeCategory === cat.name
                      ? "border-[#16A34A] bg-[#DCFCE7] text-[#16A34A]"
                      : "border-[#E5EAE6] bg-white text-[#66706A] hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <h2 className="text-xs font-bold text-[#66706A] uppercase tracking-wider mb-3">
              {activeCategory === "All" ? "All Issues" : `${activeCategory} Issues`}
            </h2>
            <div className="space-y-3">
              {filteredMarkers.map(marker => (
                <div 
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedMarker?.id === marker.id 
                      ? "border-[#16A34A] bg-[#DCFCE7]/30" 
                      : "border-[#E5EAE6] hover:border-[#16A34A]/50 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-bold text-[#66706A]">{marker.ticketId}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                      marker.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 
                      marker.severity === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {marker.severity}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#171918]">{marker.issue}</h3>
                  <p className="text-xs text-[#66706A] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {marker.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real Map Area */}
        <div className="flex-1 bg-[#e5e5e3] relative h-[60vh] md:h-auto z-0">
          <DynamicMap 
            markers={filteredMarkers} 
            activeMarker={selectedMarker} 
            setActiveMarker={setSelectedMarker} 
          />
        </div>
      </motion.div>
    </div>
  );
}
