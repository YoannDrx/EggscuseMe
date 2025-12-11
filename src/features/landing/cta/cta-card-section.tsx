"use client";

import { Typography } from "@/components/nowts/typography";
import { NeoButton, NeoCard } from "@/components/neo";
import Link from "next/link";
import { SectionLayout } from "../section-layout";

export function CTASectionCard() {
  return (
    <SectionLayout>
      <NeoCard className="relative isolate overflow-hidden py-24 text-center shadow-2xl lg:rounded-3xl">
        <Typography
          as="h2"
          className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl"
        >
          Boost your productivity today
        </Typography>
        <Typography className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-300">
          Create an account and start posting today.
        </Typography>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="#pricing">
            <NeoButton size="lg" asChild>
              <span>Get started</span>
            </NeoButton>
          </Link>

          <Link href="#">
            <NeoButton size="lg" variant="outline" asChild>
              <span>
                Learn more
                <span aria-hidden="true">→</span>
              </span>
            </NeoButton>
          </Link>
        </div>
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
        >
          <circle
            r={512}
            cx={512}
            cy={512}
            fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
      </NeoCard>
    </SectionLayout>
  );
}
