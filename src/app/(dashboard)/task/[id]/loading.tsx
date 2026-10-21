// 1. Loading UI: src/app/(dashboard)/tasks/[id]/loading.tsx
export default function TaskDetailLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-1/3 bg-muted rounded-lg" />
      <div className="h-32 bg-muted rounded-2xl" />
    </div>
  );
}

// 2. Dynamic Page: src/app/(dashboard)/tasks/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // PENTING: Di Next.js 16, params adalah Promise asinkron
  const { id } = await params;

  if (id !== "1" && id !== "2") {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/tasks" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tugas
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">ID Tugas: #{id}</Badge>
            <Badge>Next.js 16 Async Params</Badge>
          </div>
          <CardTitle className="text-xl mt-2">Detail Modul Perkuliahan #{id}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          Halaman ini membuktikan cara kerja Dynamic Route [id] dengan async params dan streaming React Suspense otomatis via loading.tsx.
        </CardContent>
      </Card>
    </div>
  );
}