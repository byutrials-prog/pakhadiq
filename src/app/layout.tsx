import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Serverless Odyssey",
  description:
    "Aplikasi manajemen tugas serverless modern berbasis Next.js 16 App Router, Tailwind CSS, dan Shadcn UI.",
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