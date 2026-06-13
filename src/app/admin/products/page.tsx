import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils/format";
import { PremkuService } from "@/lib/supplier/premku.service";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { AddProductModal } from "@/components/admin/add-product-modal";
import { EditProductModal } from "@/components/admin/edit-product-modal";
import { ProductSearch } from "@/components/admin/product-search";
import { Pagination } from "@/components/admin/pagination";

export const metadata = {
  title: "Kelola Produk | Admin Premiora",
};

export default async function AdminProductsPage(props: {
  searchParams?: Promise<{ q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const supabase = await createClient();

  // 1. Fetch Local Products with pagination and search
  let query = supabase
    .from("products")
    .select("*, category:categories(*)", { count: 'exact' });

  if (q) {
    query = query.ilike('name', `%${q}%`);
  }

  const { data: localProducts, count, error: dbError } = await query
    .range(from, to)
    .order("created_at", { ascending: false });

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  // 1.5 Fetch Categories for Stats
  const { data: categoryStats } = await supabase
    .from("categories")
    .select("id, name, icon, products(count)")
    .order("sort_order", { ascending: true });

  // 2. Fetch Supplier Products (Live)
  let supplierProducts: any[] = [];
  let supplierError = null;

  try {
    const res = await PremkuService.getProducts();
    if (res.success && res.products) {
      supplierProducts = res.products;
    } else {
      supplierError = res.message || "Gagal memuat katalog dari Premku";
    }
  } catch (error: any) {
    supplierError = error.message;
  }

  // 3. Gabungkan Data (Pengecekan Harga & Stok)
  const { data: allLocalCodes } = await supabase.from('products').select('supplier_product_code').not('supplier_product_code', 'is', null);
  const mappedCodes = new Set(allLocalCodes?.map(p => p.supplier_product_code) || []);
  const unsyncedProducts = supplierProducts.filter(sp => !mappedCodes.has(String(sp.id)));

  const mappedProducts = localProducts?.map(localProd => {
    // Cari produk supplier yang codenya sama dengan supplier_product_code milik local
    const supProd = supplierProducts.find(sp => String(sp.id) === localProd.supplier_product_code);
    
    return {
      ...localProd,
      supplierData: supProd || null,
      isSynced: !!supProd,
      // Cek apakah harga jual kita masih di atas harga modal supplier
      isPriceSafe: supProd ? Number(localProd.selling_price || localProd.price) >= Number(supProd.price) : true,
      // Cek stok supplier (asumsi stock 0 = habis)
      isStockSafe: supProd ? Number(supProd.stock) > 0 : false,
    };
  }) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Manajemen Produk</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
            Status sinkronisasi harga & stok dengan katalog Premku
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <ProductSearch />
          <AddProductModal />
        </div>
      </div>

      {/* Category Summary Stats */}
      {categoryStats && categoryStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm flex items-center gap-3 sm:gap-4 text-white hover:-translate-y-0.5 transition-transform">
             <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/10 flex items-center justify-center text-base sm:text-lg shrink-0">
                📦
             </div>
             <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-300 truncate">Semua Produk</p>
                <p className="text-lg sm:text-2xl font-bold">{count || 0}</p>
             </div>
          </div>
          {categoryStats.map(cat => {
            const count = Array.isArray(cat.products) ? cat.products[0]?.count || 0 : 0;
            return (
              <div key={cat.id} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm flex items-center gap-3 sm:gap-4 group hover:border-blue-300 hover:-translate-y-0.5 transition-all">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg sm:text-xl shadow-inner group-hover:bg-blue-100 transition-colors shrink-0">
                  {cat.icon || "📂"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">{cat.name}</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {supplierError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">Gagal terhubung ke API Premku: {supplierError}. Validasi stok tidak tersedia.</p>
        </div>
      )}

      {dbError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">Database Error: {dbError.message}</p>
        </div>
      )}

      {/* Widget Produk Baru dari API */}
      {!supplierError && unsyncedProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">Produk Baru Ditemukan!</h3>
              <p className="text-sm text-amber-700">Terdapat {unsyncedProducts.length} produk di API Supplier yang belum ada di toko Anda.</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {unsyncedProducts.map(sp => (
              <div key={sp.id} className="min-w-[250px] bg-white border border-amber-100 rounded-lg p-3 shrink-0 snap-start shadow-sm">
                <p className="font-semibold text-slate-800 text-sm line-clamp-1" title={sp.name}>{sp.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-slate-500">Harga Modal:</span>
                  <span className="text-sm font-bold text-slate-900">{formatRupiah(sp.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] sm:text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Produk (Lokal)</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Harga Jual</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Harga Modal (Premku)</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Profit</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Stok Supplier</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Status Sync</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mappedProducts.length > 0 ? (
                mappedProducts.map((prod) => {
                  const modalPrice = prod.supplierData ? Number(prod.supplierData.price) : 0;
                  const sellPrice = Number(prod.selling_price || prod.supplier_price || prod.price || 0);
                  const profit = prod.supplierData ? sellPrice - modalPrice : 0;
                  
                  // Handle both image_url and thumbnail_url for compatibility
                  const imageUrl = prod.thumbnail_url || prod.image_url;
                  
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 relative rounded overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {imageUrl ? (
                              <Image src={imageUrl} alt={prod.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] sm:text-xs">No Img</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 text-xs sm:text-sm line-clamp-1">{prod.name}</div>
                            <div className="text-[10px] sm:text-xs text-slate-500">ID: {prod.supplier_product_code || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                        {formatRupiah(sellPrice)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap">
                        {prod.supplierData ? formatRupiah(modalPrice) : "-"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">
                        {prod.supplierData ? (
                          <span className={`font-medium ${profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {profit > 0 ? "+" : ""}{formatRupiah(profit)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {prod.supplierData ? (
                          <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium ${prod.isStockSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {prod.isStockSafe ? `Tersedia (${prod.supplierData.stock})` : "Habis / Kosong"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {prod.isSynced ? (
                          <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-600 text-[10px] sm:text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            Tersinkron
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 sm:gap-1.5 text-slate-400 text-[10px] sm:text-xs font-medium">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            Tidak Ada ID
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                        <EditProductModal product={prod} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-slate-100 p-3 rounded-full mb-3">
                        <AlertCircle className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900">Belum ada produk</p>
                      <p className="text-sm mt-1">Klik tombol "Tambah Produk" di sudut kanan atas untuk mulai berjualan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  );
}
