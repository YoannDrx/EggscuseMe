import { getRequiredCurrentFridge } from "@/lib/fridge/get-fridge-access";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { FridgeNavigation } from "./_navigation/fridge-navigation";
import { InjectCurrentFridgeStore } from "./use-current-fridge";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("fridge.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function FridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure dynamic rendering for auth-dependent content
  await connection();

  const fridgeAccess = await getRequiredCurrentFridge();

  return (
    <InjectCurrentFridgeStore fridge={fridgeAccess}>
      <FridgeNavigation role={fridgeAccess.role}>{children}</FridgeNavigation>
    </InjectCurrentFridgeStore>
  );
}
