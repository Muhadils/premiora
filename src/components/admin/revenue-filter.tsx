"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function RevenueFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterType, setFilterType] = useState<"all" | "date" | "month" | "year">(
    searchParams.has("date") ? "date" : 
    searchParams.has("month") ? "month" : 
    searchParams.has("year") ? "year" : "all"
  );

  const [dateVal, setDateVal] = useState(searchParams.get("date") || "");
  const [monthVal, setMonthVal] = useState(searchParams.get("month") || "");
  const [yearVal, setYearVal] = useState(searchParams.get("year") || new Date().getFullYear().toString());

  const handleApply = () => {
    const params = new URLSearchParams();
    if (filterType === "date" && dateVal) params.set("date", dateVal);
    if (filterType === "month" && monthVal) params.set("month", monthVal);
    if (filterType === "year" && yearVal) params.set("year", yearVal);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setFilterType("all");
    setDateVal("");
    setMonthVal("");
    router.push(pathname);
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 w-full sm:w-auto">
      <div className="w-full sm:w-auto flex-1">
        <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Pilih Filter Waktu</label>
        <select 
          className="w-full h-9 sm:h-10 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="all">Semua Waktu</option>
          <option value="date">Tanggal Spesifik</option>
          <option value="month">Bulan Spesifik</option>
          <option value="year">Tahun Spesifik</option>
        </select>
      </div>

      {filterType === "date" && (
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Pilih Tanggal</label>
          <input 
            type="date" 
            className="w-full h-9 sm:h-10 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
          />
        </div>
      )}

      {filterType === "month" && (
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Pilih Bulan</label>
          <input 
            type="month" 
            className="w-full h-9 sm:h-10 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={monthVal}
            onChange={(e) => setMonthVal(e.target.value)}
          />
        </div>
      )}

      {filterType === "year" && (
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Pilih Tahun</label>
          <select 
            className="w-full h-9 sm:h-10 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={yearVal}
            onChange={(e) => setYearVal(e.target.value)}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
      )}

      <div className="flex gap-2 w-full sm:w-auto pt-1 sm:pt-0">
        <Button size="sm" onClick={handleApply} className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm" disabled={filterType !== "all" && !dateVal && !monthVal && !yearVal}>
          Terapkan
        </Button>
        {filterType !== "all" && (
          <Button variant="outline" size="sm" onClick={handleReset} className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm">
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
