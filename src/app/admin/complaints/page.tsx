import { createClient } from "@/lib/supabase/server";
import { MessageSquareWarning, Search, AlertCircle, MessageCircle } from "lucide-react";
import { ResolveComplaintButton } from "@/components/admin/resolve-complaint-button";

export const metadata = {
  title: "Keluhan Pelanggan | Admin Premiora",
};

export default async function AdminComplaintsPage() {
  const supabase = await createClient();

  const { data: complaints, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  // Calculate stats
  const totalComplaints = complaints?.length || 0;
  const pendingComplaints = complaints?.filter(c => c.status === "pending").length || 0;
  
  // Find top categories
  const categoryCounts: Record<string, number> = {};
  complaints?.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Keluhan Pelanggan</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Kelola dan pantau kendala yang dialami oleh pembeli.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <MessageSquareWarning className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">Total Keluhan</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{totalComplaints}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">Menunggu Tindakan</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{pendingComplaints}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3 border-b border-slate-100 pb-2">Kendala Terbanyak</h3>
          <div className="space-y-2">
            {topCategories.length > 0 ? topCategories.map(([cat, count], idx) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 truncate max-w-[150px]" title={cat}>
                  {idx + 1}. {cat}
                </span>
                <span className="font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic">Belum ada data</p>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">Daftar Keluhan</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Kategori & Pesan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {complaints?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada keluhan pelanggan saat ini.
                  </td>
                </tr>
              ) : (
                complaints?.map((complaint) => (
                  <tr key={complaint.id} className={`hover:bg-slate-50 transition-colors ${complaint.status === "resolved" ? "opacity-70 bg-slate-50/50" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">
                        {new Date(complaint.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {new Date(complaint.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{complaint.customer_name}</div>
                      <div className="text-slate-500 text-xs mt-1">{complaint.whatsapp}</div>
                      {complaint.invoice_id && (
                        <div className="text-xs bg-slate-100 text-slate-600 inline-block px-2 py-0.5 rounded mt-1">
                          {complaint.invoice_id}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 min-w-[300px]">
                      <span className="inline-block px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold mb-2">
                        {complaint.category}
                      </span>
                      <p className="text-slate-600 line-clamp-2" title={complaint.description}>
                        "{complaint.description}"
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {complaint.status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Selesai
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${complaint.whatsapp.replace(/^0/, "62")}?text=Halo Kak ${complaint.customer_name}, kami dari tim Premiora terkait keluhan kakak: "${complaint.description}"...`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                          title="Balas via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                        {complaint.status === "pending" && (
                          <ResolveComplaintButton id={complaint.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
