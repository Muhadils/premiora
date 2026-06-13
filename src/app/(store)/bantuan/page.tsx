"use client";

import { useState } from "react";
import { submitComplaint } from "@/lib/actions/complaint.actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, MessageSquareWarning } from "lucide-react";

export default function BantuanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitComplaint(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="container-custom px-4 sm:px-6 pt-24 pb-12 sm:pt-32 sm:pb-20 flex justify-center items-start min-h-screen">
      <div className="w-[90%] sm:w-full max-w-xl relative mt-4 sm:mt-0">
        {/* Glow effect behind the form */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-primary-500 rounded-3xl blur opacity-20"></div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl sm:rounded-3xl p-5 sm:p-10 relative">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary-50 mb-3 sm:mb-4">
              <MessageSquareWarning className="h-5 w-5 sm:h-8 sm:w-8 text-primary-600" />
            </div>
            <h1 className="text-lg sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Pusat Bantuan & Saran</h1>
            <p className="text-[11px] sm:text-base text-slate-500">
              Punya kendala dengan pesanan Anda? Atau ingin memberikan masukan tentang website kami? Ceritakan di bawah ini, tim kami akan segera memprosesnya.
            </p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 sm:p-8 text-center">
              <CheckCircle2 className="h-10 w-10 sm:h-16 sm:w-16 text-emerald-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-2xl font-bold text-slate-900 mb-2">Laporan Diterima!</h3>
              <p className="text-[11px] sm:text-base text-slate-600 mb-6">
                Terima kasih, keluhan Anda sudah kami catat. Tim kami sedang meninjau dan akan segera menghubungi Anda melalui WhatsApp yang terdaftar.
              </p>
              <Button onClick={() => setSuccess(false)} variant="outline" size="sm" className="w-full sm:w-auto h-9 sm:h-auto text-xs sm:text-sm">
                Kirim Laporan Lain
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] sm:text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="customer_name" className="text-[10px] sm:text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-sm"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="whatsapp" className="text-[10px] sm:text-sm font-medium text-slate-700">No. WhatsApp Aktif</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-sm"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="category" className="text-[10px] sm:text-sm font-medium text-slate-700">Kategori Kendala</label>
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue=""
                    className="w-full bg-white border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-base text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-sm"
                  >
                    <option value="" disabled>Pilih Kategori...</option>
                    <option value="Gagal Login">Gagal Login / Password Salah</option>
                    <option value="Screenlimit">Terkena Screenlimit / Device Penuh</option>
                    <option value="Pesanan Belum Masuk">Pesanan Belum Masuk</option>
                    <option value="Akun Ke-Reset">Akun Kembali ke Free / Reset</option>
                    <option value="Saran & Masukan">💡 Saran & Masukan Website</option>
                    <option value="Lainnya">Kendala Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="invoice_id" className="text-[10px] sm:text-sm font-medium text-slate-700">Nomor Invoice <span className="text-slate-400 text-[9px] sm:text-xs">(Opsional)</span></label>
                  <input
                    type="text"
                    id="invoice_id"
                    name="invoice_id"
                    className="w-full bg-white border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-sm"
                    placeholder="Contoh: INV-..."
                  />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="description" className="text-[10px] sm:text-sm font-medium text-slate-700">Ceritakan Detail Kendala atau Saran Anda</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none shadow-sm"
                  placeholder="Jelaskan detail masalahnya..."
                ></textarea>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 sm:h-12 text-[11px] sm:text-base font-semibold bg-primary-600 hover:bg-primary-500 shadow-sm"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
