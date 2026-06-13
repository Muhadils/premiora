"use client";

import { useState } from "react";
import { CheckCircle, Loader2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveOrderManually } from "@/lib/actions/order.actions";

interface Props {
  orderId: string;
}

export function ApproveOrderButton({ orderId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleApprove = async () => {
    setShowModal(false);
    setIsLoading(true);
    const result = await approveOrderManually(orderId);
    
    if (!result.success) {
      alert("Gagal memproses pesanan: " + result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 w-full justify-start mt-2"
        onClick={() => setShowModal(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        {isLoading ? "Memproses..." : "Tandai Lunas"}
      </Button>

      {/* Premium Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 text-amber-600">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Konfirmasi Manual</h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="text-slate-600 space-y-3 mb-8">
                <p>
                  Apakah Anda yakin ingin menandai pesanan ini sebagai <strong>Lunas</strong> secara manual?
                </p>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-sm text-blue-800">
                  <strong>Peringatan:</strong> Sistem akan otomatis menembak API Premku untuk membelikan produk ini (jika fitur auto-process aktif).
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)} className="rounded-xl">
                  Batal
                </Button>
                <Button onClick={handleApprove} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                  Ya, Tandai Lunas
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
