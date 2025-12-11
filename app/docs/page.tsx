import {
  NeoButton,
  NeoCard,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getDocs } from "./doc-manager";

export const metadata = {
  title: "Documentation | Lumail",
  description:
    "Everything you need to know about using Lumail for your email marketing",
};

export default function Page(props: PageProps<"/docs">) {
  return (
    <Suspense fallback={null}>
      <DocsPage {...props} />
    </Suspense>
  );
}

async function DocsPage(props: PageProps<"/docs">) {
  const docs = await getDocs();

  const sortedDocs = [...docs].sort((a, b) => {
    // Sort by order if available
    if (a.attributes.order !== undefined && b.attributes.order !== undefined) {
      return a.attributes.order - b.attributes.order;
    }

    // Otherwise sort by title
    return a.attributes.title.localeCompare(b.attributes.title);
  });

  return (
    <div className="grid flex-1 gap-6 sm:grid-cols-2">
      {sortedDocs.map((doc) => (
        <NeoCard key={doc.slug} className="h-fit overflow-hidden">
          {doc.attributes.coverUrl && (
            <div
              className="h-36 bg-cover bg-center"
              style={{ backgroundImage: `url(${doc.attributes.coverUrl})` }}
            />
          )}
          <NeoCardHeader>
            <NeoCardTitle>{doc.attributes.title}</NeoCardTitle>
            <NeoCardDescription>
              {doc.attributes.description}
            </NeoCardDescription>
          </NeoCardHeader>
          <NeoCardFooter>
            <NeoButton asChild variant="outline">
              <Link href={`/docs/${doc.slug}`}>
                Read More <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </NeoButton>
          </NeoCardFooter>
        </NeoCard>
      ))}
    </div>
  );
}
