"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    return `${pathname}?${current.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-slate-500">
        Halaman <span className="font-medium text-slate-900">{currentPage}</span> dari <span className="font-medium text-slate-900">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          asChild={currentPage > 1}
        >
          {currentPage > 1 ? (
            <Link href={createPageUrl(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Link>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          asChild={currentPage < totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={createPageUrl(currentPage + 1)}>
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
