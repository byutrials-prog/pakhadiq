export default function TaskDetailLoading() {
  return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      {/* Back link skeleton */}
      <div className="h-4 w-36 rounded-full bg-muted" />

      {/* Card skeleton */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
        {/* Badge row */}
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-24 rounded-full bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
        </div>
        {/* Title */}
        <div className="h-7 w-3/4 rounded-lg bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />

        <div className="h-px bg-border my-2" />

        {/* Body */}
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>

        <div className="h-px bg-border my-2" />

        {/* Footer */}
        <div className="flex justify-between">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-6 w-28 rounded-full bg-muted" />
        </div>
      </div>

      <div className="h-3 w-64 mx-auto rounded bg-muted" />
    </div>
  );
}
