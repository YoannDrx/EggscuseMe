import { buttonVariants } from "@/components/ui/button";
import { getOrgEggBoxesAction } from "@/features/eggs";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { Timer } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EggBoxGrid } from "./egg-box-grid";
import { EggStatsCards } from "./egg-stats-cards";

export default function Page(props: PageProps<"/orgs/[orgSlug]">) {
  return (
    <Suspense fallback={null}>
      <RoutePage {...props} />
    </Suspense>
  );
}

async function RoutePage(props: PageProps<"/orgs/[orgSlug]">) {
  const params = await props.params;
  const result = await getOrgEggBoxesAction();
  const eggBoxes = result.data?.eggBoxes ?? [];

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>My Fridge</LayoutTitle>
        <LayoutDescription>
          Track your eggs and reduce food waste
        </LayoutDescription>
      </LayoutHeader>
      <LayoutActions>
        <Link
          href={`/orgs/${params.orgSlug}/timer`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Timer className="mr-2 size-4" />
          Cooking Timer
        </Link>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-4 lg:gap-8">
        <Suspense
          fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}
        >
          <EggStatsCards />
        </Suspense>
        <EggBoxGrid eggBoxes={eggBoxes} />
      </LayoutContent>
    </Layout>
  );
}
