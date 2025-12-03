import { getRequiredCurrentFridge } from "@/lib/fridge/get-fridge-access";
import type { Metadata } from "next";
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
  const fridgeAccess = await getRequiredCurrentFridge();

  return (
    <InjectCurrentFridgeStore fridge={fridgeAccess}>
      <FridgeNavigation role={fridgeAccess.role}>{children}</FridgeNavigation>
    </InjectCurrentFridgeStore>
  );
}
