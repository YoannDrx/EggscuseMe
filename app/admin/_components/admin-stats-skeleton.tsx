import { NeoSkeleton } from "@/components/neo";

export function AdminStatsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          data-slot="neo-stat-card"
          className="bg-neo-card border-neo-border/20 flex flex-col gap-2 rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)] p-5 shadow-[var(--shadow-neo-md)]"
        >
          <div className="flex items-start justify-between">
            <NeoSkeleton className="h-3 w-24" />
            <NeoSkeleton className="size-5" />
          </div>
          <NeoSkeleton className="h-8 w-32" />
          <NeoSkeleton className="h-3 w-40" />
        </div>
      ))}
    </>
  );
}
