import { NextResponse } from "next/server";
import { PremkuService } from "@/lib/supplier/premku.service";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function GET() {
  try {
    const response = await PremkuService.getProducts();
    
    if (!response.success || !response.data) {
      return NextResponse.json({ error: "Gagal mengambil produk dari Premku", details: response }, { status: 500 });
    }

    // Ambil daftar kategori unik dari respons API
    const categoryNames = Array.from(new Set(response.data.map((p: any) => p.category).filter(Boolean)));
    const supabase = createAdminClient();

    const results = [];
    let order = 1;

    for (const name of categoryNames) {
      const slug = slugify(name);
      
      // Cek apakah kategori sudah ada
      const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .eq("name", name)
        .single();

      if (!existing) {
        // Tambahkan kategori baru jika belum ada
        const { data, error } = await supabase
          .from("categories")
          .insert({
            name,
            slug,
            icon: "Package", // Default icon
            sort_order: order,
            is_active: true
          })
          .select()
          .single();
          
        if (error) {
          results.push({ name, status: "error", error: error.message });
        } else {
          results.push({ name, status: "inserted", data });
        }
      } else {
        results.push({ name, status: "already_exists" });
      }
      order++;
    }

    return NextResponse.json({ 
      message: "Sinkronisasi Kategori Berhasil!",
      total_found: categoryNames.length,
      categories: categoryNames,
      details: results
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
