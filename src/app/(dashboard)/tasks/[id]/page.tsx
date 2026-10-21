import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Star, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Berjalan" | "Selesai";
  xp: number;
  category: string;
  detail: string;
}

const TASK_DATA: Record<string, Task> = {
  "1": {
    id: "1",
    title: "Setup Database PostgreSQL Supabase",
    description: "Konfigurasi koneksi Supabase, buat skema tabel, dan uji Row Level Security.",
    status: "Selesai",
    xp: 150,
    category: "Backend",
    detail:
      "Modul ini mencakup pembuatan proyek Supabase, konfigurasi environment variable, desain skema relasional untuk tabel users dan tasks, pengaturan Row Level Security (RLS) agar data pengguna terisolasi, serta pengujian koneksi menggunakan Supabase JS client dari Next.js Server Component.",
  },
  "2": {
    id: "2",
    title: "Rancang Layout Dashboard dengan Shadcn",
    description: "Implementasi komponen Card, Badge, Button, dan navigasi responsif.",
    status: "Berjalan",
    xp: 200,
    category: "Frontend",
    detail:
      "Modul ini meliputi inisialisasi Shadcn UI dengan konfigurasi Tailwind CSS v4, pembuatan komponen navigasi sticky glassmorphism, implementasi sistem tema gelap/terang berbasis CSS variables, serta penyusunan layout dashboard responsif menggunakan Next.js App Router Route Groups.",
  },
  "3": {
    id: "3",
    title: "Integrasi API Edge Functions Vercel",
    description: "Buat endpoint serverless untuk operasi CRUD menggunakan Vercel Edge Runtime.",
    status: "Berjalan",
    xp: 250,
    category: "API",
    detail:
      "Modul ini membahas pembuatan Route Handlers di Next.js 16 yang berjalan di Vercel Edge Runtime, implementasi operasi GET, POST, PATCH, dan DELETE untuk resource tugas, penanganan error dengan respons JSON terstandar, serta pengujian endpoint menggunakan Thunder Client.",
  },
  "4": {
    id: "4",
    title: "Deploy Pipeline CI/CD GitHub Actions",
    description: "Otomasi proses build, test, dan deploy ke Vercel pada setiap push ke main.",
    status: "Selesai",
    xp: 175,
    category: "DevOps",
    detail:
      "Modul ini mencakup konfigurasi workflow GitHub Actions dengan job build dan test paralel, integrasi Vercel CLI untuk preview deployment pada setiap pull request, penambahan langkah linting ESLint dan type-check TypeScript, serta notifikasi status deploy otomatis.",
  },
};

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 16: params is an async Promise
  const { id } = await params;

  const task = TASK_DATA[id];
  if (!task) notFound();

  const isDone = task.status === "Selesai";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb */}
      <Link
        href="/tasks"
        id="back-to-tasks"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Kembali ke Daftar Tugas
      </Link>

      {/* Main Card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="p-6 pb-4">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="gap-1.5 text-xs rounded-full font-medium">
              <Tag className="h-3 w-3" />
              {task.category}
            </Badge>
            <Badge variant="outline" className="text-xs rounded-full text-muted-foreground">
              ID Tugas: #{task.id}
            </Badge>
            <Badge
              className={
                isDone
                  ? "gap-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs rounded-full"
                  : "gap-1.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs rounded-full"
              }
            >
              {isDone ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              {task.status}
            </Badge>
          </div>

          <CardTitle className="text-xl font-black tracking-tight leading-snug">
            {task.title}
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        </CardHeader>

        <Separator className="mx-6 w-auto" />

        <CardContent className="p-6 pt-4 space-y-4">
          {/* Detail Description */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Detail Modul</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{task.detail}</p>
          </div>

          <Separator />

          {/* Footer meta */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Next.js 16</span> — Async Params
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />+{task.xp} XP Reward
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech badge */}
      <p className="text-xs text-muted-foreground/60 text-center">
        Halaman ini dirender sebagai React Server Component dengan Dynamic Route{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">/tasks/[id]</code> dan async params.
      </p>
    </div>
  );
}
