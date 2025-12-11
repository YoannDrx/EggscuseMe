"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type NeoCalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  locale?: string;
};

const DAYS_SHORT = ["L", "M", "M", "J", "V", "S", "D"];

const NeoCalendar = ({
  value,
  onChange,
  className,
  locale = "fr-FR",
}: NeoCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(value ?? new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Get the day of week for the first day (0 = Sunday, adjust for Monday start)
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Generate calendar days
  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      day === value.getDate() &&
      month === value.getMonth() &&
      year === value.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    onChange?.(selectedDate);
  };

  const navigateMonth = (direction: -1 | 1) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const monthName = currentDate.toLocaleDateString(locale, { month: "long" });

  return (
    <div
      data-slot="neo-calendar"
      className={cn(
        "bg-neo-card",
        "border-neo-border/20 border-[length:var(--border-neo)]",
        "rounded-[var(--radius-neo-2xl)]",
        "shadow-[var(--shadow-neo-sm)]",
        "p-4",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-neo-text font-black uppercase">
          {monthName} {year}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className={cn(
              "border-neo-border/30 rounded-lg border-[length:var(--border-neo)] p-1",
              "hover:bg-neo-bg transition-colors",
            )}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} className="text-neo-text" />
          </button>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className={cn(
              "border-neo-border/30 rounded-lg border-[length:var(--border-neo)] p-1",
              "hover:bg-neo-bg transition-colors",
            )}
            aria-label="Next month"
          >
            <ChevronRight size={16} className="text-neo-text" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center">
        {DAYS_SHORT.map((day, i) => (
          <span key={i} className="text-neo-text-muted text-xs font-bold">
            {day}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day !== null && (
              <button
                type="button"
                onClick={() => handleDayClick(day)}
                className={cn(
                  "flex size-full items-center justify-center rounded-lg text-sm font-bold",
                  "transition-colors",
                  isToday(day) &&
                    !isSelected(day) && [
                      "bg-neo-accent",
                      "border-neo-border border-[length:var(--border-neo)]",
                    ],
                  isSelected(day) && [
                    "bg-stone-800 text-white",
                    "border-neo-border border-[length:var(--border-neo)]",
                  ],
                  !isToday(day) &&
                    !isSelected(day) && ["text-neo-text", "hover:bg-neo-bg"],
                )}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { NeoCalendar };
