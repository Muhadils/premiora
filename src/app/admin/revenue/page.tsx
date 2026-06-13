import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils/format";
import { DollarSign, TrendingUp, Package, Calendar } from "lucide-react";
import { RevenueFilter } from "@/components/admin/revenue-filter";
import { ExportRevenueButton } from "@/components/admin/export-revenue-button";

export const metadata = {
  title: "Statistik Pendapatan | Admin Premiora",
};

export default async function AdminRevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; month?: string; year?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from("orders")
    .select(`
      id, total, created_at,
      order_items (
        id, price, quantity, subtotal,
        products ( supplier_price )
      )
    `)
    .eq("status", "completed");

  // Filter Logic
  let filterLabel = "Semua Waktu";
  if (params.date) {
    const startDate = new Date(params.date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(params.date);
    endDate.setHours(23, 59, 59, 999);
    query = query.gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString());
    filterLabel = `Tanggal: ${new Date(params.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}`;
  } else if (params.month) {
    const startDate = new Date(`${params.month}-01`);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // last day
    endDate.setHours(23, 59, 59, 999);
    query = query.gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString());
    filterLabel = `Bulan: ${startDate.toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}`;
  } else if (params.year) {
    const startDate = new Date(`${params.year}-01-01`);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(`${params.year}-12-31`);
    endDate.setHours(23, 59, 59, 999);
    query = query.gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString());
    filterLabel = `Tahun: ${params.year}`;
  }

  const { data: orders } = await query.order("created_at", { ascending: false });

  let totalGross = 0;
  let totalSupplierCost = 0;

  // Struktur untuk menyimpan data bulanan
  // Format: "YYYY-MM" -> { gross: number, profit: number }
  const monthlyData: Record<string, { gross: number; profit: number; label: string }> = {};
  
  // Format bulan lokal untuk label (misal: "Jan 2026")
  const formatMonth = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(d);
  };

  orders?.forEach((order) => {
    totalGross += Number(order.total);

    let orderSupplierCost = 0;
    order.order_items?.forEach((item: any) => {
      // Jika product masih ada dan memiliki supplier_price, gunakan itu.
      // Jika tidak, kita gunakan asumsi profit margin rata-rata (misal 10%) untuk fallback agar data tidak nol.
      const supplierPrice = item.products?.supplier_price || (item.price * 0.9);
      orderSupplierCost += (supplierPrice * item.quantity);
    });
    totalSupplierCost += orderSupplierCost;

    const monthKey = order.created_at.substring(0, 7); // "YYYY-MM"
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { gross: 0, profit: 0, label: formatMonth(order.created_at) };
    }
    
    monthlyData[monthKey].gross += Number(order.total);
    monthlyData[monthKey].profit += (Number(order.total) - orderSupplierCost);
  });

  const totalNetProfit = totalGross - totalSupplierCost;

  // Konversi monthlyData object menjadi array dan urutkan berdasarkan waktu
  const chartData = Object.entries(monthlyData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .slice(-6); // Ambil 6 bulan terakhir saja

  // Mencari nilai tertinggi untuk skala grafik (max height)
  const maxGross = Math.max(...chartData.map(d => d[1].gross), 1000); // minimal skala 1000 agar tidak error pembagian 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Statistik Pendapatan</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
            Laporan omzet dan keuntungan bersih toko <span className="font-semibold text-slate-700">({filterLabel})</span>
          </p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <ExportRevenueButton orders={orders} />
          <RevenueFilter />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm text-white border border-slate-800">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-300 font-medium text-xs sm:text-base">Total Omzet (Kotor)</p>
              <h3 className="text-xl sm:text-3xl font-bold">{formatRupiah(totalGross)}</h3>
            </div>
          </div>
          <div className="text-[10px] sm:text-sm text-slate-400 border-t border-white/10 pt-3 sm:pt-4 flex items-center gap-1.5 sm:gap-2">
             <Calendar className="h-4 w-4" />
             Total keseluruhan pemasukan kotor
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-4 sm:p-6 rounded-2xl shadow-sm text-white border border-emerald-600">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <p className="text-emerald-100 font-medium text-xs sm:text-base">Total Keuntungan (Bersih)</p>
              <h3 className="text-xl sm:text-3xl font-bold">{formatRupiah(totalNetProfit)}</h3>
            </div>
          </div>
          <div className="text-[10px] sm:text-sm text-emerald-100 border-t border-white/20 pt-3 sm:pt-4 flex items-center gap-1.5 sm:gap-2">
             <Package className="h-4 w-4" />
             Telah dikurangi dengan harga modal supplier
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Grafik CSS */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            Tren Pendapatan (6 Bulan Terakhir)
          </h3>
          
          <div className="h-64 flex items-end gap-2 sm:gap-4 md:gap-6 mt-4">
            {chartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                Belum ada data pendapatan.
              </div>
            ) : (
              chartData.map(([key, data]) => {
                const heightPercentage = Math.max((data.gross / maxGross) * 100, 2); // minimal 2% tinggi
                const profitPercentage = Math.max((data.profit / data.gross) * 100, 0); 
                
                return (
                  <div key={key} className="flex-1 flex flex-col items-center justify-end group">
                    {/* Tooltip Hover (Sederhana CSS) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-center bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg relative bottom-0 pointer-events-none z-10 whitespace-nowrap">
                       <p className="font-semibold">{data.label}</p>
                       <p className="text-emerald-300">Gross: {formatRupiah(data.gross)}</p>
                       <p className="text-blue-300">Net: {formatRupiah(data.profit)}</p>
                    </div>

                    {/* Bar Induk (Gross) */}
                    <div 
                      className="w-full max-w-[60px] bg-emerald-100 rounded-t-lg relative flex items-end overflow-hidden group-hover:bg-emerald-200 transition-colors"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {/* Bar Anak (Profit) - didalam Gross Bar */}
                      <div 
                        className="w-full bg-emerald-500 transition-all group-hover:bg-emerald-600"
                        style={{ height: `${profitPercentage}%` }}
                        title="Keuntungan Bersih"
                      ></div>
                    </div>
                    {/* Label Bulan */}
                    <span className="text-[10px] sm:text-xs font-medium text-slate-500 mt-2 sm:mt-3 truncate w-full text-center">
                      {data.label.replace(' 202', ' ')} 
                    </span>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="flex items-center gap-6 mt-8 pt-4 border-t border-slate-100 justify-center text-sm">
             <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 block"></span>
                <span className="text-slate-600">Omzet (Kotor)</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 block"></span>
                <span className="text-slate-600">Profit (Bersih)</span>
             </div>
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6 border-b border-slate-100 pb-3 sm:pb-4">
             Transaksi Terakhir
           </h3>
           <div className="space-y-4">
             {orders && orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {order.order_items?.[0]?.product_name || "Produk"}
                      {order.order_items && order.order_items.length > 1 && ` +${order.order_items.length - 1}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-emerald-600 text-sm">+{formatRupiah(order.total)}</p>
                  </div>
                </div>
             ))}
             {(!orders || orders.length === 0) && (
               <p className="text-sm text-slate-500 text-center py-4">Belum ada transaksi.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
