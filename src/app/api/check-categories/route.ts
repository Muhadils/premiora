import { NextResponse } from "next/server";
import { PremkuService } from "@/lib/supplier/premku.service";

export async function GET() {
  try {
    const response = await PremkuService.getProducts();
    
    if (!response.success || !response.data) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    const categories = new Set(response.data.map(p => p.category));
    
    return NextResponse.json({ 
      unique_categories: Array.from(categories),
      total_products: response.data.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
