"use client";

import { cn } from "@/lib/utils";

type NeoToggleProps<T extends string> = {
  value: T;
  options: [T, T];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  renderOption?: (option: T, isActive: boolean) => React.ReactNode;
};

export function NeoToggle<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
  className,
  renderOption,
}: NeoToggleProps<T>) {
  const [left, right] = options;
  const isLeft = value === left;

  const handleClick = () => {
    if (disabled) return;
    onChange(isLeft ? right : left);
  };

  const defaultRender = (option: T, isActive: boolean) => (
    <span
      className={cn(
        "text-sm font-bold transition-colors duration-200",
        isActive ? "text-neo-bg" : "text-neo-text-muted",
      )}
    >
      {option}
    </span>
  );

  const render = renderOption ?? defaultRender;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative flex h-10 w-20 items-center overflow-hidden",
        "border-neo-border rounded-full border-[length:var(--border-neo)]",
        "bg-neo-card shadow-[var(--shadow-neo-sm)]",
        "hover:shadow-[var(--shadow-neo-md)]",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        "transition-all duration-200",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {/* Sliding pill - épouse le bord, en arrière-plan */}
      <div
        className={cn(
          "absolute inset-y-0 w-1/2 transition-all duration-300 ease-out",
          "bg-neo-accent rounded-full",
          isLeft ? "left-0" : "left-1/2",
        )}
      />

      {/* Options container - au-dessus du pill */}
      <div className="relative z-10 grid h-full w-full grid-cols-2">
        <div className="flex items-center justify-center">
          {render(left, isLeft)}
        </div>
        <div className="flex items-center justify-center">
          {render(right, !isLeft)}
        </div>
      </div>
    </button>
  );
}
