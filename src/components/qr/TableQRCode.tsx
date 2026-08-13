"use client";

import * as React from "react";
import QRCode from "react-qr-code";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

interface TableQRCodeProps {
  restaurantName: string;
  restaurantId: string;
  tableNumber: string;
  tableId: string;
  qrOptions?: {
    color?: {
      dark?: string;
      light?: string;
    };
  };
  showUrl?: boolean;
}

export function TableQRCode({
  restaurantName,
  restaurantId,
  tableNumber,
  tableId,
  qrOptions,
  showUrl = false,
}: TableQRCodeProps) {
  const qrCodeRef = React.useRef<HTMLDivElement>(null);

  const qrUrl = React.useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/menu/${restaurantId}?tableId=${tableId}`;
  }, [restaurantId, tableId]);

  const handleDownload = () => {
    if (!qrCodeRef.current) return;

    const svgElement = qrCodeRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgString)),
    )}`;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const svgSize = svgElement.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;

      ctx.drawImage(img, 0, 0);

      const pngDataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngDataUrl;
      link.download = `qr-code-table-${tableNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = svgDataUrl;
  };

  const fgColor = qrOptions?.color?.dark ?? "#0F172A";
  const bgColor = qrOptions?.color?.light ?? "#FFFFFF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex w-full max-w-sm flex-col items-center rounded-[1.5rem] border border-[#29443C] bg-[#10231E] p-6 text-center shadow-[0_18px_50px_rgba(3,15,11,0.28)] sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8EA79D]">
        {restaurantName}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#F8F5EF]">
        Table {tableNumber}
      </h2>

      <div
        ref={qrCodeRef}
        style={{ backgroundColor: bgColor }}
        className="my-7 rounded-2xl border border-white/10 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-[1.03]"
      >
        {qrUrl ? (
          <QRCode
            value={qrUrl}
            size={220}
            bgColor={bgColor}
            fgColor={fgColor}
            level="H"
          />
        ) : (
          <div className="h-[220px] w-[220px] animate-pulse rounded-md bg-[#e7e2d6]" />
        )}
      </div>

      {showUrl && (
        <div className="w-full break-words">
          <p className="text-xs text-[#8EA79D]">Scannable URL:</p>
          <p className="mt-1 font-mono text-xs text-[#D6B48C]">{qrUrl}</p>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={!qrUrl}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D6B48C]/30 bg-[#D6B48C] px-4 py-3 font-semibold text-[#10231E] transition-colors duration-200 hover:bg-[#e2c39c] focus:outline-none focus:ring-2 focus:ring-[#D6B48C]/60 focus:ring-offset-2 focus:ring-offset-[#10231E] disabled:cursor-not-allowed disabled:border-[#29443C] disabled:bg-[#1B332C] disabled:text-[#6D8179]"
      >
        <Download className="h-5 w-5" />
        <span>Download PNG</span>
      </button>
    </motion.div>
  );
}
