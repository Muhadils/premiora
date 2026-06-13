import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatDateTime } from "@/lib/utils/format";
import { orderStatuses } from "@/lib/utils/constants";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminOrderSearch } from "@/components/admin/admin-order-search";
import { ApproveOrderButton } from "@/components/admin/approve-order-button";

export const metadata = {
  title: "Kelola Pesanan | Admin Premiora",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const pageParam = resolvedParams?.page;
  const page = typeof pageParam === "string" ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const searchQuery = resolvedParams?.search;
  const search = typeof searchQuery === "string" ? searchQuery : "";
  const PAGE_SIZE = 10;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items (
        product_name,
        quantity,
        supplier_status,
        credentials
      )
    `, { count: "exact" });

  if (search) {
    query = query.or(`invoice_id.ilike.%${search}%,customer_data->>name.ilike.%${search}%,customer_data->>whatsapp.ilike.%${search}%`);
  }

  const { data: orders, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pesanan Pelanggan</h1>
        <AdminOrderSearch />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] sm:text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Invoice & Tanggal</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Pelanggan</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Produk</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Total</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Status Web</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Status Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders && orders.length > 0 ? (
                orders.map((order: any) => {
                  const statusDef = orderStatuses.find(s => s.id === order.status) || orderStatuses[0];
                  // Asumsikan kita ambil status supplier dari item pertama
                  const supplierStatus = order.order_items[0]?.supplier_status || "-";
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 align-top">
                        <div className="font-medium text-slate-900 mb-0.5 sm:mb-1 text-xs sm:text-sm whitespace-nowrap">{order.invoice_id}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">
                          {formatDateTime(new Date(order.created_at))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 align-top">
                        <div className="font-medium text-slate-900 text-xs sm:text-sm whitespace-nowrap">{order.customer_data?.name || "-"}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">{order.customer_data?.whatsapp || "-"}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">{order.customer_data?.email || ""}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 align-top min-w-[200px]">
                        <div className="space-y-1">
                          {order.order_items.map((item: any, idx: number) => (
                            <div key={idx} className="text-slate-700 text-xs sm:text-sm leading-snug">
                              {item.quantity}x {item.product_name}
                              {item.credentials && item.credentials.length > 0 && (
                                <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                  Akun Tersedia
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-900 text-xs sm:text-sm whitespace-nowrap align-top">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 align-top whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusDef.color} bg-white border`}>
                          {order.status === "pending_payment" || order.status === "processing" ? (
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status === "pending_payment" ? "bg-amber-400" : "bg-blue-400"}`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${order.status === "pending_payment" ? "bg-amber-500" : "bg-blue-500"}`}></span>
                            </span>
                          ) : (
                            <statusDef.icon className="h-3 w-3" />
                          )}
                          {statusDef.label}
                        </div>
                        {order.status === "pending_payment" && (
                          <ApproveOrderButton orderId={order.id} />
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 align-top whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                          ${supplierStatus === 'success' ? 'bg-emerald-100 text-emerald-800' : 
                            supplierStatus === 'pending' || supplierStatus === 'processing' ? 'bg-amber-100 text-amber-800' :
                            supplierStatus === 'failed' || supplierStatus === 'canceled' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-600'}
                        `}>
                          {(supplierStatus === 'pending' || supplierStatus === 'processing') && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                          )}
                          {supplierStatus}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
            <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
              Menampilkan <span className="font-medium text-slate-900">{from + 1}</span> - <span className="font-medium text-slate-900">{Math.min(to + 1, count || 0)}</span> dari <span className="font-medium text-slate-900">{count}</span> data
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link href={`/admin/orders?page=${page - 1}`}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Link>
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <Link href={`/admin/orders?page=${page + 1}`}>
                    Berikutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                ) : (
                  <>
                    Berikutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
