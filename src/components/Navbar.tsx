"use client";

import Link from "next/link";
import { Bell, User, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOutUser, getCurrentUserProfile, Profile } from "@/lib/supabase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const p = await getCurrentUserProfile();
      setProfile(p);
    }
    load();
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setIsUserMenuOpen(false);
    setIsOpen(false);
    router.push("/login");
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Report Issue", href: "/dashboard/report" },
    { name: "My Issues", href: "/dashboard/issues" },
    { name: "Nearby Issues", href: "/dashboard/nearby" },
  ];

  return (
    <nav className="bg-white border-b border-[#E5EAE6] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-[#050505] p-1.5 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="CVQ" className="h-6 w-auto" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#171918]">CVQ</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === link.href
                      ? "border-[#16A34A] text-[#171918]"
                      : "border-transparent text-[#66706A] hover:border-[#E5EAE6] hover:text-[#171918]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button className="p-2 text-[#66706A] hover:text-[#171918] transition-colors relative">
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              <Bell className="h-5 w-5" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                aria-label="User menu"
              >
                {initials ? (
                  <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {initials}
                  </div>
                ) : (
                  <div className="p-1 text-[#66706A] hover:text-[#171918]">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-1.5 ring-1 ring-black ring-opacity-5 z-50 border border-[#E5EAE6] animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#E5EAE6]">
                    <p className="text-sm font-semibold text-[#171918] truncate">
                      {profile?.full_name || "Citizen"}
                    </p>
                    <p className="text-xs text-[#66706A] truncate">
                      {profile?.email || "citizen@cvq.org"}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-[#4A554F] hover:bg-gray-50 hover:text-[#171918]"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#66706A] hover:text-[#171918] hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden border-t border-[#E5EAE6] bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname === link.href
                    ? "bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]"
                    : "border-transparent text-[#66706A] hover:bg-gray-50 hover:border-gray-300 hover:text-[#171918]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-4 border-t border-[#E5EAE6]">
            <div className="flex items-center px-4 space-x-3">
              {initials ? (
                <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {initials}
                </div>
              ) : (
                <div className="p-1 text-[#66706A]">
                  <User className="h-5 w-5" />
                </div>
              )}
              <div className="truncate">
                <p className="text-sm font-semibold text-[#171918] truncate">
                  {profile?.full_name || "Citizen"}
                </p>
                <p className="text-xs text-[#66706A] truncate">
                  {profile?.email || "citizen@cvq.org"}
                </p>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/dashboard/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-[#4A554F] hover:text-[#171918] hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Your Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
