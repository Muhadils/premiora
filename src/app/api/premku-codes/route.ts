import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.SUPPLIER_API_KEY || "4d5a4961e662a95b91331e090ade15e5";
    
    const res = await fetch("https://premku.com/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api_key: apiKey }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
