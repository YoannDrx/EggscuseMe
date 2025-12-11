import { NeoButton } from "@/components/neo";
import Link from "next/link";
import { AuthButton } from "../auth/auth-button";
import { HeaderBase } from "./header-base";

export function Header() {
  return (
    <HeaderBase>
      <NeoButton asChild variant="ghost" size="sm">
        <Link href="/docs">Docs</Link>
      </NeoButton>
      <NeoButton asChild variant="ghost" size="sm">
        <Link href="/about">About</Link>
      </NeoButton>
      <NeoButton asChild variant="ghost" size="sm">
        <Link href="/contact">Contact</Link>
      </NeoButton>
      <AuthButton />
    </HeaderBase>
  );
}
