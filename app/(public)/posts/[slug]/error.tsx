"use client";

import {
  NeoButton,
  NeoCard,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { Layout, LayoutHeader, LayoutTitle } from "@/features/page/layout";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Error with post.</LayoutTitle>
      </LayoutHeader>
      <NeoCard>
        <NeoCardHeader>
          <NeoCardTitle>
            Sorry, the post you are looking for doesn't work as expected. Please
            try again later.
          </NeoCardTitle>
        </NeoCardHeader>
        <NeoCardFooter>
          <NeoButton onClick={reset}>Try again</NeoButton>
        </NeoCardFooter>
      </NeoCard>
    </Layout>
  );
}
