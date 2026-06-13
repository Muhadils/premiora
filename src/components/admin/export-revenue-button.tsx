"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderData {
  id: string;
  total: number;
  created_at: string;
  order_items: any[];
}

export function ExportRevenueButton({ orders }: { orders: OrderData[] | null }) {
  const handleExport = () => {
    if (!orders || orders.length === 0) {
      alert("Tidak ada data untuk diekspor pada rentang waktu ini.");
      return;
    }

    let totalGrossAll = 0;
    let totalCostAll = 0;
    let totalProfitAll = 0;

    // Build the table rows
    let tableRows = "";
    orders.forEach((order, index) => {
      const date = new Date(order.created_at).toLocaleDateString('id-ID');
      const productNames = order.order_items?.map((item: any) => `${item.product_name} (x${item.quantity})`).join("<br>") || "-";
      
      const gross = Number(order.total);
      let supplierCost = 0;
      
      order.order_items?.forEach((item: any) => {
        const cost = item.products?.supplier_price || (item.price * 0.9);
        supplierCost += (cost * item.quantity);
      });
      
      const profit = gross - supplierCost;

      totalGrossAll += gross;
      totalCostAll += supplierCost;
      totalProfitAll += profit;

      const bg = index % 2 === 0 ? "#ffffff" : "#f8fafc";

      tableRows += `
        <tr style="background-color: ${bg}; text-align: center; vertical-align: middle;">
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${index + 1}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${date}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-family: monospace;">${order.id}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">${productNames}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;" x:num="${gross}">${gross}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;" x:num="${supplierCost}">${supplierCost}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; color: #059669; font-weight: bold;" x:num="${profit}">${profit}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Laporan Pendapatan</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          td { mso-number-format:"\\_\\Rp\\ * \\#\\,\\#\\#0\\_\\;\\_\\Rp\\ * \\-\\#\\,\\#\\#0\\_\\;\\_\\Rp\\ * \\0\\_\\;\\_\\@\\_\\;"; }
        </style>
      </head>
      <body>
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; border-collapse: collapse;">
          <tr>
            <td colspan="7" style="text-align: center; font-size: 20px; font-weight: bold; padding: 15px; color: #1e293b;">
              LAPORAN PENDAPATAN PREMIORA
            </td>
          </tr>
          <tr>
            <td colspan="7" style="text-align: center; font-size: 12px; color: #64748b; padding-bottom: 15px;">
              Diekspor pada: ${new Date().toLocaleString('id-ID')}
            </td>
          </tr>
          <tr>
            <th style="background-color: #1e293b; color: white; padding: 10px; border: 1px solid #0f172a; width: 40px;">No</th>
            <th style="background-color: #1e293b; color: white; padding: 10px; border: 1px solid #0f172a; width: 100px;">Tanggal</th>
            <th style="background-color: #1e293b; color: white; padding: 10px; border: 1px solid #0f172a; width: 250px;">ID Pesanan</th>
            <th style="background-color: #1e293b; color: white; padding: 10px; border: 1px solid #0f172a; width: 300px;">Produk & Qty</th>
            <th style="background-color: #1e293b; color: white; padding: 10px; border: 1px solid #0f172a; width: 150px;">Omzet (Kotor)</th>
            <th style="background-color: #1e293b; color: white; padding: 10px; border: 1px solid #0f172a; width: 150px;">Estimasi Modal</th>
            <th style="background-color: #059669; color: white; padding: 10px; border: 1px solid #047857; width: 150px;">Profit Bersih</th>
          </tr>
          ${tableRows}
          <tr>
            <td colspan="4" style="background-color: #e2e8f0; font-weight: bold; text-align: right; padding: 10px; border: 1px solid #cbd5e1;">
              TOTAL KESELURUHAN:
            </td>
            <td style="background-color: #e2e8f0; font-weight: bold; text-align: right; padding: 10px; border: 1px solid #cbd5e1;" x:num="${totalGrossAll}">${totalGrossAll}</td>
            <td style="background-color: #e2e8f0; font-weight: bold; text-align: right; padding: 10px; border: 1px solid #cbd5e1;" x:num="${totalCostAll}">${totalCostAll}</td>
            <td style="background-color: #d1fae5; font-weight: bold; color: #059669; text-align: right; padding: 10px; border: 1px solid #10b981;" x:num="${totalProfitAll}">${totalProfitAll}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Pendapatan_${new Date().getTime()}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800"
      disabled={!orders || orders.length === 0}
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Export CSV (Excel)</span>
    </Button>
  );
}
