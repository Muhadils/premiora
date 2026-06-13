import { BasePremkuResponse } from "./premku.types";

const PREMKU_API_URL = process.env.PREMKU_API_URL || process.env.SUPPLIER_API_URL || "https://premku.com/api";
const PREMKU_API_KEY = process.env.PREMKU_API_KEY || process.env.SUPPLIER_API_KEY;

export class PremkuClient {
  /**
   * Helper request method untuk Premku API.
   * Secara otomatis menyisipkan api_key ke dalam body JSON.
   */
  static async request<T extends BasePremkuResponse>(
    endpoint: string,
    data: Record<string, any> = {}
  ): Promise<T> {
    if (!PREMKU_API_KEY) {
      throw new Error("PREMKU_API_KEY is not configured in environment variables.");
    }

    const cleanApiUrl = PREMKU_API_URL.replace(/\/+$/, "");
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const url = `${cleanApiUrl}/${cleanEndpoint}`;
    
    // Inject API key ke dalam body
    const payload = {
      api_key: PREMKU_API_KEY,
      ...data,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        // Jangan simpan cache karena ini transaksi real-time
        cache: "no-store", 
      });

      const result = await response.json();

      // Opsional: Lakukan logging internal jika diperlukan (hati-hati jangan melog API KEY)
      // console.log(`[Premku API] POST /${endpoint}`, { status: response.status, success: result.success });

      return result as T;
    } catch (error: any) {
      console.error(`[Premku API Error] POST /${endpoint}:`, error.message);
      
      // Standardize error return
      return {
        success: false,
        message: error.message || "Unknown error occurred during fetch.",
      } as T;
    }
  }
}
