import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Katalog UMKM",
  description: "Jelajahi produk pilihan dari usaha lokal dan hubungi pemiliknya secara langsung.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}