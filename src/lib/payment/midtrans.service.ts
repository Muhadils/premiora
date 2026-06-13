import { snap } from "./midtrans.config";
import type { MidtransTransactionParams, MidtransTransactionResponse, MidtransNotification } from "./midtrans.types";
import crypto from "crypto";

export class MidtransService {
  /**
   * Create a new transaction in Midtrans and get the Snap token/URL
   */
  static async createTransaction(params: MidtransTransactionParams): Promise<MidtransTransactionResponse> {
    try {
      const transaction = await snap.createTransaction(params);
      return transaction;
    } catch (error) {
      console.error("Failed to create Midtrans transaction:", error);
      throw new Error("Gagal membuat transaksi pembayaran");
    }
  }

  /**
   * Verify the signature key from a Midtrans webhook notification
   */
  static verifySignatureKey(notification: MidtransNotification): boolean {
    const { order_id, status_code, gross_amount, signature_key } = notification;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    
    // Format: SHA512(order_id + status_code + gross_amount + serverKey)
    const payload = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const hash = crypto.createHash("sha512").update(payload).digest("hex");
    
    return hash === signature_key;
  }
}
