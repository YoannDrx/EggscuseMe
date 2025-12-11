import {
  NeoCard,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import type { PropsWithChildren } from "react";
import { Typography } from "../../components/nowts/typography";
import { ContactSupportDialog } from "../contact/support/contact-support-dialog";

type Error401Props = PropsWithChildren<{
  title?: string;
}>;

export function Error401(props: Error401Props) {
  return (
    <NeoCard className="w-full max-w-lg">
      <NeoCardHeader className="flex flex-col">
        <Typography variant="code">401</Typography>
        <NeoCardTitle>{props.title ?? "Unauthorized"}</NeoCardTitle>
        <NeoCardDescription>
          You don't have permission to access this resource. Please sign in or
          contact your administrator if you believe this is a mistake.
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardFooter className="flex flex-row gap-2">
        <ContactSupportDialog />
      </NeoCardFooter>
    </NeoCard>
  );
}
