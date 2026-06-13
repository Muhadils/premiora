export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  gallery_urls: string[] | null;
  supplier_price: number;
  markup_amount: number;
  markup_percentage: number;
  selling_price: number;
  supplier_product_code: string | null;
  warranty_duration: string;
  estimated_process: string;
  benefits: string[] | null;
  activation_guide: string | null;
  dynamic_fields: DynamicField[] | null;
  faq: ProductFAQ[] | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  stock: number;
  sold_count: number;
  rating_avg: number;
  rating_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
}

export interface DynamicField {
  label: string;
  name: string;
  type: "text" | "email" | "tel" | "url";
  placeholder?: string;
  required: boolean;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  invoice_id: string;
  customer_id: string | null;
  status: OrderStatus;
  subtotal: number;
  total: number;
  notes: string | null;
  customer_data: Record<string, unknown> | null;
  paid_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  customer?: Customer;
  order_items?: OrderItem[];
  payments?: Payment[];
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "success"
  | "failed"
  | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  credentials: OrderCredentials | null;
  dynamic_field_values: Record<string, string> | null;
  supplier_order_id: string | null;
  supplier_status: string;
  created_at: string;
  // Relations
  product?: Product;
}

export interface OrderCredentials {
  email?: string;
  password?: string;
  invite_link?: string;
  username?: string;
  notes?: string;
  [key: string]: string | undefined;
}

export interface Payment {
  id: string;
  order_id: string;
  gateway: string;
  transaction_id: string | null;
  payment_type: string | null;
  status: string;
  gross_amount: number;
  raw_response: Record<string, unknown> | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierLog {
  id: string;
  order_id: string | null;
  action: string;
  request_url: string | null;
  request_body: Record<string, unknown> | null;
  response_body: Record<string, unknown> | null;
  response_code: number | null;
  status: string;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  is_visible: boolean;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
}
