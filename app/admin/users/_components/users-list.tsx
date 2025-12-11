"use client";

import { AutomaticPagination } from "@/components/nowts/automatic-pagination";
import {
  NeoAvatar,
  NeoBadge,
  NeoButton,
  NeoInput,
  NeoDropdown,
  NeoDropdownContent,
  NeoDropdownItem,
  NeoDropdownSeparator,
  NeoDropdownTrigger,
  NeoTable,
  NeoTableBody,
  NeoTableCell,
  NeoTableHead,
  NeoTableHeader,
  NeoTableRow,
} from "@/components/neo";
import { authClient } from "@/lib/auth-client";
import { dayjs } from "@/lib/dayjs";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import {
  Ban,
  CheckCircle2,
  Crown,
  MoreHorizontal,
  Search,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import type { UserWithStats } from "../_actions/admin-users";

type UsersListProps = {
  users: UserWithStats[];
  total: number;
  limit: number;
  currentPage: number;
};

export function UsersList({
  users,
  total,
  limit,
  currentPage,
}: UsersListProps) {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, throttleMs: 1000 }),
  );

  const totalPages = Math.ceil(total / limit);

  const banUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return unwrapSafePromise(
        authClient.admin.banUser({
          userId,
          banReason: "Admin initiated ban",
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("User has been banned");
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return unwrapSafePromise(
        authClient.admin.unbanUser({
          userId,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("User has been unbanned");
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
      return unwrapSafePromise(
        authClient.admin.setRole({
          userId,
          role,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("User role has been updated");
    },
  });

  const impersonateUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return unwrapSafePromise(
        authClient.admin.impersonateUser({
          userId,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Now impersonating user");
      window.location.href = "/fridge";
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-neo-card border-neo-border/20 overflow-hidden rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] shadow-[var(--shadow-neo-md)]">
        <div className="border-neo-border/20 border-b-[length:var(--border-neo)] p-4">
          <div className="relative">
            <NeoInput
              placeholder="Search users by email..."
              value={query}
              onChange={(e) => void setQuery(e.target.value)}
              className="pl-10"
            />
            <Search
              aria-hidden="true"
              className="text-neo-text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <NeoTable variant="ghost">
            <NeoTableHeader>
              <NeoTableRow>
                <NeoTableHead>User</NeoTableHead>
                <NeoTableHead>Role</NeoTableHead>
                <NeoTableHead>Status</NeoTableHead>
                <NeoTableHead>Joined</NeoTableHead>
                <NeoTableHead className="w-[100px]">Actions</NeoTableHead>
              </NeoTableRow>
            </NeoTableHeader>
            <NeoTableBody>
              {users.map((user) => (
                <NeoTableRow key={user.id}>
                  <NeoTableCell>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex items-center gap-3"
                    >
                      <NeoAvatar
                        src={user.image ?? undefined}
                        alt={user.name}
                        fallback={user.name.charAt(0) || "U"}
                      />
                      <div>
                        <div className="text-neo-text font-medium">
                          {user.name}
                        </div>
                        <div className="text-neo-text-muted text-sm">
                          {user.email}
                        </div>
                      </div>
                    </Link>
                  </NeoTableCell>
                  <NeoTableCell>
                    <NeoBadge variant="outline">{user.role ?? "user"}</NeoBadge>
                  </NeoTableCell>
                  <NeoTableCell>
                    {user.banned ? (
                      <NeoBadge variant="outline" className="gap-1.5">
                        <span
                          className="size-1.5 rounded-full bg-red-500"
                          aria-hidden="true"
                        />
                        Banned
                      </NeoBadge>
                    ) : (
                      <NeoBadge variant="outline" className="gap-1.5">
                        <span
                          className="size-1.5 rounded-full bg-emerald-500"
                          aria-hidden="true"
                        />
                        Active
                      </NeoBadge>
                    )}
                  </NeoTableCell>
                  <NeoTableCell>{dayjs(user.createdAt).fromNow()}</NeoTableCell>
                  <NeoTableCell>
                    <NeoDropdown>
                      <NeoDropdownTrigger>
                        <NeoButton
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Open actions menu"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </NeoButton>
                      </NeoDropdownTrigger>
                      <NeoDropdownContent align="end">
                        {!user.banned && (
                          <NeoDropdownItem
                            onClick={async () => {
                              await impersonateUserMutation.mutateAsync({
                                userId: user.id,
                              });
                            }}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            Impersonate
                          </NeoDropdownItem>
                        )}
                        {user.role !== "admin" && (
                          <NeoDropdownItem
                            onClick={async () => {
                              await setRoleMutation.mutateAsync({
                                userId: user.id,
                                role: "admin",
                              });
                            }}
                          >
                            <Crown className="mr-2 h-4 w-4" />
                            Make Admin
                          </NeoDropdownItem>
                        )}
                        {user.role === "admin" && (
                          <NeoDropdownItem
                            onClick={async () => {
                              await setRoleMutation.mutateAsync({
                                userId: user.id,
                                role: "user",
                              });
                            }}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            Make Regular User
                          </NeoDropdownItem>
                        )}
                        <NeoDropdownSeparator />
                        {user.banned ? (
                          <NeoDropdownItem
                            onClick={async () => {
                              await unbanUserMutation.mutateAsync({
                                userId: user.id,
                              });
                            }}
                            className="text-green-600"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Unban User
                          </NeoDropdownItem>
                        ) : (
                          <NeoDropdownItem
                            onClick={async () => {
                              await banUserMutation.mutateAsync({
                                userId: user.id,
                              });
                            }}
                            className="text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban User
                          </NeoDropdownItem>
                        )}
                      </NeoDropdownContent>
                    </NeoDropdown>
                  </NeoTableCell>
                </NeoTableRow>
              ))}
              {users.length === 0 && (
                <NeoTableRow>
                  <NeoTableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </NeoTableCell>
                </NeoTableRow>
              )}
            </NeoTableBody>
          </NeoTable>
        </div>
      </div>

      {totalPages > 1 && (
        <AutomaticPagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchParam={query}
          paramName="page"
        />
      )}
    </div>
  );
}
