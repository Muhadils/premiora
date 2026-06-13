"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const supplierCode = formData.get("supplier_product_code") as string;
    const priceStr = formData.get("price") as string;
    const desc = formData.get("description") as string;
    const imgUrl = formData.get("image_url") as string;

    if (!name || !category || !priceStr) {
      return { success: false, message: "Nama, Kategori, dan Harga wajib diisi!" };
    }

    const price = parseInt(priceStr, 10);
    if (isNaN(price)) {
      return { success: false, message: "Harga harus berupa angka valid!" };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let categoryId = category;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (category && !uuidRegex.test(category)) {
      const { data: catData } = await supabase.from("categories").select("id").eq("slug", category).single();
      if (catData) {
        categoryId = catData.id;
      } else {
        // Create if not exists to avoid foreign key error
        const { data: newCat, error: catError } = await supabase.from("categories").insert({ 
          name: category.charAt(0).toUpperCase() + category.slice(1), 
          slug: category,
          sort_order: 0,
          is_active: true
        }).select("id").single();
        
        if (catError) {
          throw new Error("Gagal membuat kategori otomatis: " + catError.message);
        }
        if (newCat) categoryId = newCat.id;
      }
    }

    // Ekstrak garansi dari deskripsi atau nama produk
    let warrantyDuration = "1 Bulan";
    const descMatch = desc.match(/garansi\s+(\d+\s+(hari|minggu|bulan|tahun)|lifetime)/i);
    if (descMatch) {
      warrantyDuration = descMatch[1].replace(/\b\w/g, c => c.toUpperCase());
    } else {
      const nameMatch = name.match(/(\d+\s+(hari|minggu|bulan|tahun)|lifetime)/i);
      if (nameMatch) {
        warrantyDuration = nameMatch[0].replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    const { error } = await supabase.from("products").insert({
      name,
      slug,
      category_id: categoryId,
      supplier_product_code: supplierCode || null,
      supplier_price: price, 
      markup_amount: 0,
      short_description: desc,
      description: desc,
      warranty_duration: warrantyDuration,
      thumbnail_url: imgUrl || null,
      rating_avg: 5.0,
      rating_count: 0,
      sold_count: 0,
      stock: 999,
      is_active: true
    });

    if (error) {
      throw error;
    }

    // Revalidate paths so the UI updates automatically
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, message: "Produk berhasil ditambahkan!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambahkan produk." };
  }
}

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "File gambar tidak ditemukan" };
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, message: "Gagal mengunggah gambar ke Supabase Storage: " + error.message };
    }

    // Dapatkan Public URL
    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal mengunggah gambar" };
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const supplierCode = formData.get("supplier_product_code") as string;
    const priceStr = formData.get("price") as string;
    const desc = formData.get("description") as string;
    const imgUrl = formData.get("image_url") as string;

    if (!id || !name || !category || !priceStr) {
      return { success: false, message: "ID, Nama, Kategori, dan Harga wajib diisi!" };
    }

    const price = parseInt(priceStr, 10);
    if (isNaN(price)) {
      return { success: false, message: "Harga harus berupa angka valid!" };
    }

    let categoryId = category;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (category && !uuidRegex.test(category)) {
      const { data: catData } = await supabase.from("categories").select("id").eq("slug", category).single();
      if (catData) {
        categoryId = catData.id;
      } else {
        const { data: newCat, error: catError } = await supabase.from("categories").insert({ 
          name: category.charAt(0).toUpperCase() + category.slice(1), 
          slug: category,
          sort_order: 0,
          is_active: true
        }).select("id").single();
        
        if (catError) {
          throw new Error("Gagal membuat kategori otomatis: " + catError.message);
        }
        if (newCat) categoryId = newCat.id;
      }
    }

    // Ekstrak garansi dari deskripsi atau nama produk
    let warrantyDuration = "1 Bulan";
    const descMatch = desc.match(/garansi\s+(\d+\s+(hari|minggu|bulan|tahun)|lifetime)/i);
    if (descMatch) {
      warrantyDuration = descMatch[1].replace(/\b\w/g, c => c.toUpperCase());
    } else {
      const nameMatch = name.match(/(\d+\s+(hari|minggu|bulan|tahun)|lifetime)/i);
      if (nameMatch) {
        warrantyDuration = nameMatch[0].replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    const updatePayload: any = {
      name,
      category_id: categoryId,
      supplier_product_code: supplierCode || null,
      supplier_price: price,
      markup_amount: 0,
      short_description: desc,
      description: desc,
      warranty_duration: warrantyDuration,
    };

    if (imgUrl) {
      updatePayload.thumbnail_url = imgUrl;
    }

    const { error } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, message: "Produk berhasil diperbarui!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal memperbarui produk." };
  }
}
