"use client";

import { cn } from "@/lib/utils";

export type NeoTimelineItem = {
  date: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export type NeoTimelineProps = {
  items: NeoTimelineItem[];
  className?: string;
};

const NeoTimeline = ({ items, className }: NeoTimelineProps) => {
  if (items.length === 0) return null;

  return (
    <div data-slot="neo-timeline" className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center">
            {/* Dot */}
            <div
              className={cn(
                "size-3 shrink-0 rounded-full",
                "bg-neo-accent",
                "border-neo-border border-[length:var(--border-neo)]",
              )}
            />
            {/* Line */}
            {index !== items.length - 1 && (
              <div className={cn("my-1 w-0.5 flex-1", "bg-neo-border/30")} />
            )}
          </div>

          {/* Content */}
          <div className="pb-6">
            {/* Date */}
            <p className="text-neo-text-muted text-xs font-bold">{item.date}</p>
            {/* Title */}
            <p className="text-neo-text font-bold">{item.title}</p>
            {/* Description */}
            {item.description && (
              <p className="text-neo-text-muted mt-0.5 text-sm">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export { NeoTimeline };
