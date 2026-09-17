"use client";

import { useEffect, useState } from "react";
import { Mail, Lock, Calendar, FileText, Camera, Edit2, Shield, Loader2 } from "lucide-react";
import { getCurrentUserProfile, fetchIssues, Profile } from "@/lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [queriesCount, setQueriesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userProfile, issues] = await Promise.all([
          getCurrentUserProfile(),
          fetchIssues(),
        ]);
        setProfile(userProfile);
        setQueriesCount(issues.length);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JS";

  const formattedLastLogin = profile?.last_sign_in_at
    ? new Date(profile.last_sign_in_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Today, Recent";

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin" />
        <p className="text-sm text-[#66706A]">Loading profile details from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#171918] tracking-tight">Your Profile</h1>
        <button className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803d] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5EAE6] overflow-hidden">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-[#DCFCE7] via-[#86EFAC] to-[#4ADE80] relative">
          {/* Avatar Profile */}
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="w-28 h-28 bg-white rounded-full p-1 shadow-md">
                <div className="w-full h-full bg-[#16A34A] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {initials}
                </div>
              </div>
              <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-[#16A34A] hover:scale-110 transition-all cursor-pointer">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info padding adjustment since avatar overlaps */}
        <div className="pt-16 pb-8 px-8">
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#171918]">
                {profile?.full_name || "John Smith"}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-[#66706A]">
                <Shield className="w-4 h-4 text-[#16A34A]" />
                <p className="capitalize">Verified {profile?.role || "Citizen"}</p>
                {profile?.badge_id && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    Badge: {profile.badge_id}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] px-4 py-2 rounded-full text-sm font-semibold">
              Member active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#171918] border-b border-[#E5EAE6] pb-3">Account Details</h3>
              
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#F7FAF8] group-hover:bg-[#DCFCE7] transition-colors flex items-center justify-center text-[#66706A] group-hover:text-[#16A34A]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-[#66706A] mb-0.5">Email Address</p>
                  <p className="font-medium text-[#171918]">{profile?.email || "citizen@example.com"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#F7FAF8] group-hover:bg-[#DCFCE7] transition-colors flex items-center justify-center text-[#66706A] group-hover:text-[#16A34A]">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#66706A] mb-0.5">Password</p>
                  <p className="font-medium text-[#171918] tracking-widest">••••••••••••</p>
                </div>
              </div>
            </div>

            {/* Activity Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#171918] border-b border-[#E5EAE6] pb-3">Activity Overview</h3>
              
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#F7FAF8] group-hover:bg-[#DCFCE7] transition-colors flex items-center justify-center text-[#66706A] group-hover:text-[#16A34A]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-[#66706A] mb-0.5">Last Logged In</p>
                  <p className="font-medium text-[#171918]">{formattedLastLogin}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#F7FAF8] group-hover:bg-[#DCFCE7] transition-colors flex items-center justify-center text-[#66706A] group-hover:text-[#16A34A]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-[#66706A] mb-0.5">Queries Raised</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#171918]">{queriesCount} Issues Reported</p>
                    <span className="bg-[#16A34A] text-white text-xs font-bold px-2 py-0.5 rounded-full">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
