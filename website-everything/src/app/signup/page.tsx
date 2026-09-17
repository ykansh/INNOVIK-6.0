"use client";

import AuthLayout from "@/components/AuthLayout";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpUser, UserRole } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { data, error } = await signUpUser({
        email,
        password,
        fullName,
        role,
        badgeId: role !== "citizen" ? badgeId : undefined,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      setSuccessMsg("Account successfully created! Redirecting...");
      setTimeout(() => {
        if (role === "citizen") {
          router.push("/dashboard");
        } else {
          router.push("/officer/dashboard");
        }
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join CVQ" subtitle="Turn civic problems into visible action">
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

      {successMsg && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
          {successMsg}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {role !== "citizen" && (
          <div>
            <label htmlFor="badgeId" className="block text-sm font-medium leading-6 text-[#171918]">
              Department Badge / ID
            </label>
            <div className="mt-2">
              <input
                id="badgeId"
                name="badgeId"
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                required
                placeholder="e.g. DEPT-OFF-409"
                className="block w-full rounded-md border-0 py-2.5 px-3 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm sm:leading-6 bg-[#F7FAF8]"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-[#171918]">
            Full Name
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="e.g. John Doe"
              className="block w-full rounded-md border-0 py-2.5 px-3 text-[#171918] shadow-sm ring-1 ring-inset ring-[#E5EAE6] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#16A34A] sm:text-sm sm:leading-6 bg-[#F7FAF8]"
            />
          </div>
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-[#171918]">
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              placeholder="••••••••••••"
              minLength={6}
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
            {loading ? "Creating Account..." : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-[#66706A]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold leading-6 text-[#16A34A] hover:text-[#16A34A]/80">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
