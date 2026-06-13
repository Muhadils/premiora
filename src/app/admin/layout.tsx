import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("complaints")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
    
  const pendingComplaintsCount = count || 0;

  return (
    <>
      {/* Modern Dotted Background with Subtle Glows */}
      <div className="fixed inset-0 -z-50 bg-slate-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-dots-slate"></div>
        <div className="absolute top-0 right-0 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-primary-200/20 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-200/20 rounded-full blur-[80px] sm:blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="min-h-screen flex relative z-0">
        {/* Sidebar Desktop */}
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar pendingComplaintsCount={pendingComplaintsCount} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar pendingComplaintsCount={pendingComplaintsCount} />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}
