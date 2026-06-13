// Request Types
export interface BasePremkuRequest {
  api_key: string;
}

export interface PremkuOrderRequest extends BasePremkuRequest {
  product_id: number;
  qty: number;
  ref_id?: string;
}

export interface PremkuStatusRequest extends BasePremkuRequest {
  invoice: string;
}

export interface PremkuStockRequest extends BasePremkuRequest {
  product_id: number;
}

export interface PremkuPayRequest extends BasePremkuRequest {
  amount: number;
}

export interface PremkuPayStatusRequest extends BasePremkuRequest {
  invoice: string;
}

export interface PremkuCancelPayRequest extends BasePremkuRequest {
  invoice: string;
}

// Response Types
export interface BasePremkuResponse {
  success: boolean;
  message?: string;
}

export interface PremkuProfileResponse extends BasePremkuResponse {
  data?: {
    username: string;
    whatsapp: string;
    saldo: number;
    registered_at: string;
  };
}

export interface PremkuOrderResponse extends BasePremkuResponse {
  invoice?: string;
  product?: string;
  qty?: number;
  price?: number;
  total?: number;
  balance_before?: number;
  balance_after?: number;
}

export interface PremkuAccountData {
  username?: string;
  password?: string;
  [key: string]: any;
}

export interface PremkuStatusResponse extends BasePremkuResponse {
  invoice?: string;
  status?: "pending" | "processing" | "success" | "canceled" | "failed";
  product?: string;
  accounts?: PremkuAccountData[];
}

export interface PremkuProduct {
  id: number;
  name: string;
  category?: string;
  description?: string;
  price: number;
  status: "available" | "unavailable";
  stock: number;
  image?: string;
}

export interface PremkuProductsResponse extends BasePremkuResponse {
  data?: PremkuProduct[];
  products?: PremkuProduct[]; // Keep for backward compatibility if any
}

export interface PremkuStockResponse extends BasePremkuResponse {
  product?: string;
  stock?: number;
}

export interface PremkuPayResponse extends BasePremkuResponse {
  data?: {
    invoice: string;
    amount_req: number;
    kode_unik: number;
    total_bayar: number;
    qr_image?: string;
    qr_raw?: string;
    expired_in?: string;
  };
}

export interface PremkuPayStatusResponse extends BasePremkuResponse {
  data?: {
    invoice: string;
    status: string;
    total_bayar: number;
    qr_raw?: string;
  };
}

export interface PremkuCancelPayResponse extends BasePremkuResponse {
  data?: {
    invoice: string;
    status_old: string;
    status_new: string;
  };
}
