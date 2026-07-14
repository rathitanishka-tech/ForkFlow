"use client";

import * as React from "react";
import QRCode from "react-qr-code";
import { Download } from "lucide-react";

interface TableQRCodeProps {
  restaurantName: string;
  restaurantId: string;
  tableNumber: string;
  tableId: string; // The actual ID of the table
}

export function TableQRCode({
  restaurantName,
  restaurantId,
  tableNumber,
  tableId,
}: TableQRCodeProps) {
  const [qrUrl, setQrUrl] = React.useState("");
  const qrCodeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/menu/${restaurantId}?tableId=${tableId}`;
    setQrUrl(url);
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
      // The QR code library renders with some padding, so we get the actual size from the SVG element
      const svgSize = svgElement.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get the PNG data URL
      const pngDataUrl = canvas.toDataURL("image/png");

      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = pngDataUrl;
      link.download = `qr-code-table-${tableNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = svgDataUrl;
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl shadow-cyan-500/10 sm:p-8">
      <h2 className="text-2xl font-bold text-white">{restaurantName}</h2>
      <p className="text-lg text-slate-400">Table {tableNumber}</p>

      <div
        ref={qrCodeRef}
        className="my-6 rounded-lg bg-white p-4 transition-all duration-300 hover:scale-105"
      >
        {qrUrl ? (
          <QRCode
            value={qrUrl}
            size={256}
            bgColor="#FFFFFF"
            fgColor="#0F172A" // slate-900
            level="H" // High error correction
          />
        ) : (
          <div className="h-64 w-64 animate-pulse rounded-md bg-slate-200" />
        )}
      </div>

      <div className="w-full break-words">
        <p className="text-xs text-slate-500">Scannable URL:</p>
        <p className="mt-1 font-mono text-xs text-cyan-400">{qrUrl}</p>
      </div>

      <button
        onClick={handleDownload}
        disabled={!qrUrl}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        <Download className="h-5 w-5" />
        <span>Download PNG</span>
      </button>
    </div>
  );
}
