import { NeoCard, NeoCardHeader, NeoCardTitle } from "@/components/neo";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";

export default function NotFoundPage() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>404 - Not Found</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle>
              The post you are looking for doesn't exist.
            </NeoCardTitle>
          </NeoCardHeader>
        </NeoCard>
      </LayoutContent>
    </Layout>
  );
}
