import { PremkuClient } from "./premku.client";
import {
  PremkuProfileResponse,
  PremkuProductsResponse,
  PremkuStockResponse,
  PremkuOrderResponse,
  PremkuStatusResponse,
} from "./premku.types";
import { createAdminClient } from "@/lib/supabase/admin";

export class PremkuService {
  /**
   * Cek Profil & Saldo Akun Premku
   */
  static async checkBalance(): Promise<PremkuProfileResponse> {
    return PremkuClient.request<PremkuProfileResponse>("profile");
  }

  /**
   * Ambil daftar semua produk dari Premku
   */
  static async getProducts(): Promise<PremkuProductsResponse> {
    return PremkuClient.request<PremkuProductsResponse>("products");
  }

  /**
   * Cek ketersediaan stok untuk suatu produk
   */
  static async checkStock(productId: number): Promise<PremkuStockResponse> {
    return PremkuClient.request<PremkuStockResponse>("stock", { product_id: productId });
  }

  /**
   * Membuat pesanan ke sistem Premku.
   * Parameter `ref_id` sangat disarankan untuk menghindari double order.
   */
  static async createOrder(
    productId: number,
    qty: number,
    refId: string
  ): Promise<PremkuOrderResponse> {
    const response = await PremkuClient.request<PremkuOrderResponse>("order", {
      product_id: productId,
      qty,
      ref_id: refId,
    });
    
    // Log transaksi ke database (Server Side)
    await this.logTransaction(refId, "create_order", { product_id: productId, qty, ref_id: refId }, response);

    return response;
  }

  /**
   * Mengecek status pesanan menggunakan invoice dari Premku.
   * Jika sukses, response.accounts akan berisi array dari { username, password }.
   */
  static async checkOrderStatus(invoice: string): Promise<PremkuStatusResponse> {
    const response = await PremkuClient.request<PremkuStatusResponse>("status", {
      invoice,
    });

    // Opsional log untuk status
    return response;
  }

  /**
   * Private helper untuk mencatat log aktivitas supplier API ke database.
   * Menggunakan Supabase Admin client karena ini murni server-side logging.
   */
  private static async logTransaction(
    orderRefId: string,
    action: string,
    requestBody: any,
    responseBody: any
  ) {
    try {
      const supabase = createAdminClient();
      
      // Karena order_id di tabel `supplier_logs` adalah UUID tabel `orders`, 
      // kita harus mencari order ID aslinya berdasarkan invoice_id (yang dikirim sebagai refId).
      let internalOrderId = null;
      
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("invoice_id", orderRefId)
        .single();
        
      if (order) {
        internalOrderId = order.id;
      }

      await supabase.from("supplier_logs").insert({
        order_id: internalOrderId,
        action,
        request_url: "https://premku.com/api/" + (action === "create_order" ? "order" : action),
        // Filter API Key agar tidak tersimpan di log database
        request_body: { ...requestBody, api_key: "***HIDDEN***" },
        response_body: responseBody,
        status: responseBody.success ? "success" : "failed",
      });
    } catch (error) {
      console.error("[PremkuService logTransaction] Gagal menyimpan log:", error);
    }
  }
}
