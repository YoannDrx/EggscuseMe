import { Typography } from "@/components/nowts/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NeoBadge } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";

type UserDetailsCardProps = {
  user: {
    name: string | null;
    email: string | null;
    image?: string | null;
    role?: string | null;
    emailVerified?: boolean | null;
    banned?: boolean | null;
    createdAt: Date | string;
  };
};

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <NeoCard>
      <NeoCardHeader className="flex items-center gap-2 space-y-0">
        <Avatar className="mr-2 size-10">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>{user.name?.charAt(0) ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <NeoCardTitle>{user.name ?? "No name"}</NeoCardTitle>
          <NeoCardDescription>{user.email}</NeoCardDescription>
        </div>
      </NeoCardHeader>
      <NeoCardContent className="flex items-center gap-4">
        <NeoBadge variant="outline">{user.role ?? "user"}</NeoBadge>
        {!user.emailVerified && (
          <>
            <Typography variant="muted" className="text-sm">
              {" • "}
            </Typography>
            <NeoBadge variant="outline">Unverified</NeoBadge>
          </>
        )}
        {user.banned && (
          <>
            <Typography variant="muted" className="text-sm">
              {" • "}
            </Typography>
            <NeoBadge variant="destructive">Banned</NeoBadge>
          </>
        )}
        <Typography variant="muted" className="text-sm">
          {" • "}
        </Typography>
        <Typography variant="muted" className="text-sm">
          Created: {new Date(user.createdAt).toLocaleDateString()}
        </Typography>
      </NeoCardContent>
    </NeoCard>
  );
}
