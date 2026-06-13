import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MidtransService } from "@/lib/payment/midtrans.service";

export async function POST(request: Request) {
  try {
    const notification = await request.json();

    // 1. Verify Signature
    const isValid = MidtransService.verifySignatureKey(notification);
    if (!isValid) {
      console.error("Invalid Midtrans signature:", notification.order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const {
      transaction_status,
      fraud_status,
      order_id: invoiceId,
      transaction_id,
      payment_type,
      gross_amount,
    } = notification;

    const supabase = await createClient();

    // 2. Fetch Order by Invoice ID
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("invoice_id", invoiceId)
      .single();

    if (orderError || !order) {
      console.error("Order not found for webhook:", invoiceId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Determine Payment Status
    let newStatus = order.status;
    let paymentStatus = "pending";

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        newStatus = "pending_payment"; // Still reviewing
        paymentStatus = "challenge";
      } else if (fraud_status === "accept") {
        newStatus = "processing";
        paymentStatus = "success";
      }
    } else if (transaction_status === "settlement") {
      newStatus = "processing"; // Payment successful
      paymentStatus = "success";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newStatus = "cancelled";
      paymentStatus = "failed";
    } else if (transaction_status === "pending") {
      newStatus = "pending_payment";
      paymentStatus = "pending";
    }

    // 4. Update Database
    // Update payment record
    await supabase
      .from("payments")
      .update({
        status: paymentStatus,
        transaction_id,
        payment_type,
        raw_response: notification,
        ...(paymentStatus === "success" ? { paid_at: new Date().toISOString() } : {}),
      })
      .eq("order_id", order.id);

    // Update order record
    if (order.status !== newStatus) {
      await supabase
        .from("orders")
        .update({
          status: newStatus,
          ...(paymentStatus === "success" ? { paid_at: new Date().toISOString() } : {}),
        })
      } // <-- missing brace for if (order.status !== newStatus)
      
      // Phase 3: Trigger Supplier API
      if (paymentStatus === "success") {
        // Fetch auto_process_order setting
        const { data: settingData } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "auto_process_order")
          .single();
          
        const autoProcess = settingData?.value === "true";

        if (autoProcess) {
          // Fetch order items
          const { data: orderItems } = await supabase
            .from("order_items")
            .select("id, quantity, supplier_product_code")
            .eq("order_id", order.id);

          if (orderItems && orderItems.length > 0) {
            // Import dynamically to avoid circular dependencies if any
            const { PremkuService } = await import("@/lib/supplier/premku.service");

            for (const item of orderItems) {
              if (item.supplier_product_code) {
                try {
                  // create order di Premku
                  const premkuRes = await PremkuService.createOrder(
                    Number(item.supplier_product_code),
                    item.quantity,
                    invoiceId
                  );

                  if (premkuRes.success && premkuRes.invoice) {
                    // Update order_items dengan invoice dari premku
                    await supabase
                      .from("order_items")
                      .update({
                        supplier_order_id: premkuRes.invoice,
                        supplier_status: "pending",
                      })
                      .eq("id", item.id);
                  }
                } catch (err) {
                  console.error("Gagal auto-process ke Premku:", err);
                }
              }
            }
          }
        }
      }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
