"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Trash2 } from "lucide-react";
import { useCallback, type ReactNode } from "react";

type SwipeActionProps = {
  children: ReactNode;
  onDelete?: () => void;
  deleteThreshold?: number;
  className?: string;
};

export function SwipeAction({
  children,
  onDelete,
  deleteThreshold = -100,
  className,
}: SwipeActionProps) {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [0, deleteThreshold],
    ["rgba(239, 68, 68, 0)", "rgba(239, 68, 68, 1)"],
  );
  const deleteOpacity = useTransform(
    x,
    [0, deleteThreshold / 2, deleteThreshold],
    [0, 0.5, 1],
  );
  const deleteScale = useTransform(
    x,
    [deleteThreshold / 2, deleteThreshold],
    [0.5, 1],
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < deleteThreshold) {
        onDelete?.();
      }
    },
    [deleteThreshold, onDelete],
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Delete background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end rounded-2xl pr-6"
        style={{ background }}
      >
        <motion.div style={{ opacity: deleteOpacity, scale: deleteScale }}>
          <Trash2 className="text-white" size={24} />
        </motion.div>
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: deleteThreshold, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}
