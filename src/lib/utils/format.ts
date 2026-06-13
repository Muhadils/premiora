/**
 * Format angka ke format Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka ke format singkat (1K, 1M, dll)
 */
export function formatCompact(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format tanggal dengan waktu
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Generate invoice ID unik
 */
export function generateInvoiceId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${date}-${random}`;
}

/**
 * Format nomor WhatsApp ke format internasional
 */
export function formatWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}
