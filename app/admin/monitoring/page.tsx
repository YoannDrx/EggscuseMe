import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { MessageSquare, ScrollText } from "lucide-react";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { Suspense } from "react";
import { FeedbackFilters } from "./_components/feedback-filters";
import { FeedbackTable } from "./_components/feedback-table";
import { LogsStats } from "./_components/logs-stats";
import { LogsTable } from "./_components/logs-table";

const feedbackSearchParams = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
};

const searchParamsCache = createSearchParamsCache(feedbackSearchParams);

type MonitoringPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default function Page(props: MonitoringPageProps) {
  return (
    <Suspense fallback={null}>
      <MonitoringPage {...props} />
    </Suspense>
  );
}

async function MonitoringPage({ searchParams }: MonitoringPageProps) {
  await getRequiredAdmin();
  const params = await searchParamsCache.parse(searchParams);

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Monitoring</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="logs" className="gap-2">
              <ScrollText className="size-4" />
              Logs d&apos;audit
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="size-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            <Suspense fallback={<div>Chargement des stats...</div>}>
              <LogsStats />
            </Suspense>
            <LogsTable />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <FeedbackFilters />
            <Suspense fallback={<FeedbackTableSkeleton />}>
              <FeedbackTable searchParams={params} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </LayoutContent>
    </Layout>
  );
}

function FeedbackTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
