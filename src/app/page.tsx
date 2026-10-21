import Link from "next/link";
import { ArrowRight, Cpu, Globe, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-center">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl"
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        {/* Week badge */}
        <Badge
          id="hero-week-badge"
          variant="secondary"
          className="gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide uppercase"
        >
          <Zap className="h-3 w-3 text-amber-500" />
          The Serverless Odyssey • Minggu 02
        </Badge>

        {/* Headline */}
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
          Kelola Tugas Kuliah{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Tanpa Batas
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Dibangun di atas{" "}
          <span className="font-semibold text-foreground">Next.js 16 App Router</span>,{" "}
          <span className="font-semibold text-foreground">React Server Components</span>, dan{" "}
          <span className="font-semibold text-foreground">Shadcn UI</span> — arsitektur serverless
          yang merespons instan dengan nol JavaScript berlebih ke browser.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          {[
            { icon: Cpu, label: "RSC — 0 KB JS" },
            { icon: Globe, label: "Dynamic Routes" },
            { icon: Zap, label: "Streaming Suspense" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1"
            >
              <Icon className="h-3 w-3" />
              {label}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/tasks" id="cta-button" className="mt-2">
          <Button
            size="lg"
            className="group gap-2 rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:gap-3 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Mulai Eksplorasi
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        {/* Decorative bottom label */}
        <p className="text-xs text-muted-foreground/60">
          Tidak ada server. Tidak ada batas. Hanya kecepatan.
        </p>
      </div>
    </div>
  );
}
