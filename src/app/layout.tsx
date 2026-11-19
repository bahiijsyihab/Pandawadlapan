import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PANDAWA — Portal Resmi Pasukan Angkatan 8 MA",
  description:
    "United in Trust, Stronger Together. Portal identitas digital 3D interaktif, direktori 41 anggota, struktur kabinet, serta pusat arsip & etalase karya PANDAWA (Pasukan Angkatan 8 MA).",
  keywords: ["PANDAWA", "Pasukan Angkatan 8 MA", "Portal Angkatan", "Direktori 41 Anggota", "United in Trust Stronger Together"],
};

export const viewport: Viewport = {
  themeColor: "#160A2C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
      </head>
      <body className="font-sans bg-alabaster text-ink antialiased">{children}</body>
    </html>
  );
}
