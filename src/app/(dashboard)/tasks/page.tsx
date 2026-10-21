import Link from "next/link";
import { CheckCircle2, Clock, ListTodo, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatusFilter } from "@/components/task-status-filter";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Berjalan" | "Selesai";
  xp: number;
  category: string;
}

const TASKS: Task[] = [
  {
    id: "1",
    title: "Setup Database PostgreSQL Supabase",
    description: "Konfigurasi koneksi Supabase, buat skema tabel, dan uji Row Level Security.",
    status: "Selesai",
    xp: 150,
    category: "Backend",
  },
  {
    id: "2",
    title: "Rancang Layout Dashboard dengan Shadcn",
    description: "Implementasi komponen Card, Badge, Button, dan navigasi responsif.",
    status: "Berjalan",
    xp: 200,
    category: "Frontend",
  },
  {
    id: "3",
    title: "Integrasi API Edge Functions Vercel",
    description: "Buat endpoint serverless untuk operasi CRUD menggunakan Vercel Edge Runtime.",
    status: "Berjalan",
    xp: 250,
    category: "API",
  },
  {
    id: "4",
    title: "Deploy Pipeline CI/CD GitHub Actions",
    description: "Otomasi proses build, test, dan deploy ke Vercel pada setiap push ke main.",
    status: "Selesai",
    xp: 175,
    category: "DevOps",
  },
];

const totalXP = TASKS.reduce((sum, t) => sum + t.xp, 0);
const doneCount = TASKS.filter((t) => t.status === "Selesai").length;
const runningCount = TASKS.filter((t) => t.status === "Berjalan").length;
const completionRate = Math.round((doneCount / TASKS.length) * 100);

interface MetricCard {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  gradient: string;
}

const METRICS: MetricCard[] = [
  {
    label: "Total Tugas",
    value: TASKS.length,
    sub: `${totalXP} XP tersedia`,
    icon: <ListTodo className="h-5 w-5" />,
    gradient: "from-indigo-500/15 to-indigo-500/5 dark:from-indigo-500/20",
  },
  {
    label: "Sedang Berjalan",
    value: runningCount,
    sub: "Dalam pengerjaan",
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    gradient: "from-amber-500/15 to-amber-500/5 dark:from-amber-500/20",
  },
  {
    label: "Selesai",
    value: `${doneCount} / ${TASKS.length}`,
    sub: `${completionRate}% capaian`,
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    gradient: "from-emerald-500/15 to-emerald-500/5 dark:from-emerald-500/20",
  },
];

export default async function TasksPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Daftar Tugas Serverless</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pantau dan kelola progres tugas kuliah Anda secara real-time.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {METRICS.map(({ label, value, sub, icon, gradient }) => (
          <Card
            key={label}
            className={`bg-gradient-to-br ${gradient} border-border/60 shadow-sm`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <div className="rounded-lg bg-background/60 p-1.5 shadow-sm">{icon}</div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-black tracking-tight">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <TaskStatusFilter />
        <Button id="add-task-button" size="sm" className="gap-1.5 rounded-full">
          <Plus className="h-4 w-4" />
          Tambah Tugas
        </Button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TASKS.map((task) => (
          <Link key={task.id} href={`/tasks/${task.id}`} id={`task-card-${task.id}`}>
            <Card className="group cursor-pointer border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 hover:shadow-primary/10">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                    {task.title}
                  </CardTitle>
                  <Badge
                    variant={task.status === "Selesai" ? "default" : "secondary"}
                    className={
                      task.status === "Selesai"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 shrink-0"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-medium rounded-full">
                    {task.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500" />+{task.xp} XP
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
