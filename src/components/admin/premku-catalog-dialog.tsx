"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, DownloadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PremkuProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  stock: number;
  image: string;
}

interface Props {
  onSelectProduct: (product: PremkuProduct) => void;
  onClose: () => void;
}

export function PremkuCatalogDialog({ onSelectProduct, onClose }: Props) {
  const [products, setProducts] = useState<PremkuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/premku-codes");
        const data = await res.json();
        
        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          throw new Error(data.message || "Gagal mengambil data dari Premku");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) && 
    p.status === "available"
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
              <DownloadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Katalog Premku (Real-time)</h2>
              <p className="text-xs text-slate-500">Pilih produk untuk diisi otomatis ke form</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari nama produk..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary-500" />
              <p>Menghubungkan ke API Premku...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              Tidak ada produk yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredProducts.map((p) => (
                <div 
                  key={p.id} 
                  className="border border-slate-200 rounded-xl p-3 flex gap-3 items-center hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors group"
                  onClick={() => onSelectProduct(p)}
                >
                  <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                    {p.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate" title={p.name}>{p.name}</h4>
                    <p className="text-xs text-slate-500">Modal: Rp {p.price.toLocaleString("id-ID")}</p>
                  </div>
                  <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Pilih
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
