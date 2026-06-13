import type { Product, Category } from "@/types";

// ============================================
// MOCK CATEGORIES
// ============================================
export const mockCategories: Category[] = [
  { id: "1", name: "AI", slug: "ai", icon: "Brain", description: "Layanan AI Premium", sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Design", slug: "design", icon: "Palette", description: "Tools Desain", sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Streaming", slug: "streaming", icon: "Play", description: "Platform Streaming", sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Music", slug: "music", icon: "Music", description: "Musik Streaming", sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Productivity", slug: "productivity", icon: "Briefcase", description: "Produktivitas", sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Education", slug: "education", icon: "GraduationCap", description: "Pendidikan", sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "VPN", slug: "vpn", icon: "Shield", description: "Layanan VPN", sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Social Media", slug: "social-media", icon: "Share2", description: "Sosial Media", sort_order: 8, is_active: true, created_at: "", updated_at: "" },
];

// ============================================
// MOCK PRODUCTS
// ============================================
export const mockProducts: (Product & { category?: Category })[] = [
  {
    id: "p1",
    category_id: "1",
    name: "ChatGPT Plus",
    slug: "chatgpt-plus",
    description: "Akses GPT-4o, analisis gambar, browsing internet, dan fitur premium lainnya. Upgrade akun ChatGPT kamu ke Plus untuk pengalaman AI terbaik.",
    short_description: "Akses GPT-4o, analisis gambar, dan browsing internet",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 150000,
    markup_amount: 30000,
    markup_percentage: 0,
    selling_price: 180000,
    supplier_product_code: "CHATGPT-PLUS-1M",
    warranty_duration: "30 Hari",
    estimated_process: "1-5 Menit",
    benefits: ["Akses GPT-4o terbaru", "Analisis gambar & dokumen", "Browsing internet real-time", "Plugin marketplace", "Priority access saat peak hours"],
    activation_guide: "1. Login ke ChatGPT dengan akun Anda\n2. Kami akan upgrade akun Anda\n3. Cek menu Settings > Subscription\n4. Selesai! Nikmati ChatGPT Plus",
    dynamic_fields: [{ label: "Email ChatGPT", name: "chatgpt_email", type: "email", placeholder: "email@gmail.com", required: true }],
    faq: [{ question: "Berapa lama proses aktivasi?", answer: "1-5 menit setelah pembayaran dikonfirmasi" }, { question: "Apakah ada garansi?", answer: "Ya, garansi 30 hari full replacement" }],
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    stock: 50,
    sold_count: 1250,
    rating_avg: 4.9,
    rating_count: 328,
    sort_order: 1,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "1", name: "AI", slug: "ai", icon: "Brain", description: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "p2",
    category_id: "1",
    name: "Claude Pro",
    slug: "claude-pro",
    description: "Dapatkan akses Claude Pro untuk pengalaman AI percakapan terbaik dari Anthropic. Nikmati model Claude Sonnet 4 dan Opus dengan limit yang jauh lebih tinggi.",
    short_description: "Akses Claude Sonnet 4 & Opus dengan limit lebih tinggi",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 160000,
    markup_amount: 30000,
    markup_percentage: 0,
    selling_price: 190000,
    supplier_product_code: "CLAUDE-PRO-1M",
    warranty_duration: "30 Hari",
    estimated_process: "1-10 Menit",
    benefits: ["Akses model Claude Sonnet 4", "Limit pesan 5x lebih banyak", "Priority access", "Akses fitur beta terbaru", "Claude Projects & Artifacts"],
    activation_guide: "1. Berikan email akun Claude Anda\n2. Kami akan upgrade ke Pro\n3. Login kembali dan nikmati Claude Pro",
    dynamic_fields: [{ label: "Email Claude", name: "claude_email", type: "email", placeholder: "email@gmail.com", required: true }],
    faq: [{ question: "Apakah akun saya aman?", answer: "Ya, kami hanya upgrade subscription, tidak mengakses data Anda" }],
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    stock: 30,
    sold_count: 680,
    rating_avg: 4.8,
    rating_count: 156,
    sort_order: 2,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "1", name: "AI", slug: "ai", icon: "Brain", description: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "p3",
    category_id: "1",
    name: "Gemini Advanced",
    slug: "gemini-advanced",
    description: "Upgrade ke Gemini Advanced untuk akses model Gemini Ultra terbaru dari Google. Nikmati kemampuan AI terdepan untuk coding, analisis, dan kreativitas.",
    short_description: "Akses Gemini Ultra, 2TB Google Drive, dan fitur AI terbaru",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 140000,
    markup_amount: 25000,
    markup_percentage: 0,
    selling_price: 165000,
    supplier_product_code: "GEMINI-ADV-1M",
    warranty_duration: "30 Hari",
    estimated_process: "1-10 Menit",
    benefits: ["Model Gemini Ultra terbaru", "2TB Google One storage", "Gemini di Gmail, Docs, Slides", "Priority access ke fitur baru", "Integrasi Google Workspace"],
    activation_guide: "1. Berikan email Google Anda\n2. Kami aktifkan Google One AI Premium\n3. Akses Gemini Advanced di gemini.google.com",
    dynamic_fields: [{ label: "Email Google", name: "google_email", type: "email", placeholder: "email@gmail.com", required: true }],
    faq: [],
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    stock: 40,
    sold_count: 450,
    rating_avg: 4.7,
    rating_count: 98,
    sort_order: 3,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "1", name: "AI", slug: "ai", icon: "Brain", description: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "p4",
    category_id: "2",
    name: "Canva Pro",
    slug: "canva-pro",
    description: "Canva Pro memberikan akses ke 100+ juta foto, video, audio premium, 3000+ font premium, background remover, magic resize, dan masih banyak lagi.",
    short_description: "100M+ aset premium, background remover, magic resize",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 30000,
    markup_amount: 15000,
    markup_percentage: 0,
    selling_price: 45000,
    supplier_product_code: "CANVA-PRO-1M",
    warranty_duration: "30 Hari",
    estimated_process: "1-5 Menit",
    benefits: ["100M+ foto, video, audio premium", "Background remover otomatis", "Magic resize untuk semua ukuran", "3000+ font premium", "Brand Kit", "Scheduler & Content Planner"],
    activation_guide: "1. Berikan email Canva Anda\n2. Anda akan menerima invite ke tim Pro\n3. Accept invitation dari email\n4. Nikmati Canva Pro!",
    dynamic_fields: [{ label: "Email Canva", name: "canva_email", type: "email", placeholder: "email@gmail.com", required: true }],
    faq: [{ question: "Apakah ini shared atau personal?", answer: "Ini adalah invite ke tim Pro, Anda mendapat akses penuh semua fitur Pro" }],
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    stock: 100,
    sold_count: 3500,
    rating_avg: 4.9,
    rating_count: 890,
    sort_order: 1,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "2", name: "Design", slug: "design", icon: "Palette", description: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "p5",
    category_id: "3",
    name: "Netflix Premium",
    slug: "netflix-premium",
    description: "Nikmati Netflix Premium dengan kualitas Ultra HD 4K, hingga 4 perangkat sekaligus, dan akses ke semua konten Netflix tanpa batasan.",
    short_description: "Ultra HD 4K, 4 perangkat, semua konten tanpa batasan",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 35000,
    markup_amount: 15000,
    markup_percentage: 0,
    selling_price: 50000,
    supplier_product_code: "NETFLIX-PREM-1M",
    warranty_duration: "30 Hari",
    estimated_process: "1-15 Menit",
    benefits: ["Kualitas Ultra HD 4K", "Hingga 4 perangkat sekaligus", "Download untuk offline", "Semua konten tanpa batasan", "Tanpa iklan"],
    activation_guide: "1. Berikan email Netflix Anda\n2. Kami akan upgrade plan Anda\n3. Login kembali dan nikmati Netflix Premium",
    dynamic_fields: [{ label: "Email Netflix", name: "netflix_email", type: "email", placeholder: "email@gmail.com", required: true }],
    faq: [],
    is_featured: false,
    is_best_seller: true,
    is_active: true,
    stock: 60,
    sold_count: 2100,
    rating_avg: 4.8,
    rating_count: 520,
    sort_order: 1,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "3", name: "Streaming", slug: "streaming", icon: "Play", description: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "p6",
    category_id: "4",
    name: "Spotify Premium",
    slug: "spotify-premium",
    description: "Spotify Premium tanpa iklan, download lagu offline, kualitas audio tinggi, dan bisa skip lagu sepuasnya.",
    short_description: "Tanpa iklan, download offline, audio berkualitas tinggi",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 15000,
    markup_amount: 10000,
    markup_percentage: 0,
    selling_price: 25000,
    supplier_product_code: "SPOTIFY-PREM-1M",
    warranty_duration: "30 Hari",
    estimated_process: "1-5 Menit",
    benefits: ["Tanpa iklan", "Download lagu offline", "Kualitas audio tinggi", "Skip sepuasnya", "Dengarkan di mana saja"],
    activation_guide: "1. Berikan username Spotify Anda\n2. Accept invite dari email\n3. Nikmati Spotify Premium!",
    dynamic_fields: [{ label: "Username Spotify", name: "spotify_username", type: "text", placeholder: "username_spotify", required: true }],
    faq: [],
    is_featured: false,
    is_best_seller: true,
    is_active: true,
    stock: 80,
    sold_count: 4200,
    rating_avg: 4.9,
    rating_count: 1050,
    sort_order: 1,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "4", name: "Music", slug: "music", icon: "Music", description: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "p7",
    category_id: "3",
    name: "YouTube Premium",
    slug: "youtube-premium",
    description: "YouTube Premium tanpa iklan, bisa download video offline, putar di background, dan akses YouTube Music Premium.",
    short_description: "Tanpa iklan, download, background play, YouTube Music",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 20000,
    markup_amount: 10000,
    markup_percentage: 0,
    selling_price: 30000,
    supplier_product_code: "YOUTUBE-PREM-1M",
    warranty_duration: "30 Hari",
    estimated_process: "1-10 Menit",
    benefits: ["Tanpa iklan di semua video", "Download video offline", "Putar di background", "YouTube Music Premium", "YouTube Originals"],
    activation_guide: "1. Berikan email Google Anda\n2. Anda akan diundang ke family group\n3. Accept invitation dan nikmati YouTube Premium",
    dynamic_fields: [{ label: "Email Google", name: "google_email", type: "email", placeholder: "email@gmail.com", required: true }],
    faq: [],
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    stock: 50,
    sold_count: 1800,
    rating_avg: 4.8,
    rating_count: 420,
    sort_order: 2,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "3", name: "Streaming", slug: "streaming", icon: "Play", description: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "p8",
    category_id: "5",
    name: "Microsoft 365",
    slug: "microsoft-365",
    description: "Microsoft 365 Personal dengan Word, Excel, PowerPoint, Outlook, 1TB OneDrive, dan semua aplikasi Office terbaru.",
    short_description: "Word, Excel, PowerPoint + 1TB OneDrive",
    thumbnail_url: null,
    gallery_urls: null,
    supplier_price: 40000,
    markup_amount: 20000,
    markup_percentage: 0,
    selling_price: 60000,
    supplier_product_code: "MS365-PERSONAL-1M",
    warranty_duration: "30 Hari",
    estimated_process: "5-15 Menit",
    benefits: ["Word, Excel, PowerPoint terbaru", "1TB OneDrive storage", "Outlook Premium", "Hingga 5 perangkat", "Update otomatis"],
    activation_guide: "1. Anda akan menerima email invite\n2. Login ke akun Microsoft Anda\n3. Redeem invitation\n4. Install aplikasi Office terbaru",
    dynamic_fields: [{ label: "Email Microsoft", name: "microsoft_email", type: "email", placeholder: "email@outlook.com", required: true }],
    faq: [],
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    stock: 40,
    sold_count: 950,
    rating_avg: 4.7,
    rating_count: 210,
    sort_order: 1,
    created_at: "2026-01-01",
    updated_at: "2026-06-01",
    category: { id: "5", name: "Productivity", slug: "productivity", icon: "Briefcase", description: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getProductBySlug(slug: string) {
  return mockProducts.find((p) => p.slug === slug) || null;
}

export function getFeaturedProducts() {
  return mockProducts.filter((p) => p.is_featured);
}

export function getBestSellerProducts() {
  return mockProducts.filter((p) => p.is_best_seller);
}

export function getLatestProducts() {
  return [...mockProducts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getProductsByCategory(categorySlug: string) {
  const category = mockCategories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return mockProducts.filter((p) => p.category_id === category.id);
}

export function searchProducts(query: string) {
  const lower = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.short_description?.toLowerCase().includes(lower) ||
      p.category?.name.toLowerCase().includes(lower)
  );
}

export function getSimilarProducts(productId: string, categoryId: string | null) {
  return mockProducts
    .filter((p) => p.id !== productId && p.category_id === categoryId)
    .slice(0, 4);
}
