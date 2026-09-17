"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListTodo, PlayCircle, CheckCircle2, Bell, User, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUserProfile, signOutUser, Profile } from "@/lib/supabase";

export default function OfficerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function load() {
      const p = await getCurrentUserProfile();
      setProfile(p);
    }
    load();
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/officer/dashboard", icon: LayoutDashboard },
    { name: "Assigned Issues", href: "/officer/issues", icon: ListTodo },
    { name: "In Progress", href: "/officer/in-progress", icon: PlayCircle },
    { name: "Resolved", href: "/officer/resolved", icon: CheckCircle2 },
    { name: "Notifications", href: "/officer/notifications", icon: Bell },
    { name: "Profile", href: "/officer/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E5EAE6] z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#050505] p-1.5 rounded-lg flex items-center justify-center">
            <img src="/logo.png" alt="CVQ" className="h-6 w-auto" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#171918]">CVQ Officer</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-[#66706A]">
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-[#E5EAE6] z-40 px-4 py-4 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? "bg-[#DCFCE7] text-[#16A34A]" : "text-[#66706A] hover:bg-gray-50 hover:text-[#171918]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#16A34A]" : "text-[#66706A]"}`} />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-72 fixed top-0 bottom-0 left-0 bg-white border-r border-[#E5EAE6] z-40 p-6">
        <Link href="/officer/dashboard" className="flex items-center gap-3 mb-10">
          <div className="bg-[#050505] p-2 rounded-xl flex items-center justify-center">
            <img src="/logo.png" alt="CVQ" className="h-8 w-auto" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-[#171918] leading-none">CVQ</h1>
            <p className="text-xs text-[#66706A] mt-1 font-medium tracking-wider uppercase">Officer Portal</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/officer/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? "bg-[#DCFCE7] text-[#16A34A]" : "text-[#66706A] hover:bg-gray-50 hover:text-[#171918]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#16A34A]" : "text-[#66706A]"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-[#E5EAE6] space-y-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : "OR"}
            </div>
            <div className="truncate flex-1">
              <p className="text-sm font-bold text-[#171918] truncate">
                {profile?.full_name || "Officer Raj"}
              </p>
              <p className="text-xs text-[#66706A] truncate">
                {profile?.badge_id ? `Badge: ${profile.badge_id}` : "Electrical Dept"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
