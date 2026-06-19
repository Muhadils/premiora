import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Pengembalian Dana (Refund) | Premiora",
  description: "Prosedur garansi dan pengembalian dana Premiora",
};

export default function RefundPage() {
  return (
    <div className="container-custom py-24 sm:py-32">
      <div className="max-w-3xl mx-auto prose prose-slate sm:prose-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Kebijakan Pengembalian Dana (Refund Policy)</h1>
        
        <p className="text-slate-500 mb-8">Pembaruan Terakhir: 19 Juni 2026</p>

        <section className="mb-8">
          <p className="text-slate-600 leading-relaxed mb-6">
            Kepuasan pelanggan adalah prioritas utama kami di Premiora. Mengingat sifat produk digital yang kami sediakan, kami memiliki aturan ketat mengenai garansi dan pengembalian dana demi menghindari penyalahgunaan.
          </p>
          
          <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Garansi Produk Digital</h2>
          <ul className="list-disc pl-5 text-slate-600 leading-relaxed space-y-2 mb-6">
            <li>Semua produk akun premium digital yang kami jual dilindungi oleh <strong>Garansi Sesuai Durasi</strong> yang tertera pada detail produk (misalnya: Garansi 1 Bulan).</li>
            <li>Jika akun bermasalah (terkena *screen limit*, salah *password*, atau kembali menjadi akun gratis) selama masa garansi, kami akan <strong>memperbaiki akun tersebut</strong> atau <strong>memberikan akun pengganti (replace)</strong> yang baru secara gratis.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Syarat Berlakunya Pengembalian Dana (Refund)</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Pengembalian dana ke rekening pembeli <strong>HANYA</strong> akan diproses dalam kondisi-kondisi berikut:
          </p>
          <ul className="list-disc pl-5 text-slate-600 leading-relaxed space-y-2 mb-6">
            <li>Pesanan gagal diproses karena stok habis atau masalah teknis dari sisi server kami, dan kami tidak dapat memenuhinya dalam kurun waktu 1x24 jam.</li>
            <li>Akun yang dibeli bermasalah dalam masa garansi, dan kami <strong>gagal memberikan akun pengganti</strong> dalam waktu maksimal 2x24 jam sejak komplain diajukan.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Kondisi Dimana Refund TIDAK Berlaku</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Kami <strong>tidak akan memproses</strong> permintaan *refund* jika terjadi hal-hal berikut:
          </p>
          <ul className="list-disc pl-5 text-slate-600 leading-relaxed space-y-2 mb-6">
            <li>Pembeli salah membeli produk (salah klik produk).</li>
            <li>Pembeli tiba-tiba berubah pikiran setelah kredensial akun / lisensi dikirimkan ke email atau WhatsApp.</li>
            <li>Pembeli melanggar aturan penggunaan (mengubah password, email, atau profile akun *Shared*). Jika ini terjadi, garansi langsung hangus.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Proses Pengajuan</h2>
          <p className="text-slate-600 leading-relaxed">
            Pengajuan komplain garansi maupun *refund* harus dilakukan melalui saluran komunikasi resmi kami (WhatsApp Admin) yang tertera di halaman Hubungi Kami. Proses pengembalian dana akan memakan waktu 1-3 hari kerja sejak pengajuan disetujui, tergantung pada pihak Bank atau E-Wallet yang bersangkutan.
          </p>
        </section>
      </div>
    </div>
  );
}
