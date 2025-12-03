import { Layout, LayoutContent } from "@/features/page/layout";
import { combineWithParentMetadata } from "@/lib/metadata";

export const generateMetadata = combineWithParentMetadata({
  title: "Paramètres",
  description: "Gérez les paramètres de votre frigo.",
});

export default async function SettingsLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <Layout size="lg">
      <LayoutContent>{props.children}</LayoutContent>
    </Layout>
  );
}
