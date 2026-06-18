import crypto from "crypto";
import type { DuitkuTransactionParams, DuitkuTransactionResponse, DuitkuCallbackNotification } from "./duitku.types";

export class DuitkuService {
  private static readonly isProduction = process.env.NEXT_PUBLIC_DUITKU_IS_PRODUCTION === "true";
  private static readonly merchantCode = process.env.DUITKU_MERCHANT_CODE || "";
  private static readonly apiKey = process.env.DUITKU_API_KEY || "";
  
  private static readonly baseUrl = DuitkuService.isProduction
    ? "https://api-prod.duitku.com/api/merchant/createInvoice"
    : "https://api-sandbox.duitku.com/api/merchant/createInvoice";

  /**
   * Create a new invoice in Duitku and get the payment URL
   */
  static async createInvoice(params: DuitkuTransactionParams): Promise<DuitkuTransactionResponse> {
    const timestamp = Date.now();
    const signaturePlaintext = `${this.merchantCode}${params.merchantOrderId}${params.paymentAmount}${this.apiKey}`;
    const signature = crypto.createHash("md5").update(signaturePlaintext).digest("hex");

    const payload = {
      merchantCode: this.merchantCode,
      paymentAmount: Math.round(Number(params.paymentAmount)),
      merchantOrderId: params.merchantOrderId,
      productDetails: params.productDetails,
      additionalParam: "",
      merchantUserInfo: "",
      email: params.email,
      phoneNumber: params.phoneNumber || "081234567890",
      customerVaName: params.customerVaName || "Customer",
      itemDetails: params.itemDetails.map(item => ({
        name: item.name,
        price: Math.round(Number(item.price)),
        quantity: Math.round(Number(item.quantity))
      })),
      returnUrl: params.returnUrl,
      callbackUrl: params.callbackUrl,
      signature: signature,
      expiryPeriod: 60
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Duitku non-JSON response:", text);
        throw new Error(`Invalid response from Duitku (HTTP ${response.status})`);
      }
      
      if (data.statusCode !== "00" && data.statusCode !== "01" && data.statusCode !== "02") {
         console.error("Duitku Error API Response:", data);
         const errorMsg = data.statusMessage || data.Message || JSON.stringify(data);
         throw new Error(`Duitku Error: ${errorMsg}`);
      }

      return data as DuitkuTransactionResponse;
    } catch (error) {
      console.error("Failed to call Duitku API:", error);
      throw error;
    }
  }

  /**
   * Verify the signature key from a Duitku callback notification
   */
  static verifyCallbackSignature(notification: DuitkuCallbackNotification): boolean {
    const { merchantCode, amount, merchantOrderId, signature } = notification;
    
    // Formula: MD5(merchantCode + amount + merchantOrderId + apiKey)
    const signaturePlaintext = `${merchantCode}${amount}${merchantOrderId}${this.apiKey}`;
    const calculatedSignature = crypto.createHash("md5").update(signaturePlaintext).digest("hex");

    return signature === calculatedSignature;
  }
}
