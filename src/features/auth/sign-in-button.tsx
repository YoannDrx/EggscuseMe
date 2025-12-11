"use client";

import { NeoAvatar, NeoButton } from "@/components/neo";
import { useIsClient } from "@/hooks/use-is-client";
import Link from "next/link";
import { UserDropdown } from "./user-dropdown";

const useHref = () => {
  const isClient = useIsClient();

  if (!isClient) {
    return "";
  }

  const pathname = window.location.pathname;

  return pathname;
};

export const SignInButton = () => {
  const href = useHref();
  const callbackUrl = href === "/" ? "/fridge" : href;

  return (
    <NeoButton asChild size="sm" variant="outline">
      <Link href={`/auth/signin?callbackUrl=${callbackUrl}`}>Sign in</Link>
    </NeoButton>
  );
};

export const LoggedInButton = ({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) => {
  return (
    <UserDropdown>
      <button className="group size-9 rounded-full">
        <NeoAvatar
          src={user.image ?? undefined}
          alt={user.name ?? "User"}
          fallback={user.email?.slice(0, 1).toUpperCase() ?? "U"}
          size="sm"
          className="size-full group-active:scale-95"
        />
      </button>
    </UserDropdown>
  );
};
