"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitComplaint(formData: FormData) {
  try {
    const supabase = await createClient();

    const customer_name = formData.get("customer_name") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const invoice_id = formData.get("invoice_id") as string || null;

    if (!customer_name || !whatsapp || !category || !description) {
      return { success: false, message: "Harap lengkapi semua field wajib." };
    }

    const { error } = await supabase.from("complaints").insert({
      customer_name,
      whatsapp,
      category,
      description,
      invoice_id,
      status: "pending",
    });

    if (error) {
      console.error("Supabase Error:", error);
      return { success: false, message: "Gagal mengirim keluhan. Coba lagi." };
    }

    revalidatePath("/admin/complaints");
    return { success: true, message: "Keluhan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda melalui WhatsApp." };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Terjadi kesalahan internal." };
  }
}

export async function resolveComplaint(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("complaints")
      .update({ status: "resolved" })
      .eq("id", id);

    if (error) {
      console.error("Supabase Error:", error);
      return { success: false, message: "Gagal memperbarui status keluhan." };
    }

    revalidatePath("/admin/complaints");
    return { success: true, message: "Keluhan ditandai selesai." };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Terjadi kesalahan." };
  }
}
