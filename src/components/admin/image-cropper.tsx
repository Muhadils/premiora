"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      drawCanvas();
    };
  }, [imageSrc]);

  // Draw on canvas whenever zoom changes
  const drawCanvas = () => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    const size = 300; // Fixed display size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate crop parameters (Center crop)
    const minDim = Math.min(img.width, img.height);
    const scaledDim = minDim / zoom;
    
    const sx = (img.width - scaledDim) / 2;
    const sy = (img.height - scaledDim) / 2;

    ctx.drawImage(
      img,
      sx, sy, scaledDim, scaledDim, // Source
      0, 0, size, size // Destination
    );
  };

  useEffect(() => {
    drawCanvas();
  }, [zoom]);

  const handleCropSave = () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);
    
    // We want the final output to be 500x500 for good quality
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 500;
    finalCanvas.height = 500;
    const ctx = finalCanvas.getContext("2d");
    
    if (ctx && imgRef.current) {
      const img = imgRef.current;
      const minDim = Math.min(img.width, img.height);
      const scaledDim = minDim / zoom;
      const sx = (img.width - scaledDim) / 2;
      const sy = (img.height - scaledDim) / 2;

      ctx.drawImage(
        img,
        sx, sy, scaledDim, scaledDim,
        0, 0, 500, 500
      );
      
      finalCanvas.toBlob((blob) => {
        setIsProcessing(false);
        if (blob) {
          onCropComplete(blob);
        } else {
          alert("Gagal memproses gambar.");
        }
      }, "image/jpeg", 0.9);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">Sesuaikan Gambar (1:1)</h3>
        </div>

        <div className="flex justify-center items-center bg-slate-900 p-6">
          <canvas 
            ref={canvasRef} 
            className="rounded-xl shadow-lg border border-slate-700 bg-black/50"
            style={{ width: "300px", height: "300px" }}
          />
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">Perbesar (Zoom Tengah)</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
              Batal
            </Button>
            <Button onClick={handleCropSave} disabled={isProcessing}>
              {isProcessing ? "Memproses..." : "Terapkan & Simpan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
