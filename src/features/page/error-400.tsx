import {
  NeoButton,
  NeoCard,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Typography } from "../../components/nowts/typography";
import { ContactSupportDialog } from "../contact/support/contact-support-dialog";

type Page400Props = PropsWithChildren<{
  title?: string;
}>;

export function Error400(props: Page400Props) {
  return (
    <NeoCard className="w-full">
      <NeoCardHeader className="flex flex-col">
        <Typography variant="code">400</Typography>
        <NeoCardTitle>{props.title ?? "Bad request"}</NeoCardTitle>
        <NeoCardDescription>
          It seems we're experiencing some technical difficulties. Not to worry,
          our team is working on it. In the meantime, try refreshing the page or
          visiting us a bit later.
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardFooter className="flex flex-row gap-2">
        <NeoButton asChild variant="outline">
          <Link href="/">Go back home</Link>
        </NeoButton>
        <ContactSupportDialog />
      </NeoCardFooter>
    </NeoCard>
  );
}
