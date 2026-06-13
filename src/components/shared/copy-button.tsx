"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-md transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
