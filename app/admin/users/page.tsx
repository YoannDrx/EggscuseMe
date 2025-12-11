import {
  NeoTabs,
  NeoTabsList,
  NeoTabsTrigger,
  NeoTabsContent,
} from "@/components/neo";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { MailQuestion, Users } from "lucide-react";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { Suspense } from "react";
import { InvitationsStats } from "./_components/invitations-stats";
import { InvitationsTabs } from "./_components/invitations-tabs";
import { getUsersWithStats } from "./_actions/admin-users";
import { UsersList } from "./_components/users-list";

const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
});

export default async function Page(props: PageProps<"/admin/users">) {
  await getRequiredAdmin();

  const { q, page } = await searchParamsCache.parse(props.searchParams);

  const pageSize = 10;
  const { users, total } = await getUsersWithStats({
    page,
    pageSize,
    search: q || undefined,
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Utilisateurs</LayoutTitle>
      </LayoutHeader>

      <LayoutContent>
        <NeoTabs defaultValue="users" className="space-y-6">
          <NeoTabsList>
            <NeoTabsTrigger value="users" className="gap-2">
              <Users className="size-4" />
              Utilisateurs
            </NeoTabsTrigger>
            <NeoTabsTrigger value="invitations" className="gap-2">
              <MailQuestion className="size-4" />
              Invitations
            </NeoTabsTrigger>
          </NeoTabsList>

          <NeoTabsContent value="users">
            <UsersList
              users={users}
              total={total}
              limit={pageSize}
              currentPage={page}
            />
          </NeoTabsContent>

          <NeoTabsContent value="invitations" className="space-y-6">
            <Suspense fallback={<div>Chargement des stats...</div>}>
              <InvitationsStats />
            </Suspense>
            <InvitationsTabs />
          </NeoTabsContent>
        </NeoTabs>
      </LayoutContent>
    </Layout>
  );
}
