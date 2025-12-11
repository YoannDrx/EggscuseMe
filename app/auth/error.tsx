"use client";

import { NeoButton } from "@/components/neo/neo-button";
import {
  NeoCard,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <NeoCard variant="elevated" padding="lg">
      <NeoCardHeader>
        <NeoCardTitle>
          Sorry, something went wrong. Please try again later.
        </NeoCardTitle>
      </NeoCardHeader>
      <NeoCardFooter>
        <NeoButton onClick={reset}>Try again</NeoButton>
      </NeoCardFooter>
    </NeoCard>
  );
}
