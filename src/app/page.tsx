import CivicScroll from "@/components/CivicScroll";
import { ArrowRight, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-white/20">
      <CivicScroll />
      
      {/* Post-scroll section: Login/Signup and Footer */}
      <section className="relative w-full border-t border-white/10 py-32 px-6 md:px-16 lg:px-24 bg-[#050505] z-10 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white/90 mb-6">
          Ready to make an impact?
        </h2>
        <p className="text-white/60 max-w-xl mx-auto mb-12 text-lg">
          Join CVQ to report issues in your neighborhood, track the progress of municipal repairs, and see real change happen.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/signup" className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors w-full sm:w-auto">
            <UserPlus className="w-5 h-5" />
            Sign Up Now
          </Link>
          <Link href="/login" className="flex items-center justify-center gap-2 bg-[#050505] text-white border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto">
            <LogIn className="w-5 h-5" />
            Log In
          </Link>
        </div>
      </section>

      <footer className="w-full border-t border-white/5 py-12 px-6 md:px-16 lg:px-24 bg-[#050505] flex flex-col md:flex-row items-center justify-between gap-6 text-white/30 text-sm">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span className="text-2xl font-bold text-white/50 tracking-tighter">CVQ</span>
          <span>© {new Date().getFullYear()} Civic Voice / Civic Quality.</span>
        </div>
        
        <div className="flex gap-6 font-medium">
          <Link href="#" className="hover:text-white/60 transition-colors">About</Link>
          <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
