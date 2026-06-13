import { createClient } from "@/lib/supabase/server";
import { PremkuService } from "@/lib/supplier/premku.service";
import { formatRupiah } from "@/lib/utils/format";
import { CreditCard, DollarSign, Package, ShoppingCart, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Premiora",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch Supabase Stats
  // Ambil semua order yang success (completed) untuk total pendapatan
  const { data: completedOrders } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "completed");

  const totalRevenue = completedOrders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;
  
  // Ambil count order sukses (completed)
  const { count: completedOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  // Ambil count order pending/processing
  const { count: pendingOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .in("status", ["pending_payment", "processing"]);

  // Ambil 5 Pesanan Terbaru
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, invoice_id, total, status, created_at, customer:customers(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  // 2. Fetch Supplier (Premku) Balance
  let premkuData = null;
  let premkuError = null;
  
  try {
    const res = await PremkuService.checkBalance();
    if (res.success && res.data) {
      premkuData = res.data;
    } else {
      premkuError = res.message || "Gagal mengambil saldo dari supplier.";
    }
  } catch (error: any) {
    premkuError = error.message;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Pendapatan */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 group hover:-translate-y-1 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Total Pendapatan</p>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900">{formatRupiah(totalRevenue)}</h3>
          </div>
        </div>

        {/* Pesanan Sukses */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 group hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all duration-300">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Pesanan Sukses</p>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900">{completedOrdersCount || 0}</h3>
          </div>
        </div>

        {/* Butuh Diproses */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 group hover:-translate-y-1 hover:shadow-md hover:border-amber-200 transition-all duration-300">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 relative">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 relative z-10" />
            {(pendingOrdersCount || 0) > 0 && (
               <span className="absolute top-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500 border-2 border-white animate-ping"></span>
            )}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Menunggu Diproses</p>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900">{pendingOrdersCount || 0}</h3>
          </div>
        </div>

        {/* Saldo Premku */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4 text-white group hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-900/20 transition-all duration-300 relative overflow-hidden">
          {/* Subtle gradient shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]"></div>
          
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-colors duration-300 relative z-10">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary-300 group-hover:text-primary-200" />
          </div>
          <div className="flex-1 min-w-0 relative z-10">
            <p className="text-xs sm:text-sm font-medium text-slate-300 truncate">Saldo Premku (Supplier)</p>
            {premkuError ? (
              <div className="flex items-center gap-1 text-red-300 mt-0.5 sm:mt-1">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs">Error API</span>
              </div>
            ) : (
              <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-primary-100 transition-colors">
                {premkuData ? formatRupiah(premkuData.saldo) : "Loading..."}
              </h3>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
        
        {/* Supplier Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
            Status Koneksi Supplier (Premku)
          </h3>
          
          {premkuError ? (
             <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
               <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
               <p className="text-sm">Gagal terhubung ke API Premku: {premkuError}. Pastikan PREMKU_API_KEY di .env.local sudah benar.</p>
             </div>
          ) : premkuData ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500">Username Akun</span>
                <span className="font-semibold text-slate-900">{premkuData.username}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500">WhatsApp</span>
                <span className="font-semibold text-slate-900">{premkuData.whatsapp}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Terhubung & Aktif
                </span>
              </div>
            </div>
          ) : (
             <div className="p-4 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 text-center text-sm">
               Memuat data supplier...
             </div>
          )}
        </div>

        {/* Pesanan Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-hidden">
           <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-slate-100 pb-3 sm:pb-4">
             <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
               <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
               Pesanan Terbaru
             </h3>
             <Link href="/admin/orders" className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Lihat Semua <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
             </Link>
           </div>
           <div className="space-y-3">
             {recentOrders && recentOrders.length > 0 ? recentOrders.map((order: any) => (
                <div key={order.id} className="flex justify-between items-center group/item hover:bg-slate-50 p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-xl transition-colors">
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-slate-800 text-xs sm:text-sm truncate group-hover/item:text-blue-600 transition-colors">
                      {order.customer?.name || "Pelanggan"} <span className="text-slate-400 font-normal">({order.invoice_id})</span>
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1 shrink-0">
                     <p className="font-bold text-slate-900 text-xs sm:text-sm">{formatRupiah(order.total)}</p>
                     <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                     }`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                     </span>
                  </div>
                </div>
             )) : (
                <p className="text-sm text-slate-500 text-center py-4">Belum ada pesanan.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
