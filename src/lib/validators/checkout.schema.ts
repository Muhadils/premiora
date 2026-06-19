import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  whatsapp: z
    .string()
    .min(10, "Nomor WhatsApp tidak valid")
    .regex(/^[0-9]+$/, "Hanya boleh berisi angka"),
  email: z.string().email("Format email tidak valid (harus berisi @)"),
  dynamic_fields: z.record(z.string(), z.string()).optional(),
  product_id: z.string().min(1, "Produk tidak valid"),
  payment_method: z.string().min(2, "Silakan pilih metode pembayaran"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
