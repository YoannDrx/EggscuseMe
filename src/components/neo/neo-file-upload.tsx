"use client";

import { UploadCloud, X, FileIcon, ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

export type NeoFileUploadProps = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFilesSelect?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
};

const NeoFileUpload = ({
  label,
  accept,
  multiple = false,
  maxSize,
  onFilesSelect,
  className,
  disabled = false,
}: NeoFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (fileList: FileList): File[] => {
      const validFiles: File[] = [];
      setError(null);

      for (const file of Array.from(fileList)) {
        // Check file size
        if (maxSize && file.size > maxSize) {
          setError(
            `File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`,
          );
          continue;
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [maxSize],
  );

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const validFiles = validateFiles(fileList);

      if (validFiles.length > 0) {
        const newFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(newFiles);
        onFilesSelect?.(newFiles);
      }
    },
    [files, multiple, onFilesSelect, validateFiles],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelect?.(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return ImageIcon;
    }
    return FileIcon;
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="text-neo-text mb-2 ml-1 block text-xs font-black tracking-wider uppercase">
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        data-slot="neo-file-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex h-32 w-full cursor-pointer flex-col items-center justify-center",
          "rounded-[var(--radius-neo-2xl)]",
          "border-[3px] border-dashed",
          isDragging
            ? "border-neo-accent bg-neo-accent/10"
            : "border-neo-border/30 hover:bg-neo-bg/50",
          disabled && "cursor-not-allowed opacity-50",
          "transition-colors",
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <UploadCloud
          size={32}
          className={cn(
            isDragging ? "text-neo-accent" : "text-neo-text-muted",
            "transition-colors",
          )}
        />
        <span className="text-neo-text-muted mt-2 text-sm font-bold">
          {isDragging ? "Drop files here" : "Drag or click to upload"}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-destructive mt-1 ml-1 text-xs font-bold">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            return (
              <div
                key={`${file.name}-${index}`}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-2",
                  "border-neo-border/20 border-[length:var(--border-neo)]",
                  "bg-neo-card",
                )}
              >
                <Icon size={20} className="text-neo-text-muted shrink-0" />
                <span className="text-neo-text flex-1 truncate text-sm font-medium">
                  {file.name}
                </span>
                <span className="text-neo-text-muted shrink-0 text-xs">
                  {(file.size / 1024).toFixed(1)}KB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-neo-text-muted hover:text-destructive shrink-0 p-1"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { NeoFileUpload };
