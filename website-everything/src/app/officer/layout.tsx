import OfficerSidebar from "@/components/OfficerSidebar";

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7FAF8] font-sans selection:bg-[#16A34A]/20">
      <OfficerSidebar />
      <div className="lg:pl-72 pt-16 lg:pt-0">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
