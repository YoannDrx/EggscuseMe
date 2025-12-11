"use client";

import { NeoButton } from "@/components/neo/neo-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Crown, Eye, MoreHorizontal, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAdminLogAction } from "../../../_actions/admin-logs.action";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
};

type UserActionsProps = {
  user: User;
};

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await unwrapSafePromise(
        authClient.admin.impersonateUser({
          userId,
        }),
      );
      await createAdminLogAction({
        action: "IMPERSONATE",
        targetUserId: userId,
      });
      return result;
    },
    onSuccess: () => {
      toast.success("Impersonation started");
      void queryClient.invalidateQueries();
      window.location.href = "/fridge";
    },
    onError: (error: Error) => {
      toast.error(`Failed to impersonate user: ${error.message}`);
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason?: string;
    }) => {
      const result = await unwrapSafePromise(
        authClient.admin.banUser({
          userId,
          banReason: reason ?? "Banned by admin",
        }),
      );
      await createAdminLogAction({
        action: "BAN_USER",
        targetUserId: userId,
        metadata: { reason: reason ?? "Banned by admin" },
      });
      return result;
    },
    onSuccess: () => {
      toast.success("User banned successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to ban user: ${error.message}`);
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await unwrapSafePromise(
        authClient.admin.unbanUser({
          userId,
        }),
      );
      await createAdminLogAction({
        action: "UNBAN_USER",
        targetUserId: userId,
      });
      return result;
    },
    onSuccess: () => {
      toast.success("User unbanned successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to unban user: ${error.message}`);
    },
  });

  const setRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "admin" | "user";
    }) => {
      const result = await unwrapSafePromise(
        authClient.admin.setRole({
          userId,
          role,
        }),
      );
      await createAdminLogAction({
        action: "SET_ROLE",
        targetUserId: userId,
        metadata: { role },
      });
      return result;
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NeoButton variant="outline">
          <MoreHorizontal className="mr-2 size-4" />
          Actions
        </NeoButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!user.banned && (
          <DropdownMenuItem
            onClick={() => impersonateMutation.mutate(user.id)}
            disabled={impersonateMutation.isPending}
          >
            <Eye className="mr-2 size-4" />
            Impersonate User
          </DropdownMenuItem>
        )}

        {user.role !== "admin" && (
          <DropdownMenuItem
            onClick={() =>
              setRoleMutation.mutate({
                userId: user.id,
                role: "admin" as const,
              })
            }
            disabled={setRoleMutation.isPending}
          >
            <Crown className="mr-2 size-4" />
            Make Admin
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {user.banned ? (
          <DropdownMenuItem
            onClick={() => unbanUserMutation.mutate(user.id)}
            disabled={unbanUserMutation.isPending}
          >
            <UserCheck className="mr-2 size-4" />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => banUserMutation.mutate({ userId: user.id })}
            disabled={banUserMutation.isPending}
            className="text-destructive focus:text-destructive"
          >
            <Ban className="mr-2 size-4" />
            Ban User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
