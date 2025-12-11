import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NeoBadge } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UserDetailsCard } from "../../_components/user-details-card";
import { UserActions } from "./_components/user-actions";
import { UserProviders } from "./_components/user-providers";
import { UserSessions } from "./_components/user-sessions";
import { UserStatsSection } from "./_components/user-stats-section";

export default async function Page(props: PageProps<"/admin/users/[userId]">) {
  return (
    <Suspense fallback={null}>
      <RoutePage {...props} />
    </Suspense>
  );
}

async function RoutePage(props: PageProps<"/admin/users/[userId]">) {
  const params = await props.params;
  await getRequiredAdmin();

  const userData = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      ownedFridge: true,
      userSubscription: true,
      accounts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!userData) {
    notFound();
  }

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>User Details</LayoutTitle>
        <LayoutDescription>
          View and manage user information and subscription
        </LayoutDescription>
      </LayoutHeader>
      <LayoutActions>
        <UserActions user={userData} />
      </LayoutActions>

      <LayoutContent className="flex flex-col gap-4">
        <UserDetailsCard user={userData} />
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle>Fridge & Subscription</NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            {!userData.ownedFridge ? (
              <div className="text-muted-foreground py-4 text-center">
                No fridge found
              </div>
            ) : (
              <ItemGroup>
                <Item variant="outline" size="sm">
                  <ItemMedia variant="image">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={undefined}
                        alt={userData.ownedFridge.name}
                      />
                      <AvatarFallback className="text-sm">
                        {userData.ownedFridge.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{userData.ownedFridge.name}</ItemTitle>
                    <ItemDescription>
                      Created:{" "}
                      {userData.ownedFridge.createdAt.toLocaleDateString()}
                      {userData.userSubscription && (
                        <>
                          {" • "}
                          <NeoBadge
                            variant={
                              userData.userSubscription.status === "active"
                                ? "default"
                                : userData.userSubscription.status ===
                                    "canceled"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {userData.userSubscription.plan}
                            {userData.userSubscription.status &&
                              ` (${userData.userSubscription.status})`}
                          </NeoBadge>
                        </>
                      )}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            )}
          </NeoCardContent>
        </NeoCard>

        <UserStatsSection userId={userData.id} />
        <UserSessions userId={userData.id} />
        <UserProviders accounts={userData.accounts} />
      </LayoutContent>
    </Layout>
  );
}
