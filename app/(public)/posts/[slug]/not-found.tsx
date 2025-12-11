import { NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";
import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="bg-neo-bg flex min-h-[60vh] items-center justify-center px-4">
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
          "max-w-md p-8 text-center shadow-[var(--shadow-neo-lg)]",
        )}
      >
        <div
          className={cn(
            "border-neo-border bg-neo-accent/10",
            "mx-auto mb-6 flex size-16 items-center justify-center",
            "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
          )}
        >
          <FileQuestion className="text-neo-accent size-8" />
        </div>
        <h1 className="font-heading text-neo-text mb-2 text-2xl font-bold">
          404 - Article introuvable
        </h1>
        <p className="text-neo-text-muted mb-6">
          L&apos;article que vous recherchez n&apos;existe pas ou a été
          supprimé.
        </p>
        <NeoButton asChild>
          <Link href="/posts" className="gap-2">
            <ArrowLeft className="size-4" />
            Retour au blog
          </Link>
        </NeoButton>
      </div>
    </div>
  );
}
