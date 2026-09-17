"use client";

import AuthLayout from "@/components/AuthLayout";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInUser, UserRole } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data, error } = await signInUser(email, password, role);

      if (error) {
        setErrorMsg(error.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      if (role === "citizen") {
        router.push("/dashboard");
      } else {
        router.push("/officer/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back to CVQ" subtitle="Sign in to your account to continue">
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        {(["citizen", "officer", "supervisor"] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 capitalize py-2 text-sm font-medium rounded-md transition-all ${
              role === r
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-[#171918]">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="block w-full rounded-md border-0 py-2.5 px-3 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm sm:leading-6 bg-[#F7FAF8]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-[#171918]">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-[#16A34A] hover:text-[#16A34A]/80">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              className="block w-full rounded-md border-0 py-2.5 px-3 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm sm:leading-6 bg-[#F7FAF8]"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded-md bg-[#16A34A] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#16A34A]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-[#66706A]">
        Not a member?{" "}
        <Link href="/signup" className="font-semibold leading-6 text-[#16A34A] hover:text-[#16A34A]/80">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
