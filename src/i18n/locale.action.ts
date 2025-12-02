"use server";

import { cookies } from "next/headers";
import { type Locale, locales } from "./config";
import { LOCALE_COOKIE_NAME } from "./request";

export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
