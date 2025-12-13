"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react";
import { Trash2 } from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";

const SWIPE_THRESHOLD = 80;
const ACTION_WIDTH = 80;

export type SwipeAction = {
  /** Icon to display */
  icon: ReactNode;
  /** Action label (for accessibility) */
  label: string;
  /** Background color class */
  bgColor: string;
  /** Callback when action is triggered */
  onAction: () => void;
};

export type SwipeableRowProps = {
  /** Row content */
  children: ReactNode;
  /** Action to show on left swipe */
  leftAction?: SwipeAction;
  /** Action to show on right swipe (defaults to delete) */
  rightAction?: SwipeAction;
  /** Callback when delete action is triggered (shorthand for rightAction) */
  onDelete?: () => void;
  /** Disable swipe */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
};

/**
 * Swipeable row component for lists
 * - Swipe left to reveal action (e.g., delete)
 * - Spring animation on release
 * - Visual feedback during swipe
 */
export function SwipeableRow({
  children,
  leftAction,
  rightAction,
  onDelete,
  disabled = false,
  className,
}: SwipeableRowProps) {
  const [isOpen, setIsOpen] = useState<"left" | "right" | null>(null);
  const x = useMotionValue(0);

  // Transform for action reveal
  const rightActionOpacity = useTransform(x, [-ACTION_WIDTH, 0], [1, 0]);
  const rightActionScale = useTransform(x, [-ACTION_WIDTH, 0], [1, 0.8]);
  const leftActionOpacity = useTransform(x, [0, ACTION_WIDTH], [0, 1]);
  const leftActionScale = useTransform(x, [0, ACTION_WIDTH], [0.8, 1]);

  // Default delete action if onDelete is provided
  const effectiveRightAction = useMemo<SwipeAction | undefined>(() => {
    if (rightAction) return rightAction;
    if (onDelete) {
      return {
        icon: <Trash2 className="size-5" />,
        label: "Supprimer",
        bgColor: "bg-destructive",
        onAction: onDelete,
      };
    }
    return undefined;
  }, [rightAction, onDelete]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const swipe = offset.x + velocity.x * 0.2;

      if (swipe < -SWIPE_THRESHOLD && effectiveRightAction) {
        setIsOpen("right");
      } else if (swipe > SWIPE_THRESHOLD && leftAction) {
        setIsOpen("left");
      } else {
        setIsOpen(null);
      }
    },
    [effectiveRightAction, leftAction],
  );

  const handleActionClick = useCallback((action: SwipeAction) => {
    action.onAction();
    setIsOpen(null);
  }, []);

  const closeSwipe = useCallback(() => {
    setIsOpen(null);
  }, []);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left Action */}
      {leftAction && (
        <motion.button
          type="button"
          className={cn(
            "absolute top-0 bottom-0 left-0 flex items-center justify-center",
            "w-20 text-white",
            leftAction.bgColor,
          )}
          style={{ opacity: leftActionOpacity, scale: leftActionScale }}
          onClick={() => handleActionClick(leftAction)}
          aria-label={leftAction.label}
        >
          {leftAction.icon}
        </motion.button>
      )}

      {/* Right Action */}
      {effectiveRightAction && (
        <motion.button
          type="button"
          className={cn(
            "absolute top-0 right-0 bottom-0 flex items-center justify-center",
            "w-20 text-white",
            effectiveRightAction.bgColor,
          )}
          style={{ opacity: rightActionOpacity, scale: rightActionScale }}
          onClick={() => handleActionClick(effectiveRightAction)}
          aria-label={effectiveRightAction.label}
        >
          {effectiveRightAction.icon}
        </motion.button>
      )}

      {/* Main Content */}
      <motion.div
        drag="x"
        dragConstraints={{
          left: effectiveRightAction ? -ACTION_WIDTH : 0,
          right: leftAction ? ACTION_WIDTH : 0,
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onClick={isOpen ? closeSwipe : undefined}
        animate={{
          x:
            isOpen === "right"
              ? -ACTION_WIDTH
              : isOpen === "left"
                ? ACTION_WIDTH
                : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ x }}
        className="bg-card relative cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>
    </div>
  );
}
