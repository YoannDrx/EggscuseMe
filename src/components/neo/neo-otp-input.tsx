"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoOTPInputVariants = cva(
  [
    "flex items-center justify-center",
    "rounded-[var(--radius-neo-xl)]",
    "border-[length:var(--border-neo)] border-neo-border/30",
    "bg-neo-input text-neo-text",
    "text-center text-xl font-bold",
    "transition-all duration-200",
    "outline-none",
    // Focus
    "focus:border-neo-accent/50",
    "focus:shadow-[var(--shadow-neo-md)]",
    "focus:-translate-y-0.5",
    // Disabled
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-10 text-lg",
        md: "size-12 text-xl",
        lg: "size-14 text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type NeoOTPInputProps = VariantProps<typeof neoOTPInputVariants> & {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
};

const NeoOTPInput = ({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = false,
  size,
  className,
}: NeoOTPInputProps) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [values, setValues] = React.useState<string[]>(
    value.split("").concat(Array(length - value.length).fill("")),
  );

  // Sync with external value
  React.useEffect(() => {
    const newValues = value
      .split("")
      .concat(Array(length - value.length).fill(""));
    setValues(newValues.slice(0, length));
  }, [value, length]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Handle paste
    if (inputValue.length > 1) {
      const pasteData = inputValue.slice(0, length - index);
      const newValues = [...values];
      for (let i = 0; i < pasteData.length; i++) {
        if (index + i < length && /^\d$/.test(pasteData[i])) {
          newValues[index + i] = pasteData[i];
        }
      }
      setValues(newValues);
      onChange?.(newValues.join(""));

      const nextIndex = Math.min(index + pasteData.length, length - 1);
      focusInput(nextIndex);

      if (newValues.every((v) => v !== "")) {
        onComplete?.(newValues.join(""));
      }
      return;
    }

    // Handle single digit
    if (!/^\d?$/.test(inputValue)) return;

    const newValues = [...values];
    newValues[index] = inputValue;
    setValues(newValues);
    onChange?.(newValues.join(""));

    if (inputValue && index < length - 1) {
      focusInput(index + 1);
    }

    if (newValues.every((v) => v !== "")) {
      onComplete?.(newValues.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!values[index] && index > 0) {
        focusInput(index - 1);
      } else {
        const newValues = [...values];
        newValues[index] = "";
        setValues(newValues);
        onChange?.(newValues.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  return (
    <div
      data-slot="neo-otp-input"
      className={cn("flex items-center gap-2", className)}
    >
      {Array.from({ length }).map((_, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={length - index}
            value={values[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            className={cn(
              neoOTPInputVariants({ size }),
              error && "border-destructive/50 focus:border-destructive",
            )}
            aria-label={`Digit ${index + 1} of ${length}`}
          />
          {/* Separator after 3rd digit (for 6-digit codes) */}
          {length === 6 && index === 2 && (
            <div className="bg-neo-border/30 h-0.5 w-3 rounded-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { NeoOTPInput, neoOTPInputVariants };
