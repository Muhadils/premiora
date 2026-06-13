"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, UploadCloud, CheckCircle2, CloudDownload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/utils/constants";
import { createProduct, uploadImage } from "@/lib/actions/product.actions";
import { ImageCropper } from "./image-cropper";
import { PremkuCatalogDialog, PremkuProduct } from "./premku-catalog-dialog";

export function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [showCatalog, setShowCatalog] = useState(false);
  
  // Controlled form state
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    supplier_product_code: "",
    image_url: "",
    description: "",
    terms_text: ""
  });

  const resetForm = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setForm({
      name: "",
      category: "",
      price: "",
      supplier_product_code: "",
      image_url: "",
      description: "",
      terms_text: ""
    });
    setImageSrc(null);
    setCroppedBlob(null);
    setErrorMsg("");
  };

  // Crop state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob);
    setImageSrc(null);
    // Kosongkan URL text jika user memilih upload gambar
    setForm(prev => ({ ...prev, image_url: "" }));
  };

  const handleSelectPremkuProduct = (p: PremkuProduct) => {
    // Coba tebak kategori dari nama produk
    const nameLower = p.name.toLowerCase();
    let guessedCategory = "lainnya";
    if (nameLower.includes("canva")) guessedCategory = "canva";
    else if (nameLower.includes("spotify")) guessedCategory = "spotify";
    else if (nameLower.includes("netflix")) guessedCategory = "netflix";
    else if (nameLower.includes("youtube")) guessedCategory = "youtube";
    else if (nameLower.includes("chatgpt")) guessedCategory = "chatgpt";
    else if (nameLower.includes("prime") || nameLower.includes("vidio") || nameLower.includes("viu") || nameLower.includes("disney") || nameLower.includes("iqiyi") || nameLower.includes("wetv")) guessedCategory = "streaming";

    setForm({
      name: p.name,
      category: guessedCategory, 
      price: (p.price + 5000).toString(), // Default margin + Rp 5000
      supplier_product_code: p.id.toString(),
      image_url: p.image || "",
      description: p.description || "",
      terms_text: ""
    });
    setCroppedBlob(null); // Batalkan crop manual jika narik dari API
    setShowCatalog(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("supplier_product_code", form.supplier_product_code);
    
    const fullDescription = form.terms_text 
      ? `${form.description}\n||SNK_TEXT:${form.terms_text}`
      : form.description;
    formData.append("description", fullDescription);

    startTransition(async () => {
      try {
        let imageUrl = form.image_url;

        // Jika ada file gambar yang di-crop, upload dulu
        if (croppedBlob) {
          const fileData = new FormData();
          fileData.append("file", croppedBlob, `product-${Date.now()}.jpg`);
          const uploadRes = await uploadImage(fileData);
          if (uploadRes.success) {
            imageUrl = uploadRes.url;
          } else {
            throw new Error(uploadRes.message);
          }
        }

        formData.append("image_url", imageUrl);

        // Simpan produk
        const res = await createProduct(formData);
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => {
            resetForm();
          }, 2000);
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Gagal menambahkan produk");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Tambah Produk
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-12 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Berhasil!</h3>
                  <p className="text-slate-500">Produk telah berhasil ditambahkan.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Tambah Produk Baru</h2>
                    <button 
                      onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100"
                onClick={() => setShowCatalog(true)}
              >
                <CloudDownload className="h-4 w-4" />
                Tarik Data dari Katalog Premku
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Atau Isi Manual</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {errorMsg}
                </div>
              )}

              {/* Upload & Crop UI */}
              <div className="space-y-2 border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center relative overflow-hidden">
                {croppedBlob ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(croppedBlob)} alt="Preview" className="object-cover w-full h-full" />
                      <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setCroppedBlob(null)} className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                      Hapus Gambar
                    </Button>
                  </div>
                ) : form.image_url ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image_url} alt="Preview" className="object-cover w-full h-full" />
                      <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setForm(prev => ({ ...prev, image_url: "" }))} className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                      Hapus Link Gambar
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Unggah Gambar Produk (1:1)</p>
                    <p className="text-xs text-slate-500 mb-3">Pilih file gambar dari komputer Anda untuk dipotong.</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange} 
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      Pilih Gambar
                    </Button>
                  </>
                )}
              </div>

              {/* Atau URL Teks */}
              {!croppedBlob && !form.image_url && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 text-center">--- Atau gunakan Link URL ---</label>
                  <Input 
                    name="image_url" 
                    placeholder="Contoh: https://example.com/image.png" 
                    className="text-sm"
                    value={form.image_url}
                    onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk *</label>
                <Input 
                  name="name" 
                  required 
                  placeholder="Contoh: Canva Pro 1 Bulan" 
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
                  <select 
                    name="category" 
                    required 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Pilih Kategori</option>
                    {CATEGORIES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual (Rp) *</label>
                  <Input 
                    name="price" 
                    type="number" 
                    required 
                    placeholder="Contoh: 15000" 
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kode Produk Supplier (Premku)</label>
                <Input 
                  name="supplier_product_code" 
                  placeholder="Contoh: 104" 
                  value={form.supplier_product_code}
                  onChange={(e) => setForm(prev => ({ ...prev, supplier_product_code: e.target.value }))}
                />
                <p className="text-xs text-slate-500 mt-1">Kosongkan jika produk manual tanpa supplier.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  name="description" 
                  rows={3}
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  placeholder="Deskripsi produk Anda..."
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teks Syarat & Ketentuan Khusus (Opsional)</label>
                <textarea 
                  name="terms_text" 
                  rows={4}
                  placeholder="Contoh: 
- Garansi pada saat pertama kali login
- Pakai aplikasi Capcut versi terbaru..." 
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={form.terms_text}
                  onChange={(e) => setForm(prev => ({ ...prev, terms_text: e.target.value }))}
                ></textarea>
                <p className="text-xs text-slate-500 mt-1">Akan memunculkan teks "Wajib baca Syarat & Ketentuan" yang bila diklik akan membuka Popup berisi teks ini.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={resetForm} disabled={isPending}>Batal</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan Produk"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
)}

      {/* Cropper Modal (muncul di atas modal add product) */}
      {imageSrc && (
        <ImageCropper 
          imageSrc={imageSrc} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setImageSrc(null)} 
        />
      )}

      {/* Katalog Premku Dialog */}
      {showCatalog && (
        <PremkuCatalogDialog 
          onClose={() => setShowCatalog(false)}
          onSelectProduct={handleSelectPremkuProduct}
        />
      )}
    </>
  );
}
