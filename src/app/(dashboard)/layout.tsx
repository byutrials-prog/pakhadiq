import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sticky Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-black text-sm tracking-tight group-hover:opacity-80 transition-opacity">
              CloudTask Pro
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Link
              href="/tasks"
              className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              Tugas
            </Link>
            <Link
              href="/analytics"
              className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              Analitik
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-5" />
            {/* User Avatar */}
            <div
              aria-label="User avatar"
              className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm"
            >
              U
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-4 px-6 text-center text-xs text-muted-foreground">
        The Serverless Odyssey • Next.js 16 App Router
      </footer>
    </div>
  );
}
