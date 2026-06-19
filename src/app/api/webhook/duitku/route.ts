import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DuitkuService } from "@/lib/payment/duitku.service";
import { approveOrderManually } from "@/lib/actions/order.actions";
import type { DuitkuCallbackNotification } from "@/lib/payment/duitku.types";

export async function POST(req: Request) {
  try {
    const textBody = await req.text();
    let body: any;
    try {
      // Duitku sends form-urlencoded by default, but sometimes JSON depending on settings.
      if (textBody.startsWith("{")) {
        body = JSON.parse(textBody);
      } else {
        const urlParams = new URLSearchParams(textBody);
        body = Object.fromEntries(urlParams.entries());
      }
    } catch (e) {
      console.error("Failed to parse Duitku webhook body:", e);
      return NextResponse.json({ message: "Invalid body format" }, { status: 400 });
    }

    const notification = body as DuitkuCallbackNotification;
    console.log("Duitku webhook received:", notification.merchantOrderId);

    // 1. Verify Signature
    const isValid = DuitkuService.verifyCallbackSignature(notification);
    if (!isValid) {
      console.error("Invalid Duitku signature:", notification.merchantOrderId);
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // 2. Handle Payment Success
    // resultCode "00" is success in Duitku
    if (notification.resultCode === "00") {
      const orderId = notification.merchantOrderId;
      console.log(`Payment success for order: ${orderId}`);

      // We use our existing function to approve order and trigger the supplier API
      const res = await approveOrderManually(orderId);
      
      if (!res.success) {
        console.error(`Failed to approve order ${orderId}:`, res.error);
        return NextResponse.json({ message: "Failed to process order" }, { status: 500 });
      }
        
      return NextResponse.json({ message: "Success" }, { status: 200 });
    }

    return NextResponse.json({ message: "Notification ignored" }, { status: 200 });
  } catch (error) {
    console.error("Duitku webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
