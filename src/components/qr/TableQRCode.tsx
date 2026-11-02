"use client";

import * as React from "react";
import QRCode from "react-qr-code";
import { Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
      link.download = `qr-table-${tableNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = svgDataUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-xs sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {restaurantName}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
        Table {tableNumber}
      </h2>

      <div
        ref={qrCodeRef}
        className="my-6 rounded-2xl border border-border bg-white p-5 shadow-xs transition-transform duration-300 hover:scale-[1.02]"
      >
        {qrUrl ? (
          <QRCode
            value={qrUrl}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#17211A"
            level="H"
          />
        ) : (
          <div className="h-[200px] w-[200px] animate-pulse rounded-md bg-muted" />
        )}
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <button
          onClick={handleDownload}
          disabled={!qrUrl}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E5483F] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#d9382f] focus:outline-none focus:ring-2 focus:ring-[#E5483F]/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download QR PNG</span>
        </button>

        <Link
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-foreground transition hover:bg-muted"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Test Menu Link</span>
        </Link>
      </div>

      {showUrl && (
        <div className="mt-4 w-full break-words">
          <p className="font-mono text-[11px] text-muted-foreground">{qrUrl}</p>
        </div>
      )}
    </motion.div>
  );
}
