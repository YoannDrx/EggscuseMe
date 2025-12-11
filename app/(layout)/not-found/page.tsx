import {
  NeoButton,
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <NeoCard className="mx-auto w-full max-w-md">
      <NeoCardHeader className="text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive size-6" />
        </div>
        <NeoCardTitle className="text-2xl">Page Not Found</NeoCardTitle>
        <NeoCardDescription>
          The page you're looking for doesn't exist or you don't have access to
          it
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4 text-sm">
          <p className="mb-2 font-medium">What might have happened?</p>
          <p className="text-muted-foreground">
            The page may have been moved, deleted, or you might have mistyped
            the URL. If you believe you should have access to this resource,
            please contact your administrator.
          </p>
        </div>
      </NeoCardContent>
      <NeoCardFooter className="flex justify-center border-t pt-6">
        <NeoButton asChild variant="primary">
          <Link href="/">Return to Home</Link>
        </NeoButton>
      </NeoCardFooter>
    </NeoCard>
  );
}
