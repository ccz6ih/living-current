"use client";

import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function ReportActions({
  clientId,
  printButton = false,
}: {
  clientId: string;
  printButton?: boolean;
}) {
  if (printButton) {
    return <button className="button button-outline" onClick={() => window.print()}><QrCode size={15} /> Save or print</button>;
  }

  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/r/${encodeURIComponent(clientId)}`;
  return <QRCodeSVG value={reportUrl} size={48} level="M" aria-label="QR code for client reflection" />;
}
