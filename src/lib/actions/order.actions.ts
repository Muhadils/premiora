"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators/checkout.schema";
import { DuitkuService } from "@/lib/payment/duitku.service";
import { generateInvoiceId, formatWhatsApp } from "@/lib/utils/format";
import { siteConfig } from "@/config/site";

export async function createOrder(data: CheckoutInput) {
  try {
    // 1. Validate Input
    const parsedData = checkoutSchema.parse(data);
    
    // 2. Format WhatsApp
    const whatsapp = formatWhatsApp(parsedData.whatsapp);
    
    // 3. Get Product Info from Supabase using Admin Client to bypass RLS
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", parsedData.product_id)
      .single();
      
    if (productError || !product) {
      throw new Error("Produk tidak ditemukan");
    }

    // 4. Generate Order ID
    const invoiceId = generateInvoiceId();
    
    // 5. Calculate Total
    const grossAmount = product.selling_price;
    
    // 6. Find or Create Customer
    let customerId;
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("whatsapp", whatsapp)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: parsedData.name,
          whatsapp: whatsapp,
          email: parsedData.email || null,
        })
        .select()
        .single();
        
      if (customerError) throw new Error("Gagal menyimpan data pelanggan");
      customerId = newCustomer.id;
    }

    // 7. Create Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        invoice_id: invoiceId,
        customer_id: customerId,
        status: "pending_payment",
        subtotal: grossAmount,
        total: grossAmount,
        customer_data: {
          name: parsedData.name,
          whatsapp: whatsapp,
          email: parsedData.email,
        },
      })
      .select()
      .single();

    if (orderError) throw new Error("Gagal membuat order");

    // 8. Create Order Item
    const { error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        price: product.selling_price,
        quantity: 1,
        subtotal: grossAmount,
        dynamic_field_values: parsedData.dynamic_fields || {},
      });

    if (itemError) throw new Error("Gagal menyimpan detail produk");

    // 9. Get Duitku Payment URL
    const duitkuParams = {
      merchantOrderId: invoiceId,
      paymentAmount: grossAmount,
      productDetails: product.name,
      email: parsedData.email || "",
      phoneNumber: whatsapp,
      customerVaName: parsedData.name,
      itemDetails: [
        {
          name: product.name,
          price: product.selling_price,
          quantity: 1,
        },
      ],
      returnUrl: `${siteConfig.url}/payment/success?order_id=${invoiceId}`,
      callbackUrl: `${siteConfig.url}/api/webhook/duitku`,
    };

    const duitkuRes = await DuitkuService.createInvoice(duitkuParams);

    // 10. Save Payment intent
    await supabase.from("payments").insert({
      order_id: order.id,
      gateway: "duitku",
      status: "pending",
      gross_amount: grossAmount,
      raw_response: { payment_url: duitkuRes.paymentUrl, reference: duitkuRes.reference }
    });

    return {
      success: true,
      invoiceId,
      redirectUrl: duitkuRes.paymentUrl,
    };
  } catch (error) {
    console.error("Order error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui",
    };
  }
}

export async function approveOrderManually(orderId: string) {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Get Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, invoice_id")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");
    if (order.status !== "pending_payment") throw new Error("Order is not pending");

    // 2. Update Order Status
    await supabase.from("orders").update({ status: "processing", paid_at: new Date().toISOString() }).eq("id", orderId);
    await supabase.from("payments").update({ status: "success", paid_at: new Date().toISOString() }).eq("order_id", orderId);

    // 3. Trigger Premku API (Auto Process)
    const { data: settingData } = await supabase.from("settings").select("value").eq("key", "auto_process_order").single();
    if (settingData?.value === "true") {
      const { data: orderItems } = await supabase.from("order_items").select("id, quantity, supplier_product_code").eq("order_id", orderId);
      
      if (orderItems && orderItems.length > 0) {
        const { PremkuService } = await import("@/lib/supplier/premku.service");
        for (const item of orderItems) {
          if (item.supplier_product_code) {
            try {
              const premkuRes = await PremkuService.createOrder(Number(item.supplier_product_code), item.quantity, order.invoice_id);
              if (premkuRes.success && premkuRes.invoice) {
                await supabase.from("order_items").update({ supplier_order_id: premkuRes.invoice, supplier_status: "pending" }).eq("id", item.id);
              }
            } catch (err) {
              console.error("Gagal auto-process ke Premku:", err);
            }
          }
        }
      }
    }

    // Revalidate path
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error: any) {
    console.error("Manual approval error:", error);
    return { success: false, error: error.message };
  }
}
