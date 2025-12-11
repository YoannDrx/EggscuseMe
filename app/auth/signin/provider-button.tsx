import { Logo } from "@/components/nowts/logo";
import { NeoBadge } from "@/components/neo/neo-badge";
import { NeoButton } from "@/components/neo/neo-button";
import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

const ProviderData: Record<string, { icon: ReactNode; name: string }> = {
  github: {
    icon: <Logo name="github" size={16} />,
    name: "Github",
  },
  google: {
    icon: <Logo name="google" size={16} />,
    name: "Google",
  },
};

type ProviderButtonProps = {
  providerId: "github" | "google";
  callbackUrl?: string;
};

export const ProviderButton = (props: ProviderButtonProps) => {
  const { data: lastUsedProvider } = useQuery({
    queryKey: ["lastUsedLoginMethod"],
    queryFn: async () => {
      const lastUsed = await authClient.getLastUsedLoginMethod();
      return lastUsed ?? null;
    },
    initialData: null,
    staleTime: Infinity,
  });

  const githubSignInMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: props.providerId,
        callbackURL: getCallbackUrl(props.callbackUrl ?? "/fridge"),
      });
    },
  });

  const data = ProviderData[props.providerId];

  const isLastUsed = lastUsedProvider === props.providerId;

  return (
    <div className="relative w-full">
      {isLastUsed && (
        <NeoBadge
          variant="secondary"
          className="absolute -top-2.5 -right-2.5 z-10"
        >
          Last used
        </NeoBadge>
      )}
      <NeoButton
        loading={githubSignInMutation.isPending}
        className={cn("w-full", {
          "text-neo-text border-neo-border bg-white hover:bg-white/90":
            data.name === "Google",
          "bg-neo-text text-neo-bg border-neo-border hover:bg-neo-text/90":
            data.name === "Github",
        })}
        size="lg"
        onClick={() => {
          githubSignInMutation.mutate();
        }}
      >
        {data.icon}
        <span className="ml-2">Sign in with {data.name}</span>
      </NeoButton>
    </div>
  );
};
