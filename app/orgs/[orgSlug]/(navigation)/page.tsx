import { buttonVariants } from "@/components/ui/button";
import { getOrgEggBoxesAction } from "@/features/eggs";
import { Eggy } from "@/features/mascot";
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
        <div className="flex items-center gap-3">
          <Eggy mood="happy" size="md" className="hidden sm:block" />
          <div>
            <LayoutTitle className="font-heading">Mon Frigo</LayoutTitle>
            <LayoutDescription>
              Suivez vos œufs et réduisez le gaspillage alimentaire
            </LayoutDescription>
          </div>
        </div>
      </LayoutHeader>
      <LayoutActions>
        <Link
          href={`/orgs/${params.orgSlug}/timer`}
          className={buttonVariants({ variant: "neubrutalism-outline" })}
        >
          <Timer className="mr-2 size-4" />
          Minuteur
        </Link>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-6 lg:gap-8">
        <Suspense
          fallback={
            <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-muted h-32 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          }
        >
          <EggStatsCards />
        </Suspense>
        <EggBoxGrid eggBoxes={eggBoxes} />
      </LayoutContent>
    </Layout>
  );
}
