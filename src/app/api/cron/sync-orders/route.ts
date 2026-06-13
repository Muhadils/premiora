import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PremkuService } from "@/lib/supplier/premku.service";

export async function GET(request: Request) {
  // Hanya bisa diakses secara cron (atau endpoint dilindungi rahasia)
  // Untuk keperluan ini, kita buat public GET sederhana. Pada production,
  // tambahkan header authorization (misal Bearer cron_secret)
  const authHeader = request.headers.get("authorization");
  if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    // Cari semua order_items yang supplier_status nya pending dan punya supplier_order_id
    const { data: items, error } = await supabase
      .from("order_items")
      .select("id, order_id, supplier_order_id, supplier_status")
      .eq("supplier_status", "pending")
      .not("supplier_order_id", "is", null);

    if (error) {
      throw error;
    }

    const results = [];

    for (const item of items) {
      if (!item.supplier_order_id) continue;

      // Cek status ke Premku
      const statusRes = await PremkuService.checkOrderStatus(item.supplier_order_id);

      if (statusRes.success) {
        if (statusRes.status === "success" && statusRes.accounts && statusRes.accounts.length > 0) {
          // Berhasil! Simpan akun dan update status
          await supabase
            .from("order_items")
            .update({
              supplier_status: "success",
              credentials: statusRes.accounts,
            })
            .eq("id", item.id);

          // Cek apakah semua items di order ini sudah success
          const { data: siblings } = await supabase
            .from("order_items")
            .select("supplier_status")
            .eq("order_id", item.order_id);

          const allSuccess = siblings?.every((sib) => sib.supplier_status === "success");

          if (allSuccess) {
            await supabase
              .from("orders")
              .update({
                status: "completed",
                completed_at: new Date().toISOString(),
              })
              .eq("id", item.order_id);
          }

          results.push({ id: item.id, status: "success" });
        } else if (statusRes.status === "failed" || statusRes.status === "canceled") {
          // Gagal
          await supabase
            .from("order_items")
            .update({
              supplier_status: statusRes.status,
            })
            .eq("id", item.id);

          results.push({ id: item.id, status: statusRes.status });
        } else {
          // Masih processing/pending
          results.push({ id: item.id, status: statusRes.status });
        }
      }
    }

    return NextResponse.json({ success: true, processed: results });
  } catch (error: any) {
    console.error("Cron sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
