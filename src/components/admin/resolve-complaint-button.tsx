"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resolveComplaint } from "@/lib/actions/complaint.actions";
import { CheckCircle } from "lucide-react";

export function ResolveComplaintButton({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResolve = async () => {
    if (confirm("Tandai keluhan ini sebagai sudah diselesaikan?")) {
      setIsLoading(true);
      await resolveComplaint(id);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleResolve}
      disabled={isLoading}
      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 bg-white"
    >
      <CheckCircle className="h-4 w-4 mr-2" />
      {isLoading ? "Memproses..." : "Selesai"}
    </Button>
  );
}
