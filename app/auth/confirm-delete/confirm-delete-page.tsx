"use client";

import { NeoAvatar } from "@/components/neo/neo-avatar";
import { NeoButton } from "@/components/neo/neo-button";
import {
  NeoCard,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
} from "@/components/neo/neo-card";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ConfirmDeletePage({
  token,
  callbackUrl = "/auth/goodbye",
}: {
  token?: string;
  callbackUrl?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmDeleteMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Invalid token");
      }
      return unwrapSafePromise(
        authClient.deleteUser({
          token,
        }),
      );
    },
    onError: (error) => {
      setError(error.message);
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push(callbackUrl);
    },
  });

  const handleConfirmDelete = () => {
    setIsLoading(true);
    confirmDeleteMutation.mutate();
  };

  const handleCancel = () => {
    router.push("/fridge");
  };

  if (!token) {
    router.push("/fridge");
    return null;
  }

  return (
    <NeoCard
      variant="elevated"
      className="mx-auto w-full max-w-md"
      padding="lg"
    >
      <NeoCardHeader>
        <div className="flex justify-center">
          <NeoAvatar
            fallback="CD"
            size="lg"
            shape="square"
            className="flex items-center justify-center"
          >
            <Trash2 className="text-destructive size-6" />
          </NeoAvatar>
        </div>
        <NeoCardHeader className="text-center">
          Confirm Account Deletion
        </NeoCardHeader>

        <NeoCardDescription className="text-center">
          Are you sure you want to delete your account? This action is permanent
          and cannot be undone.
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardFooter className="border-t-neo-border border-t-[length:var(--border-neo)] pt-6">
        {error && <div className="text-destructive mb-4">{error}</div>}
        <div className="flex w-full gap-4">
          <NeoButton
            loading={isLoading || confirmDeleteMutation.isPending}
            variant="destructive"
            onClick={handleConfirmDelete}
            className="flex-1"
          >
            Yes, Delete My Account
          </NeoButton>
          <NeoButton
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </NeoButton>
        </div>
      </NeoCardFooter>
    </NeoCard>
  );
}
