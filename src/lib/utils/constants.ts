import { Clock, CheckCircle2, AlertCircle, Package, RefreshCcw } from "lucide-react";

export const ORDER_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  PROCESSING: "processing",
  COMPLETED: "completed",
  SUCCESS: "success",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending_payment: "Menunggu Pembayaran",
  paid: "Pembayaran Diterima",
  processing: "Sedang Diproses",
  completed: "Pesanan Selesai",
  success: "Berhasil",
  failed: "Gagal",
  cancelled: "Dibatalkan",
  refunded: "Refund",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-700 border-amber-200",
  paid: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-violet-100 text-violet-700 border-violet-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  refunded: "bg-slate-100 text-slate-700 border-slate-200",
};

export const orderStatuses = [
  { id: "pending_payment", label: "Menunggu Pembayaran", color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
  { id: "processing", label: "Diproses", color: "text-blue-700 bg-blue-50 border-blue-200", icon: RefreshCcw },
  { id: "completed", label: "Selesai", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  { id: "cancelled", label: "Dibatalkan", color: "text-slate-700 bg-slate-50 border-slate-200", icon: AlertCircle },
  { id: "failed", label: "Gagal", color: "text-red-700 bg-red-50 border-red-200", icon: AlertCircle },
];

export const CATEGORIES = [
  { name: "AI", slug: "ai", icon: "Brain" },
  { name: "Design", slug: "design", icon: "Palette" },
  { name: "Streaming", slug: "streaming", icon: "Play" },
  { name: "Music", slug: "music", icon: "Music" },
  { name: "Productivity", slug: "productivity", icon: "Briefcase" },
  { name: "Education", slug: "education", icon: "GraduationCap" },
  { name: "VPN", slug: "vpn", icon: "Shield" },
  { name: "Social Media", slug: "social-media", icon: "Share2" },
] as const;

export const WHATSAPP_URL = "https://wa.me/";
