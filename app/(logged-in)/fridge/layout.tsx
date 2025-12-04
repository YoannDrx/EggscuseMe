import { getRequiredCurrentFridge } from "@/lib/fridge/get-fridge-access";
import type { Metadata } from "next";
import { connection } from "next/server";
import { FridgeNavigation } from "./_navigation/fridge-navigation";
import { InjectCurrentFridgeStore } from "./use-current-fridge";

export const metadata: Metadata = {
  title: "Mon Frigo | EggscuseMe",
  description: "Gérez vos œufs et réduisez le gaspillage alimentaire",
};

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
